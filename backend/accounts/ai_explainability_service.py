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

    prompt = (
        f"Você é o Nexo, um orientador de carreiras amigável e inteligente para estudantes do ensino médio. "
        f"Gere um resumo curto de 2 a 3 frases explicando por que o curso de '{curso.nome}' é compatível com o estudante (Match de {match_obj.score_final}%).\n\n"
        f"Relatos do estudante:\n"
        f"- Motivação: {(user.free_text_motivation or '').strip()}\n"
        f"- Rotina Ideal: {(user.free_text_daily_life or '').strip()}\n"
        f"- O que detesta: {(user.free_text_dislikes or '').strip()}\n\n"
        f"Pontuações do Match:\n"
        f"- Geral: {match_obj.score_final}%\n"
        f"- Técnico: {match_obj.score_tecnico}%\n"
        f"- Comportamental: {match_obj.score_comportamental}%\n"
        f"- Pragmático: {match_obj.score_pragmatico}%\n\n"
        f"Você deve retornar exclusivamente um objeto JSON com uma chave:\n"
        f"1. 'explicacao': uma explicação em português inspiradora e acolhedora de 2 a 3 frases justificando a compatibilidade de {match_obj.score_final}% e destacando os pontos fortes que unem o aluno ao curso de forma construtiva.\n\n"
        f"Esquema JSON esperado:\n"
        f"{{\n"
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
                
                explicacao = result.get("explicacao", "Compatibilidade calculada com sucesso.")
                
                # Update match explanation values only
                match_obj.explicacao = explicacao
                match_obj.explicacao_status = 'completed'
                match_obj.save()
                return True
        
        match_obj.explicacao = "Compatibilidade calculada com base em suas afinidades de grade e objetivo de carreira."
        match_obj.explicacao_status = 'completed'
        match_obj.save()
    except Exception as e:
        print(f"Error generating match explanation: {e}")
        match_obj.explicacao = "Compatibilidade calculada com base em suas afinidades de grade e objetivo de carreira."
        match_obj.explicacao_status = 'completed'
        match_obj.save()

    return False
