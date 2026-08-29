from django.test import TestCase, override_settings
from django.contrib.auth import get_user_model
from unittest.mock import patch, MagicMock
from .models import Curso, PerfilUsuario, CursoMatch
from .compatibility_service import calcular_e_persistir_matches, get_user_base_scores, calcular_confianca_questionario

User = get_user_model()

@override_settings(
    CELERY_TASK_ALWAYS_EAGER=True,
    CELERY_BROKER_URL='memory://',
    CELERY_RESULT_BACKEND='cache+memory://'
)
class CompatibilityScoringTestCase(TestCase):
    def setUp(self):
        # Create user
        self.user = User.objects.create_user(
            username="teststudent",
            email="student@nexo.com",
            password="testpassword123",
            curso_tecnico="Desenvolvimento de Sistemas"
        )
        # Create PerfilUsuario
        self.perfil = PerfilUsuario.objects.create(
            user=self.user,
            logica=80,
            criatividade=30,
            foco=75,
            comunicacao=60,
            lideranca=70,
            matematica=85,
            fisica=50,
            programacao=90,
            desenho=20,
            portugues=70,
            biologia=40,
            quimica=45,
            historia=50
        )
        # Create courses
        self.curso_tech = Curso.objects.create(
            id=1,
            nome="Ciência da Computação",
            tipo="Bacharelado",
            duracao="4 anos",
            descricao="Curso voltado para computação, programação e algoritmos.",
            area="tecnologia",
            tags_raw="Tecnologia, Lógica, Programação"
        )
        self.curso_art = Curso.objects.create(
            id=2,
            nome="Design Gráfico",
            tipo="Bacharelado",
            duracao="4 anos",
            descricao="Curso voltado para criação visual, desenho e estética.",
            area="artes",
            tags_raw="Artes, Desenho, Design"
        )

    def test_base_profile_scores(self):
        scores = get_user_base_scores(self.user)
        self.assertEqual(scores['logica'], 80)
        self.assertEqual(scores['programacao'], 90)

    def test_confidence_indicator_calculation(self):
        conf = calcular_confianca_questionario(self.user)
        self.assertEqual(conf, "ALTA CONFIANÇA")

        # Set all scores to be identical (very neutral answers) to test low dispersion
        self.perfil.logica = 50
        self.perfil.criatividade = 50
        self.perfil.foco = 50
        self.perfil.comunicacao = 50
        self.perfil.lideranca = 50
        self.perfil.matematica = 50
        self.perfil.fisica = 50
        self.perfil.programacao = 50
        self.perfil.desenho = 50
        self.perfil.portugues = 50
        self.perfil.biologia = 50
        self.perfil.quimica = 50
        self.perfil.historia = 50
        self.perfil.save()

        conf_neutral = calcular_confianca_questionario(self.user)
        self.assertEqual(conf_neutral, "RESULTADO IMPRECISO")

    @patch('requests.post')
    def test_compatibility_ai_scoring(self, mock_post):
        # Mock Gemini API response for bulk courses matching
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "candidates": [{
                "content": {
                    "parts": [{
                        "text": '[{"curso_id": 1, "score_final": 95, "score_tecnico": 90, "score_comportamental": 98, "score_pragmatico": 85}, {"curso_id": 2, "score_final": 40, "score_tecnico": 35, "score_comportamental": 45, "score_pragmatico": 50}]'
                    }]
                }
            }]
        }
        mock_post.return_value = mock_response

        # Temporarily ensure API key is present in environment so API flow is tested
        with patch.dict('os.environ', {'GEMINI_API_KEY': 'testkey'}):
            calcular_e_persistir_matches(self.user)

        # Check matches in DB
        match_tech = CursoMatch.objects.get(user=self.user, curso=self.curso_tech)
        match_art = CursoMatch.objects.get(user=self.user, curso=self.curso_art)

        self.assertEqual(match_tech.score_final, 95)
        self.assertEqual(match_art.score_final, 40)

    @patch('requests.post')
    def test_api_submit_questionnaire_array_format(self, mock_post):
        from rest_framework.test import APIClient
        from accounts.models import Pergunta, Opcao
        
        # Mock Gemini API response for bulk courses matching
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "candidates": [{
                "content": {
                    "parts": [{
                        "text": '[{"curso_id": 1, "score_final": 95, "score_tecnico": 90, "score_comportamental": 98, "score_pragmatico": 85}, {"curso_id": 2, "score_final": 40, "score_tecnico": 35, "score_comportamental": 45, "score_pragmatico": 50}]'
                    }]
                }
            }]
        }
        mock_post.return_value = mock_response

        # Create questions/options in database
        pergunta1 = Pergunta.objects.create(id=1, pergunta="Questão 1", categoria="Geral", icone_categoria="star")
        Opcao.objects.create(pergunta=pergunta1, chave="a", label="Opção A", descricao="Desc A", icone="star", peso={"logica": 10})
        
        client = APIClient()
        client.force_authenticate(user=self.user)
        
        payload = {
            "respostas": [
                {"pergunta_id": 1, "opcao_chave": "a"}
            ],
            "free_text_motivation": "Adoro programar softwares novos e resolver desafios lógicos.",
            "free_text_daily_life": "Em um escritório escrevendo código e tomando café.",
            "free_text_dislikes": "Não gosto de tarefas físicas repetitivas ou ambientes barulhentos."
        }
        
        with patch.dict('os.environ', {'GEMINI_API_KEY': 'testkey'}):
            response = client.post("/api/questionario/respostas/", payload, format="json")
        self.assertEqual(response.status_code, 200)
        
        # Reload user from DB to verify free text fields saved
        self.user.refresh_from_db()
        self.assertEqual(self.user.free_text_motivation, "Adoro programar softwares novos e resolver desafios lógicos.")
