import os
import requests
from django.conf import settings

def fallback_chat(mensagem: str, curso_tecnico: str) -> str:
    msg = mensagem.lower()
    curso = curso_tecnico if curso_tecnico else "seu curso técnico"
    
    # Custom greeting
    if any(k in msg for k in ["olá", "oi", "bom dia", "boa tarde", "boa noite"]):
        return (
            f"Olá! Eu sou o Nexo, seu mentor de carreira com Inteligência Artificial. "
            f"Estou aqui para te ajudar a decolar sua jornada profissional com base no seu curso de *{curso}*. "
            f"O que você gostaria de discutir hoje? Dicas de estudo, mercado de trabalho, salários ou vagas de estágio?"
        )
    
    # Wages / Money
    elif any(k in msg for k in ["salário", "ganhar", "dinheiro", "remuneração", "quanto ganha"]):
        if "desenvolvimento" in curso.lower() or "sistemas" in curso.lower():
            return (
                f"No mercado de *{curso}*, os salários são muito atrativos! Um profissional júnior (em início de carreira) "
                f"costuma iniciar ganhando entre R$ 3.000 e R$ 5.000. Profissionais plenos ganham em média de R$ 6.000 a R$ 9.000, "
                f"e desenvolvedores experientes (sênior) superam facilmente os R$ 15.000. Especializar-se em áreas de alta demanda "
                f"como Inteligência Artificial ou Engenharia de Software acelera muito esse crescimento!"
            )
        elif "administração" in curso.lower() or "negócios" in curso.lower():
            return (
                f"Na área de *{curso}*, a remuneração média inicial para assistentes e analistas juniores varia de R$ 2.500 a R$ 4.000. "
                f"Cargos de gerência média costumam pagar entre R$ 6.000 e R$ 10.000. Diretores e executivos seniores "
                f"têm ganhos consideravelmente maiores, frequentemente acima de R$ 18.000. Ter noções de marketing digital "
                f"e análise de dados é um grande diferencial competitivo hoje em dia."
            )
        else:
            return (
                f"Para a área de *{curso}*, a média salarial inicial para nível técnico ou analista júnior varia de R$ 2.200 a R$ 3.800, "
                f"dependendo da região. Com alguns anos de experiência e uma graduação, a média sobe para a faixa de R$ 5.000 a R$ 8.000. "
                f"Deseja focar em alguma sub-área específica para analisarmos os ganhos detalhados?"
            )
            
    # Internship / Jobs
    elif any(k in msg for k in ["estágio", "emprego", "vaga", "trabalhar", "portfólio", "currículo"]):
        return (
            f"Para conseguir as melhores oportunidades de estágio ou emprego em *{curso}*, recomendo focar em três pilares:\n\n"
            f"1. **LinkedIn e Portfólio**: Mantenha seu perfil atualizado e compartilhe projetos que desenvolve em aula.\n"
            f"2. **Networking**: Participe de eventos da sua área e se conecte com professores e profissionais.\n"
            f"3. **Proatividade**: Busque vagas em plataformas focadas (como Cia de Talentos, Gupy ou LinkedIn) e envie candidaturas direcionadas.\n\n"
            f"Gostaria que eu te ajudasse a estruturar os tópicos principais de um currículo campeão?"
        )
        
    # Studies / Technical Advice
    elif any(k in msg for k in ["estudar", "aprender", "estudo", "dica", "tecnologia", "linguagem", "curso"]):
        if "desenvolvimento" in curso.lower() or "sistemas" in curso.lower():
            return (
                f"Para evoluir em *{curso}*, recomendo focar no aprendizado contínuo:\n\n"
                f"- **Lógica e Programação**: Domine linguagens sólidas como Python, JavaScript (React/Node) ou TypeScript.\n"
                f"- **Bancos de Dados**: Aprenda SQL (PostgreSQL/MySQL) e tenha noções de NoSQL.\n"
                f"- **Projetos Reais**: Crie repositórios no GitHub com pequenos sistemas desenvolvidos por você.\n\n"
                f"Que tal focar em desenvolvimento web ou engenharia de dados primeiro? Qual te atrai mais?"
            )
        else:
            return (
                f"Uma excelente estratégia de estudos em *{curso}* envolve:\n\n"
                f"- **Conceitos Fundamentais**: Entender profundamente a teoria básica ensinada nas aulas.\n"
                f"- **Certificações Rápidas**: Fazer cursos complementares online gratuitos (como os do Sebrae ou Coursera).\n"
                f"- **Prática**: Aplicar os conceitos em simulações reais ou projetos voluntários.\n\n"
                f"Qual o principal assunto ou disciplina que você está estudando esta semana?"
            )
            
    # Career area / compatibility
    elif any(k in msg for k in ["área", "atuação", "atuar", "compatível", "compativel", "campo", "segmento"]):
        if "desenvolvimento" in curso.lower() or "sistemas" in curso.lower():
            return (
                f"Com o curso de *{curso}*, as áreas de atuação mais promissoras são:\n\n"
                f"- **Desenvolvimento Web/Mobile**: Criação de sistemas, aplicativos e plataformas digitais usando frameworks como React, Node.js ou Flutter.\n"
                f"- **Análise de Dados e IA**: Processamento de dados com Python, automações e integração com APIs de inteligência artificial.\n"
                f"- **DevOps e Cloud**: Infraestrutura em nuvem (AWS, Azure, GCP), CI/CD e monitoramento de sistemas.\n"
                f"- **Segurança da Informação**: Proteção de sistemas e redes, análise de vulnerabilidades e conformidade.\n\n"
                f"Qual dessas áreas mais desperta seu interesse? Posso detalhar o caminho de carreira de cada uma!"
            )
        elif "administração" in curso.lower() or "negócios" in curso.lower():
            return (
                f"Com o curso de *{curso}*, você pode atuar em diversas frentes:\n\n"
                f"- **Gestão de Projetos**: Coordenação de equipes usando metodologias ágeis (Scrum/Kanban).\n"
                f"- **Marketing Digital**: Estratégias de crescimento, SEO, mídias sociais e análise de métricas.\n"
                f"- **Finanças e Controladoria**: Análise financeira, planejamento orçamentário e auditoria.\n"
                f"- **Empreendedorismo**: Criação e gestão de startups ou negócios próprios.\n\n"
                f"Qual área combina mais com seu perfil pessoal?"
            )
        else:
            return (
                f"Com o curso de *{curso}*, as principais áreas de atuação incluem:\n\n"
                f"- Assistência técnica e suporte especializado.\n"
                f"- Consultoria e prestação de serviços na sua área.\n"
                f"- Setor público ou privado em funções operacionais e de gestão.\n\n"
                f"Gostaria que eu listasse as certificações mais valorizadas no mercado para seu curso?"
            )

    # Job market / opportunities
    elif any(k in msg for k in ["mercado", "mercado de trabalho", "oportunidade", "futuro", "tendência", "tendencia", "demanda"]):
        if "desenvolvimento" in curso.lower() or "sistemas" in curso.lower():
            return (
                f"O mercado de tecnologia para profissionais de *{curso}* está em plena expansão! Alguns dados relevantes:\n\n"
                f"- O Brasil tem um déficit de mais de **500 mil profissionais de TI** por ano, criando enorme demanda.\n"
                f"- Áreas como **Inteligência Artificial**, **Cloud Computing** e **Segurança Cibernética** lideram as contratações.\n"
                f"- Desenvolvedores com experiência em projetos reais têm taxas de empregabilidade acima de 90%.\n\n"
                f"Minha dica: construa um portfólio no GitHub com 2 ou 3 projetos completos. Isso vale mais que qualquer certificado no processo seletivo!"
            )
        else:
            return (
                f"O mercado para profissionais de *{curso}* está aquecido e com boas perspectivas:\n\n"
                f"- Empresas buscam cada vez mais profissionais com formação técnica sólida combinada com habilidades digitais.\n"
                f"- Setores como saúde, tecnologia e serviços são os maiores empregadores da atualidade.\n"
                f"- A capacidade de trabalhar com dados e ferramentas digitais é um grande diferencial competitivo.\n\n"
                f"O que mais você gostaria de saber sobre as tendências da sua área?"
            )

    # Default intelligent mentoring
    else:
        return (
            f"Boa pergunta! Como estudante de *{curso}*, você tem um caminho muito promissor pela frente. "
            f"Posso te ajudar com:\n\n"
            f"- **Áreas de atuação** compatíveis com seu curso\n"
            f"- **Salários** e remuneração no mercado\n"
            f"- **Dicas de estudo** e certificações valorizadas\n"
            f"- **Vagas de estágio** e como montar um portfólio\n\n"
            f"Sobre qual desses temas você gostaria de conversar?"
        )

def get_ai_response(mensagem: str, curso_tecnico: str) -> str:
    # Read GEMINI_API_KEY from environment or django settings
    api_key = os.environ.get("GEMINI_API_KEY") or getattr(settings, "GEMINI_API_KEY", None)
    
    if not api_key:
        return fallback_chat(mensagem, curso_tecnico)

    # Try models in order of preference — first one that answers wins.
    # Prioritizes Gemini 3.x models (active with quota in 2026) followed by 2.x fallbacks.
    CANDIDATE_MODELS = [
        "gemini-3.5-flash-lite",
        "gemini-3.5-flash",
        "gemini-3.1-flash-lite",
        "gemini-3.6-flash",
        "gemini-2.0-flash-lite",
        "gemini-2.0-flash",
    ]

    prompt = (
        f"Você é o Nexo, um mentor de carreira inteligente, atencioso e empático para estudantes de cursos técnicos. "
        f"Seu objetivo é ajudar a traçar planos de estudo e conectar o aprendizado técnico com oportunidades reais. "
        f"O curso técnico atual do usuário é: '{curso_tecnico}'. O usuário enviou a seguinte mensagem: '{mensagem}'. "
        f"Dê conselhos práticos de carreira relacionados a esse curso. Responda em português de forma clara, amigável e motivadora. "
        f"Limite sua resposta a 2 ou 3 parágrafos."
    )

    payload = {
        "contents": [{
            "parts": [{"text": prompt}]
        }]
    }
    headers = {"Content-Type": "application/json"}

    for model in CANDIDATE_MODELS:
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
            response = requests.post(url, headers=headers, json=payload, timeout=15)

            if response.status_code == 200:
                res_data = response.json()
                candidates = res_data.get("candidates", [])
                if candidates:
                    parts = candidates[0].get("content", {}).get("parts", [])
                    if parts:
                        text = parts[0].get("text", "").strip()
                        if text:
                            return text

            # 429 = quota exhausted → try next model
            # 404 = model not available → try next model
            # anything else → log and try next
            print(f"Gemini [{model}] returned {response.status_code}: {response.text[:200]}")

        except Exception as e:
            print(f"Exception calling Gemini [{model}]: {e}")

    # All models failed — use local intelligent fallback
    return fallback_chat(mensagem, curso_tecnico)
