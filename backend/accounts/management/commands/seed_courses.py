from django.core.management.base import BaseCommand
from django.db import transaction
from accounts.models import Curso

class Command(BaseCommand):
    help = 'Seeds initial compatible courses and careers list'

    @transaction.atomic
    def handle(self, *args, **options):
        self.stdout.write('Seeding courses...')
        
        # Clear existing
        Curso.objects.all().delete()

        courses_data = [
            # Tecnologia
            {
                "nome": "Engenharia de Inteligência Artificial",
                "tipo": "BACHARELADO",
                "duracao": "5 anos",
                "descricao": "Foco no desenvolvimento de algoritmos e sistemas autônomos. Combina matemática, programação e ciência de dados.",
                "area": "tecnologia",
                "tags_raw": "Algoritmos de ML, Visão computacional, Sistemas autônomos",
                "match_percent": 94,
                "icone": "hardware-chip-outline",
                "cor_icone": "#8B5CF6",
                "cor_fundo": "#2D1B69"
            },
            {
                "nome": "Ciência da Computação",
                "tipo": "BACHARELADO",
                "duracao": "4 anos",
                "descricao": "Base profunda em algoritmos, estruturas de dados e teoria da computação. Essencial para criação de softwares e plataformas digitais.",
                "area": "tecnologia",
                "tags_raw": "Algoritmos, Sistemas distribuídos, Pesquisa",
                "match_percent": 91,
                "icone": "code-slash-outline",
                "cor_icone": "#10B981",
                "cor_fundo": "#064E3B"
            },
            {
                "nome": "Engenharia de Software",
                "tipo": "BACHARELADO",
                "duracao": "5 anos",
                "descricao": "Projeto, arquitetura e qualidade de sistemas em larga escala. Forte integração entre lógica e criatividade.",
                "area": "tecnologia",
                "tags_raw": "Arquitetura, DevOps, Qualidade de Software",
                "match_percent": 88,
                "icone": "laptop-outline",
                "cor_icone": "#FFFFFF",
                "cor_fundo": "#4F46E5"
            },
            {
                "nome": "Análise e Desenvolvimento de Sistemas (ADS)",
                "tipo": "TECNÓLOGO",
                "duracao": "2,5 anos",
                "descricao": "Tecnólogo com alta empregabilidade e foco em desenvolvimento web e mobile.",
                "area": "tecnologia",
                "tags_raw": "Desenvolvimento Web, Mobile, Banco de dados",
                "match_percent": 86,
                "icone": "phone-portrait-outline",
                "cor_icone": "#FFFFFF",
                "cor_fundo": "#F59E0B"
            },
            # Saúde
            {
                "nome": "Enfermagem",
                "tipo": "BACHARELADO",
                "duracao": "4 anos",
                "descricao": "Prevenção, promoção de saúde, recuperação de pacientes e gestão de equipes de saúde.",
                "area": "saude",
                "tags_raw": "Cuidado ao Paciente, Pronto Socorro, Saúde Coletiva",
                "match_percent": 89,
                "icone": "heart-outline",
                "cor_icone": "#EC4899",
                "cor_fundo": "#831843"
            },
            {
                "nome": "Fisioterapia",
                "tipo": "BACHARELADO",
                "duracao": "4 anos",
                "descricao": "Prevenção e reabilitação da capacidade funcional e de movimentos do corpo humano.",
                "area": "saude",
                "tags_raw": "Reabilitação física, Ortopedia, Neurologia",
                "match_percent": 85,
                "icone": "body-outline",
                "cor_icone": "#10B981",
                "cor_fundo": "#064E3B"
            },
            {
                "nome": "Nutrição",
                "tipo": "BACHARELADO",
                "duracao": "4 anos",
                "descricao": "Estudo da alimentação e dos impactos dos nutrientes na saúde humana e prevenção de doenças.",
                "area": "saude",
                "tags_raw": "Alimentação saudável, Dietas, Saúde metabólica",
                "match_percent": 82,
                "icone": "restaurant-outline",
                "cor_icone": "#F59E0B",
                "cor_fundo": "#78350F"
            },
            {
                "nome": "Psicologia",
                "tipo": "BACHARELADO",
                "duracao": "5 anos",
                "descricao": "Investigação dos processos mentais, emoções, sentimentos e comportamento humano.",
                "area": "saude",
                "tags_raw": "Saúde Mental, Terapia, Comportamento Humano",
                "match_percent": 90,
                "icone": "people-outline",
                "cor_icone": "#3B82F6",
                "cor_fundo": "#1E3A8A"
            },
            # Negócios
            {
                "nome": "Administração",
                "tipo": "BACHARELADO",
                "duracao": "4 anos",
                "descricao": "Planejamento, organização, liderança e controle de recursos e processos organizacionais.",
                "area": "negocios",
                "tags_raw": "Liderança, Empreendedorismo, Estratégia Corporativa",
                "match_percent": 92,
                "icone": "briefcase-outline",
                "cor_icone": "#F59E0B",
                "cor_fundo": "#78350F"
            },
            {
                "nome": "Ciências Contábeis",
                "tipo": "BACHARELADO",
                "duracao": "4 anos",
                "descricao": "Gestão e controle financeiro de patrimônios de empresas públicas e privadas.",
                "area": "negocios",
                "tags_raw": "Finanças, Auditoria, Tributação, Planejamento",
                "match_percent": 87,
                "icone": "calculator-outline",
                "cor_icone": "#3B82F6",
                "cor_fundo": "#1E3A8A"
            },
            {
                "nome": "Gestão Financeira",
                "tipo": "TECNÓLOGO",
                "duracao": "2 anos",
                "descricao": "Formação rápida focada em análise, controle e investimento de fluxos de recursos empresariais.",
                "area": "negocios",
                "tags_raw": "Investimentos, Fluxo de Caixa, Mercado de Capitais",
                "match_percent": 84,
                "icone": "cash-outline",
                "cor_icone": "#10B981",
                "cor_fundo": "#064E3B"
            },
            {
                "nome": "Marketing Digital",
                "tipo": "TECNÓLOGO",
                "duracao": "2 anos",
                "descricao": "Estratégias de atração de clientes e comunicação empresarial no ambiente digital.",
                "area": "negocios",
                "tags_raw": "Mídias sociais, Growth Hacking, Branding, Vendas",
                "match_percent": 89,
                "icone": "megaphone-outline",
                "cor_icone": "#EC4899",
                "cor_fundo": "#831843"
            }
        ]

        for c_data in courses_data:
            Curso.objects.create(
                nome=c_data["nome"],
                tipo=c_data["tipo"],
                duracao=c_data["duracao"],
                descricao=c_data["descricao"],
                area=c_data["area"],
                tags_raw=c_data["tags_raw"],
                match_percent=c_data["match_percent"],
                icone=c_data["icone"],
                cor_icone=c_data["cor_icone"],
                cor_fundo=c_data["cor_fundo"]
            )

        self.stdout.write(self.style.SUCCESS('Successfully seeded courses list!'))
