import math
from django.conf import settings
from .models import Curso, CursoMatch, RespostaUsuario, Opcao
from .views import get_fallback_profile
import requests
import os

# Weights of pilares per path
PESOS_TRILHAS = {
    'natural': {'tecnica': 0.50, 'comportamental': 0.35, 'pragmatica': 0.15},
    'hibrido': {'tecnica': 0.35, 'comportamental': 0.45, 'pragmatica': 0.20},
    'novos_horizontes': {'tecnica': 0.25, 'comportamental': 0.55, 'pragmatica': 0.20}
}

PISO_CRITICO_COMPORTAMENTAL = 25.0
FATOR_DESCONTO_OUTLIER = 0.75

def get_embedding(text):
    """
    Get vector embedding from Gemini Embedding API.
    """
    api_key = os.environ.get("GEMINI_API_KEY") or getattr(settings, "GEMINI_API_KEY", None)
    if not api_key or not text.strip():
        return None
    
    url = f"https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key={api_key}"
    payload = {
        "model": "models/text-embedding-004",
        "content": {"parts": [{"text": text}]}
    }
    try:
        response = requests.post(url, json=payload, headers={"Content-Type": "application/json"}, timeout=10)
        if response.status_code == 200:
            return response.json().get("embedding", {}).get("values", [])
    except Exception as e:
        print(f"Error calling embedding API: {e}")
    return None

def cosine_similarity(v1, v2):
    if not v1 or not v2 or len(v1) != len(v2):
        return 0.0
    dot_product = sum(x * y for x, y in zip(v1, v2))
    norm_v1 = math.sqrt(sum(x * x for x in v1))
    norm_v2 = math.sqrt(sum(x * x for x in v2))
    if norm_v1 == 0 or norm_v2 == 0:
        return 0.0
    return float(dot_product / (norm_v1 * norm_v2))

def get_user_base_scores(user):
    """
    Get the basic 13 strengths and disciplines scores from user's PerfilUsuario.
    """
    try:
        perfil = user.perfil
        return {
            'logica': perfil.logica,
            'criatividade': perfil.criatividade,
            'foco': perfil.foco,
            'comunicacao': perfil.comunicacao,
            'lideranca': perfil.lideranca,
            'matematica': perfil.matematica,
            'fisica': perfil.fisica,
            'programacao': perfil.programacao,
            'desenho': perfil.desenho,
            'portugues': perfil.portugues,
            'biologia': perfil.biologia,
            'quimica': perfil.quimica,
            'historia': perfil.historia,
        }
    except Exception:
        fb = get_fallback_profile(user.curso_tecnico)
        return {
            'logica': fb.get('logica', 50),
            'criatividade': fb.get('criatividade', 50),
            'foco': fb.get('foco', 50),
            'comunicacao': fb.get('comunicacao', 50),
            'lideranca': fb.get('lideranca', 50),
            'matematica': fb.get('matematica', 50),
            'fisica': fb.get('fisica', 50),
            'programacao': fb.get('programacao', 50),
            'desenho': fb.get('desenho', 50),
            'portugues': fb.get('portugues', 50),
            'biologia': fb.get('biologia', 50),
            'quimica': fb.get('quimica', 50),
            'historia': fb.get('historia', 50),
        }

def calcular_confianca_questionario(user):
    """
    Calculates result confidence indicator based on answers scale dispersion.
    We check options weight structures. If standard deviation of base profile scores is low (< 8.0),
    it means responses are very neutral.
    """
    scores = get_user_base_scores(user)
    profile_vals = list(scores.values())
    if not profile_vals:
        return "RESULTADO IMPRECISO"
    
    mean_val = sum(profile_vals) / len(profile_vals)
    variance = sum((x - mean_val) ** 2 for x in profile_vals) / len(profile_vals)
    std_dev = math.sqrt(variance)
    return "ALTA CONFIANÇA" if std_dev >= 8.0 else "RESULTADO IMPRECISO"

def run_fallback_calculation(user):
    """
    Simple, robust mathematical fallback if Gemini API is offline.
    """
    scores = get_user_base_scores(user)
    user_tech = (user.curso_tecnico or "").strip().lower()
    
    objetivo_map = {
        'tecnologia': 'tecnologia',
        'saúde': 'saude',
        'negócios': 'negocios',
        'artes e design': 'artes',
        'direito e justiça': 'direito',
        'agronomia e meio ambiente': 'agronomia',
    }
    user_pref_area = (user.objetivo_carreira or "").strip().lower()
    mapped_pref_area = objetivo_map.get(user_pref_area, None)

    for curso in Curso.objects.all():
        course_area = curso.area.lower()
        
        # Base technical fit
        if "desenvolvimento" in user_tech or "informática" in user_tech or "redes" in user_tech:
            eixo_mec_fit = 100 if course_area == 'tecnologia' else (25 if course_area in ['negocios', 'agronomia'] else 5)
        elif "administração" in user_tech:
            eixo_mec_fit = 100 if course_area == 'negocios' else (35 if course_area == 'tecnologia' else 10)
        elif "enfermagem" in user_tech:
            eixo_mec_fit = 100 if course_area == 'saude' else 10
        elif "agropecuária" in user_tech:
            eixo_mec_fit = 100 if course_area == 'agronomia' else 10
        else:
            eixo_mec_fit = 40

        # Adjust based on explicit preference
        if mapped_pref_area:
            if course_area == mapped_pref_area:
                eixo_mec_fit = min(100, eixo_mec_fit + 30)
            else:
                eixo_mec_fit = max(0, eixo_mec_fit - 40)

        score_tecnico = int(max(10, min(100, (eixo_mec_fit * 0.6) + (scores.get('logica', 50) * 0.4))))
        score_comportamental = int(max(10, min(100, (scores.get('logica', 50) + scores.get('foco', 50)) / 2)))
        score_pragmatico = 85 if "tecnólogo" in curso.tipo.lower() else 75
        
        # Combine
        if course_area == mapped_pref_area or (course_area == 'tecnologia' and ("desenvolvimento" in user_tech or "informática" in user_tech or "redes" in user_tech)):
            # Aligned path
            score_final = int(max(10, min(98, (score_tecnico * 0.50) + (score_comportamental * 0.35) + (score_pragmatico * 0.15))))
        else:
            # Unrelated path
            score_final = int(max(10, min(98, (score_tecnico * 0.25) + (score_comportamental * 0.55) + (score_pragmatico * 0.20))))

        # Save to database
        CursoMatch.objects.update_or_create(
            user=user,
            curso=curso,
            defaults={
                'score_final': score_final,
                'score_tecnico': score_tecnico,
                'score_comportamental': score_comportamental,
                'score_pragmatico': score_pragmatico,
                'sub_scores': {
                    'eixo_mec_fit': eixo_mec_fit,
                    'trilha': 'Natural' if course_area == 'tecnologia' else 'Novos Horizontes'
                }
            }
        )

def calcular_e_persistir_matches(user):
    """
    Computes matches for all courses by calling Gemini API in a single bulk request.
    Stores results in CursoMatch. If API is down or key is missing, falls back to a basic local formula.
    """
    import json
    import re
    import requests
    from django.conf import settings
    from .models import Curso, CursoMatch

    api_key = os.environ.get("GEMINI_API_KEY") or getattr(settings, "GEMINI_API_KEY", None)
    if not api_key:
        print("Gemini API key not found. Running fallback deterministic calculation...")
        run_fallback_calculation(user)
        return

    scores = get_user_base_scores(user)
    
    # Gather course details
    cursos = Curso.objects.all()
    if not cursos.exists():
        return

    cursos_info = []
    for c in cursos:
        cursos_info.append(f"ID: {c.id} | Nome: {c.nome} | Área: {c.area} | Tipo: {c.tipo} | Descrição: {c.descricao[:200]}")

    prompt = (
        f"Você é o Nexo, um especialista de IA em orientação profissional para estudantes de ensino médio.\n"
        f"Analise o seguinte perfil de estudante e avalie a compatibilidade dele com uma lista de cursos superiores.\n\n"
        f"Perfil do Estudante:\n"
        f"- Curso Técnico Atual: {user.curso_tecnico or 'Nenhum'}\n"
        f"- Objetivo de Carreira Declarado: {user.objetivo_carreira or 'Indefinido'}\n"
        f"- Motivação: {user.free_text_motivation or ''}\n"
        f"- Rotina de Trabalho Ideal: {user.free_text_daily_life or ''}\n"
        f"- O que detesta no trabalho: {user.free_text_dislikes or ''}\n"
        f"- Notas de Competências (de 0 a 100): {scores}\n\n"
        f"Cursos para avaliar:\n"
        + "\n".join(cursos_info)
        + f"\n\nInstruções Importantes:\n"
        f"1. Você deve retornar exclusivamente um array JSON contendo um objeto para cada um dos cursos listados.\n"
        f"2. Para cada curso, calcule e retorne 4 scores inteiros (de 10 a 98):\n"
        f"   - 'score_final': nota final geral de compatibilidade. Amplie ao máximo o contraste (diferenciação): "
        f"se o curso estiver muito alinhado com a área técnica, com o objetivo declarado do estudante e com o que ele gosta, dê nota entre 85 e 98. "
        f"Se for de outra área sem relação, dê nota entre 10 e 50. Evite notas genéricas (como 70-80) para cursos não alinhados.\n"
        f"   - 'score_tecnico': fit de bagagem técnica e conhecimentos acadêmicos.\n"
        f"   - 'score_comportamental': fit de soft skills, preferências de rotina e estilo de trabalho.\n"
        f"   - 'score_pragmatico': fit de metas práticas de modalidade e inserção rápida.\n"
        f"3. O formato esperado para cada objeto do array JSON é:\n"
        f"   {{\n"
        f"     \"curso_id\": <int>,\n"
        f"     \"score_final\": <int>,\n"
        f"     \"score_tecnico\": <int>,\n"
        f"     \"score_comportamental\": <int>,\n"
        f"     \"score_pragmatico\": <int>\n"
        f"   }}\n\n"
        f"Responda apenas com o array JSON válido, sem introdução ou tags de bloco de código."
    )

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key={api_key}"
    payload = {
        "contents": [{
            "parts": [{"text": prompt}]
        }],
        "generationConfig": {
            "responseMimeType": "application/json"
        }
    }

    try:
        response = requests.post(url, json=payload, headers={"Content-Type": "application/json"}, timeout=25)
        if response.status_code == 200:
            res_data = response.json()
            parts = res_data.get("candidates", [])[0].get("content", {}).get("parts", [])
            if parts:
                raw_text = parts[0].get("text", "").strip()
                clean_json = re.sub(r"^```json\s*|\s*```$", "", raw_text, flags=re.MULTILINE).strip()
                results = json.loads(clean_json)

                # Map responses to dict by course_id
                results_map = {}
                for item in results:
                    c_id = item.get("curso_id")
                    if c_id is not None:
                        results_map[int(c_id)] = item

                # Update database for all courses
                for curso in cursos:
                    item = results_map.get(curso.id)
                    if item:
                        score_final = max(10, min(98, int(item.get("score_final", 50))))
                        score_tecnico = max(10, min(100, int(item.get("score_tecnico", 50))))
                        score_comportamental = max(10, min(100, int(item.get("score_comportamental", 50))))
                        score_pragmatico = max(10, min(100, int(item.get("score_pragmatico", 50))))
                    else:
                        # Fallback for individual course if missing in JSON list
                        score_final = 50
                        score_tecnico = 50
                        score_comportamental = 50
                        score_pragmatico = 50

                    CursoMatch.objects.update_or_create(
                        user=user,
                        curso=curso,
                        defaults={
                            'score_final': score_final,
                            'score_tecnico': score_tecnico,
                            'score_comportamental': score_comportamental,
                            'score_pragmatico': score_pragmatico,
                            'sub_scores': {
                                'trilha': 'Natural' if curso.area.lower() == 'tecnologia' else 'Novos Horizontes'
                            }
                        }
                    )
                return
    except Exception as e:
        print(f"Error in Gemini bulk matches calculation: {e}. Running fallback...")
    
    # If API call fails or times out, run fallback
    run_fallback_calculation(user)
