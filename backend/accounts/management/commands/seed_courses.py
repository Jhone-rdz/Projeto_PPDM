from django.core.management.base import BaseCommand
from django.db import transaction
from accounts.models import Curso

class Command(BaseCommand):
    help = 'Seeds initial compatible courses and careers list with at least 50 detailed courses'

    @transaction.atomic
    def handle(self, *args, **options):
        self.stdout.write('Seeding courses...')
        
        # Clear existing
        Curso.objects.all().delete()

        courses_data = [
            # 1. Tecnologia (9)
            {
                "nome": "Engenharia de Inteligência Artificial",
                "tipo": "BACHARELADO",
                "duracao": "5 anos",
                "descricao": "Foco no desenvolvimento de algoritmos avançados, redes neurais e sistemas autônomos. Combina matemática profunda, programação avançada e ciência de dados.",
                "area": "tecnologia",
                "tags_raw": "Algoritmos de ML, Redes Neurais, Sistemas Autônomos",
                "match_percent": 94,
                "icone": "hardware-chip-outline",
                "cor_icone": "#8B5CF6",
                "cor_fundo": "#2D1B69"
            },
            {
                "nome": "Ciência da Computação",
                "tipo": "BACHARELADO",
                "duracao": "4 anos",
                "descricao": "Estudo teórico e prático de algoritmos, compiladores, arquitetura de sistemas e segurança. Essencial para inovação tecnológica e pesquisa.",
                "area": "tecnologia",
                "tags_raw": "Teoria da Computação, Algoritmos, Pesquisa Científica",
                "match_percent": 91,
                "icone": "code-slash-outline",
                "cor_icone": "#10B981",
                "cor_fundo": "#064E3B"
            },
            {
                "nome": "Engenharia de Software",
                "tipo": "BACHARELADO",
                "duracao": "5 anos",
                "descricao": "Projeto, construção, testes e manutenção de sistemas de software complexos. Envolve padrões de projeto e gestão de ciclo de vida.",
                "area": "tecnologia",
                "tags_raw": "Arquitetura de Sistemas, DevOps, Metodologias Ágeis",
                "match_percent": 88,
                "icone": "laptop-outline",
                "cor_icone": "#FFFFFF",
                "cor_fundo": "#4F46E5"
            },
            {
                "nome": "Análise e Desenvolvimento de Sistemas",
                "tipo": "TECNÓLOGO",
                "duracao": "2.5 anos",
                "descricao": "Formação ágil focada em programação, modelagem de banco de dados e engenharia de requisitos. Altíssima taxa de inserção no mercado.",
                "area": "tecnologia",
                "tags_raw": "Desenvolvimento Web, Mobile, Engenharia de Requisitos",
                "match_percent": 86,
                "icone": "phone-portrait-outline",
                "cor_icone": "#FFFFFF",
                "cor_fundo": "#F59E0B"
            },
            {
                "nome": "Segurança da Informação",
                "tipo": "TECNÓLOGO",
                "duracao": "2.5 anos",
                "descricao": "Proteção de redes, servidores e sistemas contra ameaças e ataques cibernéticos. Análise de vulnerabilidades e compliance.",
                "area": "tecnologia",
                "tags_raw": "Cibersegurança, Hacking Ético, Proteção de Dados",
                "match_percent": 90,
                "icone": "shield-checkmark-outline",
                "cor_icone": "#EF4444",
                "cor_fundo": "#7F1D1D"
            },
            {
                "nome": "Banco de Dados",
                "tipo": "TECNÓLOGO",
                "duracao": "2.5 anos",
                "descricao": "Projeto, implementação e administração de bancos de dados relacionais e não-relacionais, com foco em otimização de consultas e Big Data.",
                "area": "tecnologia",
                "tags_raw": "SQL e NoSQL, DBA, Modelagem de Dados",
                "match_percent": 82,
                "icone": "server-outline",
                "cor_icone": "#3B82F6",
                "cor_fundo": "#1E3A8A"
            },
            {
                "nome": "Sistemas de Informação",
                "tipo": "BACHARELADO",
                "duracao": "4 anos",
                "descricao": "Alinhamento entre tecnologia da informação e objetivos organizacionais. Foco em gestão de TI, sistemas integrados e programação.",
                "area": "tecnologia",
                "tags_raw": "Gestão de TI, ERP, Engenharia de Software",
                "match_percent": 87,
                "icone": "desktop-outline",
                "cor_icone": "#10B981",
                "cor_fundo": "#064E3B"
            },
            {
                "nome": "Redes de Computadores",
                "tipo": "TECNÓLOGO",
                "duracao": "2.5 anos",
                "descricao": "Configuração, administração e infraestrutura de redes cabeadas e sem fio. Cloud computing e virtualização de servidores.",
                "area": "tecnologia",
                "tags_raw": "Infraestrutura de TI, Cloud Computing, Roteamento",
                "match_percent": 81,
                "icone": "git-network-outline",
                "cor_icone": "#F59E0B",
                "cor_fundo": "#78350F"
            },
            {
                "nome": "Ciência de Dados",
                "tipo": "BACHARELADO",
                "duracao": "4 anos",
                "descricao": "Extração de valor e insights a partir de grandes volumes de dados. Combina computação avançada, estatística e inteligência de negócios.",
                "area": "tecnologia",
                "tags_raw": "Big Data, Estatística, Machine Learning",
                "match_percent": 93,
                "icone": "bar-chart-outline",
                "cor_icone": "#EC4899",
                "cor_fundo": "#831843"
            },

            # 2. Saúde (9)
            {
                "nome": "Medicina",
                "tipo": "BACHARELADO",
                "duracao": "6 anos",
                "descricao": "Diagnóstico, tratamento e prevenção de doenças no corpo humano. Ampla variedade de especializações clínicas e cirúrgicas.",
                "area": "saude",
                "tags_raw": "Clínica Médica, Cirurgia, Saúde Humana",
                "match_percent": 98,
                "icone": "pulse-outline",
                "cor_icone": "#EF4444",
                "cor_fundo": "#7F1D1D"
            },
            {
                "nome": "Enfermagem",
                "tipo": "BACHARELADO",
                "duracao": "4 anos",
                "descricao": "Cuidados diretos ao paciente, gestão de unidades de saúde e promoção da saúde coletiva em equipes multidisciplinares.",
                "area": "saude",
                "tags_raw": "Cuidado Humanizado, Enfermagem Geral, Gestão Hospitalar",
                "match_percent": 89,
                "icone": "heart-outline",
                "cor_icone": "#EC4899",
                "cor_fundo": "#831843"
            },
            {
                "nome": "Fisioterapia",
                "tipo": "BACHARELADO",
                "duracao": "4 anos",
                "descricao": "Prevenção, diagnóstico físico-funcional e reabilitação de lesões, distúrbios motores e respiratórios.",
                "area": "saude",
                "tags_raw": "Reabilitação Motora, Fisioterapia Respiratória, Ortopedia",
                "match_percent": 85,
                "icone": "body-outline",
                "cor_icone": "#10B981",
                "cor_fundo": "#064E3B"
            },
            {
                "nome": "Nutrição",
                "tipo": "BACHARELADO",
                "duracao": "4 anos",
                "descricao": "Estudo dos nutrientes e do metabolismo. Planejamento alimentar focado em saúde, performance esportiva e qualidade de vida.",
                "area": "saude",
                "tags_raw": "Alimentação Saudável, Nutrição Esportiva, Dietoterapia",
                "match_percent": 82,
                "icone": "restaurant-outline",
                "cor_icone": "#F59E0B",
                "cor_fundo": "#78350F"
            },
            {
                "nome": "Psicologia",
                "tipo": "BACHARELADO",
                "duracao": "5 anos",
                "descricao": "Análise dos processos mentais, emoções, sentimentos e comportamento humano em contextos clínicos, sociais e organizacionais.",
                "area": "saude",
                "tags_raw": "Saúde Mental, Psicologia Clínica, Terapia Cognitiva",
                "match_percent": 90,
                "icone": "people-outline",
                "cor_icone": "#3B82F6",
                "cor_fundo": "#1E3A8A"
            },
            {
                "nome": "Biomedicina",
                "tipo": "BACHARELADO",
                "duracao": "4 anos",
                "descricao": "Pesquisa de causas de doenças e desenvolvimento de tratamentos. Análises clínicas, genética e biologia molecular.",
                "area": "saude",
                "tags_raw": "Análises Clínicas, Genética, Patologia",
                "match_percent": 88,
                "icone": "flask-outline",
                "cor_icone": "#8B5CF6",
                "cor_fundo": "#2D1B69"
            },
            {
                "nome": "Odontologia",
                "tipo": "BACHARELADO",
                "duracao": "5 anos",
                "descricao": "Saúde e estética da boca e face. Foco em diagnóstico de patologias bucais, cirurgias e reabilitação oral.",
                "area": "saude",
                "tags_raw": "Cirurgia Bucomaxilo, Ortodontia, Estética Dental",
                "match_percent": 91,
                "icone": "happy-outline",
                "cor_icone": "#3B82F6",
                "cor_fundo": "#1E3A8A"
            },
            {
                "nome": "Farmácia",
                "tipo": "BACHARELADO",
                "duracao": "5 anos",
                "descricao": "Estudo de medicamentos e substâncias químicas. Desenvolvimento e controle de qualidade de remédios e cosméticos.",
                "area": "saude",
                "tags_raw": "Farmacologia, Cosmetologia, Farmácia Clínica",
                "match_percent": 86,
                "icone": "medkit-outline",
                "cor_icone": "#10B981",
                "cor_fundo": "#064E3B"
            },
            {
                "nome": "Educação Física",
                "tipo": "BACHARELADO",
                "duracao": "4 anos",
                "descricao": "Planejamento e acompanhamento de atividades físicas, condicionamento esportivo e reabilitação pelo movimento corporal.",
                "area": "saude",
                "tags_raw": "Personal Trainer, Treino Esportivo, Cinesiologia",
                "match_percent": 80,
                "icone": "football-outline",
                "cor_icone": "#F59E0B",
                "cor_fundo": "#78350F"
            },

            # 3. Negócios (9)
            {
                "nome": "Administração",
                "tipo": "BACHARELADO",
                "duracao": "4 anos",
                "descricao": "Planejamento estratégico, finanças, gestão de equipes, operações logísticas e marketing de organizações públicas e privadas.",
                "area": "negocios",
                "tags_raw": "Empreendedorismo, Gestão Geral, Planejamento Estratégico",
                "match_percent": 92,
                "icone": "briefcase-outline",
                "cor_icone": "#F59E0B",
                "cor_fundo": "#78350F"
            },
            {
                "nome": "Ciências Contábeis",
                "tipo": "BACHARELADO",
                "duracao": "4 anos",
                "descricao": "Controle financeiro, escrituração fiscal, auditorias e consultorias tributárias para otimizar os lucros empresariais de forma ética.",
                "area": "negocios",
                "tags_raw": "Controladoria, Auditoria Contábil, Planejamento Tributário",
                "match_percent": 87,
                "icone": "calculator-outline",
                "cor_icone": "#3B82F6",
                "cor_fundo": "#1E3A8A"
            },
            {
                "nome": "Gestão Financeira",
                "tipo": "TECNÓLOGO",
                "duracao": "2 anos",
                "descricao": "Análise técnica do fluxo de caixa empresarial, fontes de financiamento externo e viabilidade de novos investimentos no mercado.",
                "area": "negocios",
                "tags_raw": "Análise de Investimento, Tesouraria, Valuation",
                "match_percent": 84,
                "icone": "cash-outline",
                "cor_icone": "#10B981",
                "cor_fundo": "#064E3B"
            },
            {
                "nome": "Marketing Digital",
                "tipo": "TECNÓLOGO",
                "duracao": "2 anos",
                "descricao": "Análise de tráfego web, growth hacking, branding, neuromarketing e campanhas publicitárias em redes sociais de alta conversão.",
                "area": "negocios",
                "tags_raw": "Mídias Sociais, SEO e Tráfego, Growth Marketing",
                "match_percent": 89,
                "icone": "megaphone-outline",
                "cor_icone": "#EC4899",
                "cor_fundo": "#831843"
            },
            {
                "nome": "Ciências Econômicas",
                "tipo": "BACHARELADO",
                "duracao": "4 anos",
                "descricao": "Estudo de macroeconomia, microeconomia, teoria dos jogos, mercado financeiro, inflação e políticas monetárias nacionais e globais.",
                "area": "negocios",
                "tags_raw": "Macroeconomia, Finanças Globais, Econometria",
                "match_percent": 90,
                "icone": "trending-up-outline",
                "cor_icone": "#10B981",
                "cor_fundo": "#064E3B"
            },
            {
                "nome": "Logística",
                "tipo": "TECNÓLOGO",
                "duracao": "2 anos",
                "descricao": "Gestão de cadeias de suprimentos, canais de distribuição, armazenagem física, modais de transporte e otimização de fretes.",
                "area": "negocios",
                "tags_raw": "Supply Chain, Armazenagem, Distribuição de Carga",
                "match_percent": 83,
                "icone": "cube-outline",
                "cor_icone": "#FFFFFF",
                "cor_fundo": "#4F46E5"
            },
            {
                "nome": "Gestão de Recursos Humanos",
                "tipo": "TECNÓLOGO",
                "duracao": "2 anos",
                "descricao": "Recrutamento e seleção de talentos, planos de cargos e salários, treinamento corporativo e desenvolvimento organizacional.",
                "area": "negocios",
                "tags_raw": "Gestão de Pessoas, DP, Psicologia Organizacional",
                "match_percent": 86,
                "icone": "people-circle-outline",
                "cor_icone": "#8B5CF6",
                "cor_fundo": "#2D1B69"
            },
            {
                "nome": "Comércio Exterior",
                "tipo": "TECNÓLOGO",
                "duracao": "2 anos",
                "descricao": "Legislação aduaneira, contratos de câmbio internacional, exportação, importação e relações comerciais entre blocos econômicos.",
                "area": "negocios",
                "tags_raw": "Importação e Exportação, Desembaraço Aduaneiro, Câmbio",
                "match_percent": 85,
                "icone": "globe-outline",
                "cor_icone": "#3B82F6",
                "cor_fundo": "#1E3A8A"
            },
            {
                "nome": "Processos Gerenciais",
                "tipo": "TECNÓLOGO",
                "duracao": "2 anos",
                "descricao": "Otimização de processos internos empresariais, análise de gargalos operacionais e implementação de práticas ágeis e de qualidade total.",
                "area": "negocios",
                "tags_raw": "Modelagem de Processos, Qualidade Total, Eficiência",
                "match_percent": 81,
                "icone": "git-branch-outline",
                "cor_icone": "#F59E0B",
                "cor_fundo": "#78350F"
            },

            # 4. Artes e Design (9)
            {
                "nome": "Design Gráfico",
                "tipo": "TECNÓLOGO",
                "duracao": "2 anos",
                "descricao": "Criação de marcas, identidades visuais, tipografias, layouts editoriais digitais e físicos, utilizando técnicas de diagramação.",
                "area": "artes",
                "tags_raw": "Identidade Visual, Photoshop e Illustrator, Tipografia",
                "match_percent": 90,
                "icone": "color-palette-outline",
                "cor_icone": "#EC4899",
                "cor_fundo": "#831843"
            },
            {
                "nome": "Arquitetura e Urbanismo",
                "tipo": "BACHARELADO",
                "duracao": "5 anos",
                "descricao": "Projetos de edificações residenciais e comerciais, planejamento urbano, paisagismo, decoração de interiores e conforto acústico/térmico.",
                "area": "artes",
                "tags_raw": "Projeto Arquitetônico, Desenho Técnico, Planejamento Urbano",
                "match_percent": 93,
                "icone": "business-outline",
                "cor_icone": "#8B5CF6",
                "cor_fundo": "#2D1B69"
            },
            {
                "nome": "Artes Visuais",
                "tipo": "BACHARELADO",
                "duracao": "4 anos",
                "descricao": "Exploração e criação artística em suportes clássicos e digitais: pintura, escultura, gravura, curadoria e instalações.",
                "area": "artes",
                "tags_raw": "Escultura e Pintura, Curadoria, História da Arte",
                "match_percent": 82,
                "icone": "brush-outline",
                "cor_icone": "#F59E0B",
                "cor_fundo": "#78350F"
            },
            {
                "nome": "Cinema e Audiovisual",
                "tipo": "BACHARELADO",
                "duracao": "4 anos",
                "descricao": "Direção de cinema, roteirização de séries e filmes, produção executiva, edição de vídeo, captação de áudio e iluminação de estúdios.",
                "area": "artes",
                "tags_raw": "Roteirização, Edição de Vídeo, Direção Cinematográfica",
                "match_percent": 88,
                "icone": "videocam-outline",
                "cor_icone": "#FFFFFF",
                "cor_fundo": "#4F46E5"
            },
            {
                "nome": "Design de Moda",
                "tipo": "TECNÓLOGO",
                "duracao": "2 anos",
                "descricao": "Estilo de roupas e acessórios, modelagem plana e tridimensional, história da moda, desenho técnico de vestuário e coleções.",
                "area": "artes",
                "tags_raw": "Desenho de Moda, Costura, Coleções de Roupas",
                "match_percent": 85,
                "icone": "shirt-outline",
                "cor_icone": "#EC4899",
                "cor_fundo": "#831843"
            },
            {
                "nome": "Design de Games",
                "tipo": "TECNÓLOGO",
                "duracao": "2.5 anos",
                "descricao": "Construção de narrativas de jogos, concept art, modelagem 3D de cenários e personagens, level design e programação de interações.",
                "area": "artes",
                "tags_raw": "Narrativa de Jogos, Modelagem 3D, Game Design",
                "match_percent": 91,
                "icone": "game-controller-outline",
                "cor_icone": "#8B5CF6",
                "cor_fundo": "#2D1B69"
            },
            {
                "nome": "Fotografia",
                "tipo": "TECNÓLOGO",
                "duracao": "2 anos",
                "descricao": "Técnicas de exposição e iluminação, revelação de negativos, edição digital de imagem, ensaios fotográficos comerciais e fotojornalismo.",
                "area": "artes",
                "tags_raw": "Direção de Iluminação, Retrato, Tratamento de Imagem",
                "match_percent": 86,
                "icone": "camera-outline",
                "cor_icone": "#3B82F6",
                "cor_fundo": "#1E3A8A"
            },
            {
                "nome": "Música",
                "tipo": "BACHARELADO",
                "duracao": "4 anos",
                "descricao": "Canto lírico ou popular, domínio instrumental, regência de orquestras, teoria musical e composição de trilhas sonoras autorais.",
                "area": "artes",
                "tags_raw": "Composição Musical, Regência, Teoria e Harmonia",
                "match_percent": 84,
                "icone": "musical-notes-outline",
                "cor_icone": "#10B981",
                "cor_fundo": "#064E3B"
            },
            {
                "nome": "Design de Interiores",
                "tipo": "TECNÓLOGO",
                "duracao": "2 anos",
                "descricao": "Planejamento estético e ergonômico de ambientes corporativos e residenciais. Especificação de revestimentos, móveis e iluminação.",
                "area": "artes",
                "tags_raw": "Ergonomia, Iluminação Decorativa, Mobiliário",
                "match_percent": 87,
                "icone": "home-outline",
                "cor_icone": "#F59E0B",
                "cor_fundo": "#78350F"
            },

            # 5. Direito e Ciências Humanas (9)
            {
                "nome": "Direito",
                "tipo": "BACHARELADO",
                "duracao": "5 anos",
                "descricao": "Aplicação de leis civis, penais, trabalhistas e constitucionais. Preparação para advocacia, defensoria pública, magistratura e concursos.",
                "area": "direito",
                "tags_raw": "Direito Civil, Direito Penal, Jurisprudência",
                "match_percent": 96,
                "icone": "scale-outline",
                "cor_icone": "#8B5CF6",
                "cor_fundo": "#2D1B69"
            },
            {
                "nome": "Relações Internacionais",
                "tipo": "BACHARELADO",
                "duracao": "4 anos",
                "descricao": "Mediação de acordos diplomáticos, comércio exterior, análise geopolítica internacional e atuação em ONGs ou empresas globais.",
                "area": "direito",
                "tags_raw": "Diplomacia, Geopolítica Global, Acordos Bilaterais",
                "match_percent": 89,
                "icone": "earth-outline",
                "cor_icone": "#3B82F6",
                "cor_fundo": "#1E3A8A"
            },
            {
                "nome": "Jornalismo",
                "tipo": "BACHARELADO",
                "duracao": "4 anos",
                "descricao": "Produção de notícias, interviews e reportagens investigativas para TV, rádio, portais de internet e jornais impressos de referência.",
                "area": "direito",
                "tags_raw": "Investigação, Redação e Entrevista, Mídia de Massa",
                "match_percent": 84,
                "icone": "newspaper-outline",
                "cor_icone": "#10B981",
                "cor_fundo": "#064E3B"
            },
            {
                "nome": "História",
                "tipo": "LICENCIATURA",
                "duracao": "4 anos",
                "descricao": "Investigação documental de períodos antigos e modernos, movimentos sociais, revoluções políticas e docência no ensino regular.",
                "area": "direito",
                "tags_raw": "Historiografia, Ensino de História, Arquivologia",
                "match_percent": 81,
                "icone": "book-outline",
                "cor_icone": "#F59E0B",
                "cor_fundo": "#78350F"
            },
            {
                "nome": "Pedagogia",
                "tipo": "LICENCIATURA",
                "duracao": "4 anos",
                "descricao": "Processos educativos na infância, gestão escolar, psicopedagogia institucional e desenvolvimento de metodologias didáticas inovadoras.",
                "area": "direito",
                "tags_raw": "Ensino Infantil, Didática de Ensino, Gestão Escolar",
                "match_percent": 88,
                "icone": "school-outline",
                "cor_icone": "#EC4899",
                "cor_fundo": "#831843"
            },
            {
                "nome": "Serviço Social",
                "tipo": "BACHARELADO",
                "duracao": "4 anos",
                "descricao": "Planejamento e execução de políticas públicas sociais, assistência a populações vulneráveis e garantia de direitos humanos.",
                "area": "direito",
                "tags_raw": "Políticas Públicas, Direitos Humanos, Assistência Social",
                "match_percent": 83,
                "icone": "heart-circle-outline",
                "cor_icone": "#EF4444",
                "cor_fundo": "#7F1D1D"
            },
            {
                "nome": "Letras (Português/Inglês)",
                "tipo": "LICENCIATURA",
                "duracao": "4 anos",
                "descricao": "Estudo aprofundado da língua, literatura, gramática comparada e técnicas de tradução e revisão ortográfica de textos literários.",
                "area": "direito",
                "tags_raw": "Gramática Comparada, Produção Literária, Tradução",
                "match_percent": 82,
                "icone": "text-outline",
                "cor_icone": "#FFFFFF",
                "cor_fundo": "#4F46E5"
            },
            {
                "nome": "Geografia",
                "tipo": "BACHARELADO",
                "duracao": "4 anos",
                "descricao": "Estudo de relevo físico, cartografia, clima, demografia populacional e mapeamentos por geoprocessamento em sistemas de satélite.",
                "area": "direito",
                "tags_raw": "Geoprocessamento, Climatologia, Planejamento Regional",
                "match_percent": 80,
                "icone": "map-outline",
                "cor_icone": "#10B981",
                "cor_fundo": "#064E3B"
            },
            {
                "nome": "Publicidade e Propaganda",
                "tipo": "BACHARELADO",
                "duracao": "4 anos",
                "descricao": "Direção de arte em campanhas, redação publicitária persuasiva, planejamento de mídia de rádio/TV/Internet e pesquisas de mercado consumidor.",
                "area": "direito",
                "tags_raw": "Redação Publicitária, Direção de Arte, Comportamento de Consumo",
                "match_percent": 86,
                "icone": "volume-medium-outline",
                "cor_icone": "#EF4444",
                "cor_fundo": "#7F1D1D"
            },

            # 6. Agronomia e Ciências da Terra (9)
            {
                "nome": "Agronomia",
                "tipo": "BACHARELADO",
                "duracao": "5 anos",
                "descricao": "Planejamento e manejo de plantios, engenharia de irrigação, fitotecnia, controle de pragas de lavouras e melhoramento genético vegetal.",
                "area": "agronomia",
                "tags_raw": "Manejo de Cultivos, Irrigação, Fitossanidade",
                "match_percent": 94,
                "icone": "leaf-outline",
                "cor_icone": "#10B981",
                "cor_fundo": "#064E3B"
            },
            {
                "nome": "Medicina Veterinária",
                "tipo": "BACHARELADO",
                "duracao": "5 anos",
                "descricao": "Clínica médica e cirúrgica de pequenos e grandes animais, controle sanitário de rebanhos de pecuária e tecnologia de produtos de origem animal.",
                "area": "agronomia",
                "tags_raw": "Clínica Cirúrgica Animal, Zootecnia Geral, Inspeção Sanitária",
                "match_percent": 92,
                "icone": "paw-outline",
                "cor_icone": "#F59E0B",
                "cor_fundo": "#78350F"
            },
            {
                "nome": "Engenharia Florestal",
                "tipo": "BACHARELADO",
                "duracao": "5 anos",
                "descricao": "Inventário florestal de precisão, reflorestamento de áreas degradadas, controle de incêndios florestais e aproveitamento sustentável de madeira.",
                "area": "agronomia",
                "tags_raw": "Silvicultura, Manejo Sustentável, Ecologia Aplicada",
                "match_percent": 88,
                "icone": "rose-outline",
                "cor_icone": "#10B981",
                "cor_fundo": "#064E3B"
            },
            {
                "nome": "Zootecnia",
                "tipo": "BACHARELADO",
                "duracao": "5 anos",
                "descricao": "Formulação de rações animais, melhoramento genético de raças pecuárias, bem-estar animal em granjas e aumento da produtividade de carnes/leites.",
                "area": "agronomia",
                "tags_raw": "Nutrição Animal, Genética Pecuária, Bem-Estar Animal",
                "match_percent": 87,
                "icone": "water-outline",
                "cor_icone": "#3B82F6",
                "cor_fundo": "#1E3A8A"
            },
            {
                "nome": "Gestão Ambiental",
                "tipo": "TECNÓLOGO",
                "duracao": "2 anos",
                "descricao": "Elaboração de laudos de impacto ambiental, certificação ISO 14001, gerenciamento de resíduos industriais e recuperação de mananciais de água.",
                "area": "agronomia",
                "tags_raw": "Licenciamento Ambiental, Resíduos Sólidos, ISO 14001",
                "match_percent": 89,
                "icone": "planet-outline",
                "cor_icone": "#10B981",
                "cor_fundo": "#064E3B"
            },
            {
                "nome": "Ciências Biológicas",
                "tipo": "BACHARELADO",
                "duracao": "4 anos",
                "descricao": "Estudo de seres vivos e sua ecologia. Atuação em pesquisas genéticas, zoologia descritiva, botânica geral e conservação de espécies em extinção.",
                "area": "agronomia",
                "tags_raw": "Zoologia e Botânica, Ecossistemas, Biologia Molecular",
                "match_percent": 86,
                "icone": "bug-outline",
                "cor_icone": "#EC4899",
                "cor_fundo": "#831843"
            },
            {
                "nome": "Engenharia de Alimentos",
                "tipo": "BACHARELADO",
                "duracao": "5 anos",
                "descricao": "Industrialização e conservação de alimentos frescos, microbiologia alimentar, controle de qualidade de embalagens e projeto de linhas de processamento.",
                "area": "agronomia",
                "tags_raw": "Controle Sanitário, Conservação, Linha de Produção",
                "match_percent": 88,
                "icone": "nutrition-outline",
                "cor_icone": "#F59E0B",
                "cor_fundo": "#78350F"
            },
            {
                "nome": "Oceanografia",
                "tipo": "BACHARELADO",
                "duracao": "5 anos",
                "descricao": "Dinâmica das correntes marinhas, ecologia estuarina de manguezais, aquicultura marinha de peixes/moluscos e monitoramento de derramamentos de óleo.",
                "area": "agronomia",
                "tags_raw": "Biologia Marinha, Aquicultura, Dinâmica Costeira",
                "match_percent": 85,
                "icone": "boat-outline",
                "cor_icone": "#3B82F6",
                "cor_fundo": "#1E3A8A"
            },
            {
                "nome": "Engenharia Agrícola",
                "tipo": "BACHARELADO",
                "duracao": "5 anos",
                "descricao": "Projeto de maquinários e tratores agrícolas modernos, eletrônica embarcada para plantio automatizado e projeto de silos de secagem de grãos.",
                "area": "agronomia",
                "tags_raw": "Máquinas Agrícolas, Agricultura de Precisão, Silagem",
                "match_percent": 90,
                "icone": "construct-outline",
                "cor_icone": "#FFFFFF",
                "cor_fundo": "#4F46E5"
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

        self.stdout.write(self.style.SUCCESS(f'Successfully seeded {len(courses_data)} courses list!'))
