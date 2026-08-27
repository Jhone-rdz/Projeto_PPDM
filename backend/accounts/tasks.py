from celery import shared_task
from .ai_explainability_service import gerar_explicabilidade_match

@shared_task
def gerar_explicabilidade_task(match_id):
    """
    Asynchronously calls the explainability service to generate an explanation paragraph
    for a specific user-course compatibility match.
    """
    print(f"Starting explainability task for match ID {match_id}...")
    result = gerar_explicabilidade_match(match_id)
    print(f"Finished explainability task for match ID {match_id} with result: {result}")
    return result
