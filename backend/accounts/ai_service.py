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
            
    # Default intelligent mentoring
    else:
        return (
            f"Excelente reflexão! Como estudante de *{curso}*, você está em um caminho promissor. "
            f"Integrar sua dedicação técnica com as habilidades de comunicação e raciocínio lógico é a chave "
            f"para se destacar profissionalmente. "
            f"Gostaria de falar mais sobre as áreas de atuação mais compatíveis com seu perfil ou planejar uma rotina de estudos?"
        )

def get_ai_response(mensagem: str, curso_tecnico: str) -> str:
    # Read GEMINI_API_KEY from environment or django settings
    api_key = os.environ.get("GEMINI_API_KEY") or getattr(settings, "GEMINI_API_KEY", None)
    
    if not api_key:
        return fallback_chat(mensagem, curso_tecnico)
        
    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
        headers = {
            "Content-Type": "application/json"
        }
        prompt = (
            f"Você é o Nexo, um mentor de carreira inteligente, atencioso e empático para estudantes de cursos técnicos. "
            f"Seu objetivo é ajudar a traçar planos de estudo e conectar o aprendizado técnico com oportunidades reais. "
            f"O curso técnico atual do usuário é: '{curso_tecnico}'. O usuário enviou a seguinte mensagem: '{mensagem}'. "
            f"Dê conselhos práticos de carreira relacionados a esse curso. Responda em português de forma clara, amigável e motivadora. "
            f"Limite sua resposta a 2 ou 3 parágrafos."
        )
        
        payload = {
            "contents": [{
                "parts": [{
                    "text": prompt
                }]
            }]
        }
        
        response = requests.post(url, headers=headers, json=payload, timeout=15)
        if response.status_code == 200:
            res_data = response.json()
            candidates = res_data.get("candidates", [])
            if candidates:
                parts = candidates[0].get("content", {}).get("parts", [])
                if parts:
                    return parts[0].get("text", "").strip()
                    
        # Log status code and response for debugging
        print(f"Gemini API returned status code {response.status_code}: {response.text}")
        return fallback_chat(mensagem, curso_tecnico)
    except Exception as e:
        print(f"Exception during Gemini API request: {e}")
        return fallback_chat(mensagem, curso_tecnico)
