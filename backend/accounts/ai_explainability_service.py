import json
import re
import requests
import os
from django.conf import settings
from .models import CursoMatch

def extrair_scores_texto_livre(user):
    """
    Extracts behavioral sub-scores from the user's free text fields using Gemini Structured Output.
    """
    api_key = os.environ.get("GEMINI_API_KEY") or getattr(settings, "GEMINI_API_KEY", None)
    if not api_key:
        return None

    motivation = (user.free_text_motivation or "").strip()
    daily_life = (user.free_text_daily_life or "").strip()
    dislikes = (user.free_text_dislikes or "").strip()

    combined_text = f"Motivação: {motivation}\nRotina Ideal: {daily_life}\nO que detesta: {dislikes}".strip()
    if not combined_text or len(combined_text) < 10:
        return None

    prompt = (
        f"Analise o seguinte relato escrito por um estudante sobre suas preferências profissionais e retorne exclusivamente um objeto JSON "
        f"mapeando pontuações estimadas de 0 a 100 para quatro eixos comportamentais fundamentais:\n\n"
        f"Relato do Estudante:\n\"{combined_text}\"\n\n"
        f"Esquema JSON esperado:\n"
        f"{{\n"
        f"  \"analitico_criativo\": <int, preferência por análise/lógica vs criatividade/subjetividade (maior = mais analítico)>,\n"
        f"  \"lideranca_tecnico\": <int, preferência por liderança/comunicação vs técnico/individual (maior = mais liderança)>,\n"
        f"  \"pratica_teoria\": <int, preferência por execução/prática vs pesquisa/teoria (maior = mais prático)>,\n"
        f"  \"rotina_autonomia\": <int, preferência por rotina/estrutura vs autonomia/ambiguidade (maior = mais rotina)>\n"
        f"}}\n\n"
        f"Responda APENAS com o bloco JSON válido. Não inclua nenhuma introdução ou texto explicativo."
    )

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={api_key}"
    payload = {
        "contents": [{
            "parts": [{"text": prompt}]
        }],
        "generationConfig": {
            "responseMimeType": "application/json"
        }
    }

    try:
        response = requests.post(url, json=payload, headers={"Content-Type": "application/json"}, timeout=12)
        if response.status_code == 200:
            res_data = response.json()
            parts = res_data.get("candidates", [])[0].get("content", {}).get("parts", [])
            if parts:
                raw_text = parts[0].get("text", "").strip()
                # Clean markdown JSON tags if present
                clean_json = re.sub(r"^```json\s*|\s*```$", "", raw_text, flags=re.MULTILINE).strip()
                scores = json.loads(clean_json)
                return {
                    'analitico_criativo': int(scores.get('analitico_criativo', 50)),
                    'lideranca_tecnico': int(scores.get('lideranca_tecnico', 50)),
                    'pratica_teoria': int(scores.get('pratica_teoria', 50)),
                    'rotina_autonomia': int(scores.get('rotina_autonomia', 50))
                }
    except Exception as e:
        print(f"Error extracting structured scores from free text: {e}")
    return None

def gerar_explicabilidade_match(match_id):
    """
    Uses Gemini Structured Output to refine the match score (providing high contrast)
    and generate a welcoming explanation.
    """
    try:
        match_obj = CursoMatch.objects.get(id=match_id)
    except CursoMatch.DoesNotExist:
        return False

    api_key = os.environ.get("GEMINI_API_KEY") or getattr(settings, "GEMINI_API_KEY", None)
    if not api_key:
        match_obj.explicacao = "Compatibilidade calculada com sucesso baseada em suas respostas."
        match_obj.explicacao_status = 'completed'
        match_obj.save()
        return True

    user = match_obj.user
    curso = match_obj.curso
    sub_scores = match_obj.sub_scores

    prompt = (
        f"Você é o Nexo, um orientador de carreiras inteligente para estudantes do ensino médio. "
        f"Analise a compatibilidade do estudante com o curso de '{curso.nome}' (Área: {curso.area}, Tipo: {curso.tipo}, Descrição: {curso.descricao}).\n\n"
        f"Considere os relatos de texto livre do estudante:\n"
        f"- Motivação: {(user.free_text_motivation or '').strip()}\n"
        f"- Rotina Ideal: {(user.free_text_daily_life or '').strip()}\n"
        f"- O que detesta: {(user.free_text_dislikes or '').strip()}\n\n"
        f"Considere também os scores calculados deterministicamente (de 0 a 100):\n"
        f"- Score Matemático Preliminar: {match_obj.score_final}%\n"
        f"- Proximidade MEC: {sub_scores.get('eixo_mec_fit', 50)}%\n"
        f"- Afinidade com disciplinas exigidas: {sub_scores.get('disciplinas_fit', 50)}%\n"
        f"- Perfil Lógico/Analítico (vs Criativo): {sub_scores.get('eixo_analitico_criativo', 50)}%\n"
        f"- Habilidade de Liderança/Comunicação: {sub_scores.get('eixo_lideranca_tecnico', 50)}%\n"
        f"- Preferência Prática/Mão na Massa: {sub_scores.get('eixo_pratica_teoria', 50)}%\n"
        f"- Trilha de Match: {sub_scores.get('trilha', 'Natural')}\n\n"
        f"Você deve retornar exclusivamente um objeto JSON com duas chaves:\n"
        f"1. 'refined_score': um número inteiro de 10 a 100. Você deve ajustar o score_final baseado nas suas conclusões. "
        f"Atenção: Aumente bastante o contraste das compatibilidades. Se o curso for alinhado com as reais preferências do aluno, "
        f"suba o score (máximo 98%). Se o curso for fora de interesse ou conflitante com o que o aluno detesta, reduza o score significativamente (mínimo 10%). "
        f"Evite scores na faixa neutra de 70-80% para cursos não alinhados; queremos notas bem distribuídas com base nas preferências.\n"
        f"2. 'explicacao': uma explicação acolhedora de 2 a 3 frases em português, justificando o match e ressaltando as forças ou fraquezas identificadas de forma construtiva.\n\n"
        f"Esquema JSON esperado:\n"
        f"{{\n"
        f"  \"refined_score\": <int>,\n"
        f"  \"explicacao\": \"<string>\"\n"
        f"}}\n\n"
        f"Responda apenas com o JSON válido."
    )

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={api_key}"
    payload = {
        "contents": [{
            "parts": [{"text": prompt}]
        }],
        "generationConfig": {
            "responseMimeType": "application/json"
        }
    }

    try:
        response = requests.post(url, json=payload, headers={"Content-Type": "application/json"}, timeout=12)
        if response.status_code == 200:
            res_data = response.json()
            parts = res_data.get("candidates", [])[0].get("content", {}).get("parts", [])
            if parts:
                import json
                import re
                raw_text = parts[0].get("text", "").strip()
                clean_json = re.sub(r"^```json\s*|\s*```$", "", raw_text, flags=re.MULTILINE).strip()
                result = json.loads(clean_json)
                
                refined_score = int(result.get("refined_score", match_obj.score_final))
                explicacao = result.get("explicacao", "Compatibilidade calculada com sucesso.")
                
                # Update match values
                match_obj.score_final = max(10, min(100, refined_score))
                match_obj.explicacao = explicacao
                match_obj.explicacao_status = 'completed'
                match_obj.save()
                return True
        
        match_obj.explicacao_status = 'failed'
        match_obj.save()
    except Exception as e:
        print(f"Error generating match explanation and refined score: {e}")
        match_obj.explicacao_status = 'failed'
        match_obj.save()

    return False
