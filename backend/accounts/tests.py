from django.test import TestCase, override_settings
from django.contrib.auth import get_user_model
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
            nome="Ciência da Computação",
            tipo="Bacharelado",
            duracao="4 anos",
            descricao="Curso voltado para computação, programação e algoritmos.",
            area="tecnologia",
            tags_raw="Tecnologia, Lógica, Programação"
        )
        self.curso_art = Curso.objects.create(
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

    def test_compatibility_outlier_penalty(self):
        # Create another user where a behavioral subscore will drop below 25%
        outlier_user = User.objects.create_user(
            username="outlierstudent",
            email="outlier@nexo.com",
            password="testpassword123",
            curso_tecnico="Desenvolvimento de Sistemas"
        )
        # Create PerfilUsuario with extremely low logica/foco resulting in outlier penalty
        PerfilUsuario.objects.create(
            user=outlier_user,
            logica=10, # Outlier behavior
            criatividade=50,
            foco=10, # Outlier behavior
            comunicacao=50,
            lideranca=50,
            matematica=50,
            fisica=50,
            programacao=50,
            desenho=50,
            portugues=50,
            biologia=50,
            quimica=50,
            historia=50
        )

        calcular_e_persistir_matches(outlier_user)
        
        # Check match with computer science
        match = CursoMatch.objects.get(user=outlier_user, curso=self.curso_tech)
        
        # Verify that score incorporates the 0.75 penalty discount
        # CS is tech-based, so it will fall in the Natural path (weights 50% tech, 30% comp, 20% prag)
        # Tech subscore: MEC fit (100) + disciplinas (CS reqs: logica, mat, prog average = 10+50+50=36.6) + maturity (35) -> tec = 100*0.4 + 36.6*0.4 + 35*0.2 = 61.64
        # Behavioral subscore is outlier (< 25)
        # Score final should be low
        self.assertLess(match.score_final, 50)

    def test_api_submit_questionnaire_array_format(self):
        from rest_framework.test import APIClient
        from accounts.models import Pergunta, Opcao
        
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
        
        response = client.post("/api/questionario/respostas/", payload, format="json")
        self.assertEqual(response.status_code, 200)
        
        # Reload user from DB to verify free text fields saved
        self.user.refresh_from_db()
        self.assertEqual(self.user.free_text_motivation, "Adoro programar softwares novos e resolver desafios lógicos.")
