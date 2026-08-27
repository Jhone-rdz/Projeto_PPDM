import math
from django.conf import settings
from .models import Curso, CursoMatch, RespostaUsuario, Opcao
from .views import get_fallback_profile
import requests
import os

# Weights of pilares per path
PESOS_TRILHAS = {
    'natural': {'tecnica': 0.50, 'comportamental': 0.30, 'pragmatica': 0.20},
    'hibrido': {'tecnica': 0.30, 'comportamental': 0.40, 'pragmatica': 0.30},
    'novos_horizontes': {'tecnica': 0.10, 'comportamental': 0.60, 'pragmatica': 0.30}
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

def calcular_e_persistir_matches(user):
    """
    Computes matches for all courses, checks trilha configurations, applies
    multiplicative outlier discount, incorporates free-text embeddings, and persists.
    """
    from .tasks import gerar_explicabilidade_task  # Celery task imported here
    from .ai_explainability_service import extrair_scores_texto_livre

    # Extract behavioral scores from free text if present
    extraido_scores = extrair_scores_texto_livre(user)

    # Get user closed-question scores
    scores = get_user_base_scores(user)
    user_tech = (user.curso_tecnico or "").strip().lower()
    
    # Calculate user answers embedding from free text motivation & Daily life (if present)
    user_free_text = " ".join(filter(None, [user.free_text_motivation, user.free_text_daily_life, user.free_text_dislikes])).strip()
    user_embedding = get_embedding(user_free_text) if user_free_text else None
    
    # Confidence level
    confianca = calcular_confianca_questionario(user)
    
    # Process all courses
    cursos = Curso.objects.all()
    for curso in cursos:
        course_area = curso.area.lower()
        
        # 1. Bagagem Técnica Pilar
        if "desenvolvimento" in user_tech or "informática" in user_tech or "redes" in user_tech:
            eixo_mec_fit = 100 if course_area == 'tecnologia' else (35 if course_area in ['negocios', 'agronomia'] else 15)
        elif "administração" in user_tech:
            eixo_mec_fit = 100 if course_area == 'negocios' else (45 if course_area == 'tecnologia' else 25)
        elif "enfermagem" in user_tech:
            eixo_mec_fit = 100 if course_area == 'saude' else 25
        elif "agropecuária" in user_tech:
            eixo_mec_fit = 100 if course_area == 'agronomia' else 25
        else:
            eixo_mec_fit = 55

        # Overlapping disciplines calculation
        from accounts.serializers import get_course_requirements
        reqs = get_course_requirements(curso.nome, course_area)
        if reqs:
            disciplinas_fit = sum(scores.get(attr, 50) for attr in reqs.keys()) / len(reqs)
        else:
            disciplinas_fit = scores.get(course_area, 50)
            
        maturidade_pratica = min(100, 35 + (user.xp // 5))
        score_tecnico = round((eixo_mec_fit * 0.4) + (disciplinas_fit * 0.4) + (maturidade_pratica * 0.2))

        # 2. Perfil Comportamental Pilar
        if course_area in ['tecnologia', 'saude', 'agronomia']:
            eixo_analitico_criativo = (scores.get('logica', 50) * 0.6) + (scores.get('matematica', 50) * 0.4)
        else:
            eixo_analitico_criativo = (scores.get('criatividade', 50) * 0.6) + (scores.get('desenho', 50) * 0.4)

        if course_area == 'negocios':
            eixo_lideranca_tecnico = (scores.get('lideranca', 50) * 0.5) + (scores.get('comunicacao', 50) * 0.5)
        else:
            eixo_lideranca_tecnico = (scores.get('logica', 50) * 0.7) + (scores.get('foco', 50) * 0.3)

        eixo_pratica_teoria = (scores.get('foco', 50) * 0.6) + (scores.get('programacao', 50) * 0.4)
        eixo_rotina_autonomia = (scores.get('logica', 50) * 0.5) + (scores.get('foco', 50) * 0.5)

        # Complement closed questions with structured output from free text if present
        if extraido_scores:
            eixo_analitico_criativo = (eixo_analitico_criativo * 0.70) + (extraido_scores.get('analitico_criativo', 50) * 0.30)
            eixo_lideranca_tecnico = (eixo_lideranca_tecnico * 0.70) + (extraido_scores.get('lideranca_tecnico', 50) * 0.30)
            eixo_pratica_teoria = (eixo_pratica_teoria * 0.70) + (extraido_scores.get('pratica_teoria', 50) * 0.30)
            eixo_rotina_autonomia = (eixo_rotina_autonomia * 0.70) + (extraido_scores.get('rotina_autonomia', 50) * 0.30)

        # Embedding Semantic Similarity Sub-axis
        similarity_score = 50.0
        if user_embedding and curso.embedding:
            similarity = cosine_similarity(user_embedding, curso.embedding)
            # Scale cosine similarity [-1, 1] or [0, 1] to [0, 100] range
            similarity_score = max(0.0, min(100.0, similarity * 100.0))

        # Average behavioral scores incorporating semantic matching if present
        if user_embedding and curso.embedding:
            score_comportamental = round((eixo_analitico_criativo * 0.25) + (eixo_lideranca_tecnico * 0.25) + (eixo_pratica_teoria * 0.2) + (eixo_rotina_autonomia * 0.2) + (similarity_score * 0.1))
        else:
            score_comportamental = round((eixo_analitico_criativo + eixo_lideranca_tecnico + eixo_pratica_teoria + eixo_rotina_autonomia) / 4)

        # 3. Metas Pragmáticas Pilar
        fit_modalidade = 90
        fit_duracao = 95 if "tecnólogo" in curso.tipo.lower() else 75
        fit_financeiro = 85
        score_pragmatico = round((fit_modalidade * 0.4) + (fit_duracao * 0.4) + (fit_financeiro * 0.2))

        # 4. Auto-detect path
        is_same_area = False
        is_related = False
        if "desenvolvimento" in user_tech or "informática" in user_tech or "redes" in user_tech:
            is_same_area = (course_area == 'tecnologia')
            is_related = (course_area in ['negocios', 'direito'])
        elif "administração" in user_tech:
            is_same_area = (course_area == 'negocios')
            is_related = (course_area in ['tecnologia', 'direito'])
        elif "enfermagem" in user_tech:
            is_same_area = (course_area == 'saude')
            is_related = (course_area in ['agronomia'])
        elif "agropecuária" in user_tech:
            is_same_area = (course_area == 'agronomia')
            is_related = (course_area in ['saude'])

        if is_same_area:
            w_tec, w_comp, w_prag = 0.50, 0.30, 0.20
            trilha = 'Natural'
        elif is_related:
            w_tec, w_comp, w_prag = 0.30, 0.40, 0.30
            trilha = 'Híbrido'
        else:
            w_tec, w_comp, w_prag = 0.10, 0.60, 0.30
            trilha = 'Novos Horizontes'

        score_geral = (score_tecnico * w_tec) + (score_comportamental * w_comp) + (score_pragmatico * w_prag)

        # 5. Outliers Behavioral Penalty (floor 25%)
        has_outlier = (
            eixo_analitico_criativo < PISO_CRITICO_COMPORTAMENTAL or
            eixo_lideranca_tecnico < PISO_CRITICO_COMPORTAMENTAL or
            eixo_pratica_teoria < PISO_CRITICO_COMPORTAMENTAL or
            eixo_rotina_autonomia < PISO_CRITICO_COMPORTAMENTAL
        )
        if has_outlier:
            score_final_val = score_geral * FATOR_DESCONTO_OUTLIER
        else:
            score_final_val = score_geral

        # Normalize score limits
        score_final = int(max(10, min(100, score_final_val)))

        # Sub-scores structure to save
        sub_scores_data = {
            'eixo_mec_fit': eixo_mec_fit,
            'disciplinas_fit': disciplinas_fit,
            'maturidade_pratica': maturidade_pratica,
            'eixo_analitico_criativo': eixo_analitico_criativo,
            'eixo_lideranca_tecnico': eixo_lideranca_tecnico,
            'eixo_pratica_teoria': eixo_pratica_teoria,
            'eixo_rotina_autonomia': eixo_rotina_autonomia,
            'eixo_semantico_embeddings': similarity_score,
            'fit_modalidade': fit_modalidade,
            'fit_duracao': fit_duracao,
            'fit_financeiro': fit_financeiro,
            'trilha': trilha
        }

        # Save to database
        match_obj, created = CursoMatch.objects.update_or_create(
            user=user,
            curso=curso,
            defaults={
                'score_final': score_final,
                'score_tecnico': score_tecnico,
                'score_comportamental': score_comportamental,
                'score_pragmatico': score_pragmatico,
                'sub_scores': sub_scores_data
            }
        )

        # Trigger explainability asynchronously
        gerar_explicabilidade_task.delay(match_obj.id)
