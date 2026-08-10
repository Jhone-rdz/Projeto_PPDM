from django.core.management.base import BaseCommand
from django.db import transaction
from accounts.models import Pergunta, Opcao

class Command(BaseCommand):
    help = 'Seeds initial career questionnaire questions and options'

    @transaction.atomic
    def handle(self, *args, **options):
        self.stdout.write('Seeding 15 questions...')
        
        # Clear existing to prevent duplicate IDs or conflict
        Pergunta.objects.all().delete()

        questions_data = [
            # BLOCO 1 — INTERESSES E ÁREA (perguntas 1 a 3)
            {
                "id": 1,
                "categoria": 'ORIENTAÇÃO DE CURSO',
                "icone_categoria": 'compass-outline',
                "pergunta": 'Qual área mais desperta o seu interesse?',
                "instrucao": 'Escolha apenas uma opção.',
                "opcoes": [
                    { "chave": 'a', "icone": 'code-slash-outline', "cor_icone": '#4F46E5', "label": 'Tecnologia', "descricao": 'Desenvolver softwares, aplicativos e soluções inovadoras.' },
                    { "chave": 'b', "icone": 'heart-outline', "cor_icone": '#EC4899', "label": 'Saúde', "descricao": 'Cuidar do bem-estar das pessoas e salvar vidas.' },
                    { "chave": 'c', "icone": 'briefcase-outline', "cor_icone": '#F59E0B', "label": 'Negócios', "descricao": 'Gerenciar empresas, projetos e criar novos empreendimentos.' },
                    { "chave": 'd', "icone": 'color-palette-outline', "cor_icone": '#8B5CF6', "label": 'Artes e Design', "descricao": 'Expressar ideias de forma visual, criativa e artística.' },
                    { "chave": 'e', "icone": 'scale-outline', "cor_icone": '#F97316', "label": 'Direito e Justiça', "descricao": 'Defender direitos, leis e a justiça social.' },
                    { "chave": 'f', "icone": 'leaf-outline', "cor_icone": '#10B981', "label": 'Agronomia e Meio Ambiente', "descricao": 'Trabalhar com sustentabilidade, campo e natureza.' },
                    { "chave": 'g', "icone": 'help-circle-outline', "cor_icone": '#6B7280', "label": 'Ainda não sei', "descricao": 'Quero explorar minhas opções antes de decidir.' }
                ]
            },
            {
                "id": 2,
                "categoria": 'INTERESSES',
                "icone_categoria": 'star-outline',
                "pergunta": 'O que você mais gosta de fazer no seu tempo livre?',
                "instrucao": 'Escolha apenas uma opção.',
                "opcoes": [
                    { "chave": 'a', "icone": 'game-controller-outline', "cor_icone": '#4F46E5', "label": 'Jogar ou programar', "descricao": 'Passar tempo no computador explorando jogos ou códigos.' },
                    { "chave": 'b', "icone": 'brush-outline', "cor_icone": '#8B5CF6', "label": 'Desenhar ou criar', "descricao": 'Criar ilustrações, designs ou peças criativas.' },
                    { "chave": 'c', "icone": 'book-outline', "cor_icone": '#00D4FF', "label": 'Ler ou estudar', "descricao": 'Aprender coisas novas, ler livros e artigos variados.' },
                    { "chave": 'd', "icone": 'people-outline', "cor_icone": '#EC4899', "label": 'Ajudar pessoas', "descricao": 'Colaborar com projetos sociais ou dar apoio a quem precisa.' },
                    { "chave": 'e', "icone": 'trending-up-outline', "cor_icone": '#F59E0B', "label": 'Empreender ou vender', "descricao": 'Pensar em negócios, vender produtos ou negociar ideias.' },
                    { "chave": 'f', "icone": 'sunny-outline', "cor_icone": '#10B981', "label": 'Atividades ao ar livre', "descricao": 'Praticar esportes, passear na natureza ou cuidar de plantas.' }
                ]
            },
            {
                "id": 3,
                "categoria": 'CURSO TÉCNICO',
                "icone_categoria": 'school-outline',
                "pergunta": 'Seu curso técnico atual influencia sua escolha de graduação?',
                "instrucao": 'Escolha apenas uma opção.',
                "opcoes": [
                    { "chave": 'a', "icone": 'checkmark-circle-outline', "cor_icone": '#10B981', "label": 'Sim, quero seguir nessa área', "descricao": 'Quero aproveitar o conhecimento que já adquiri.' },
                    { "chave": 'b', "icone": 'help-circle-outline', "cor_icone": '#F59E0B', "label": 'Talvez, ainda estou descobrindo', "descricao": 'Estou aberto a novas opções.' },
                    { "chave": 'c', "icone": 'swap-horizontal-outline', "cor_icone": '#EC4899', "label": 'Não, quero mudar de área', "descricao": 'Quero recomeçar em um caminho completamente diferente.' }
                ]
            },
            # BLOCO 2 — FORÇAS COMPORTAMENTAIS (perguntas 4 a 8)
            {
                "id": 4,
                "categoria": 'RACIOCÍNIO LÓGICO',
                "icone_categoria": 'calculator-outline',
                "pergunta": 'Como você resolve um problema difícil?',
                "instrucao": 'Escolha apenas uma opção.',
                "opcoes": [
                    { "chave": 'a', "icone": 'analytics-outline', "cor_icone": '#4F46E5', "label": 'Analiso os dados e sigo a lógica', "descricao": 'Divido o problem em partes estruturadas.' },
                    { "chave": 'b', "icone": 'bulb-outline', "cor_icone": '#8B5CF6', "label": 'Busco uma solução criativa', "descricao": 'Penso fora da caixa para achar novas saídas.' },
                    { "chave": 'c', "icone": 'people-outline', "cor_icone": '#EC4899', "label": 'Peço ajuda e colaboro', "descricao": 'Prefiro discutir e resolver o problema em equipe.' },
                    { "chave": 'd', "icone": 'construct-outline', "cor_icone": '#F59E0B', "label": 'Coloco a mão na massa e testo', "descricao": 'Vou testando na prática até funcionar.' }
                ]
            },
            {
                "id": 5,
                "categoria": 'CRIATIVIDADE',
                "icone_categoria": 'color-palette-outline',
                "pergunta": 'Qual dessas atividades você faz com mais facilidade?',
                "instrucao": 'Escolha apenas uma opção.',
                "opcoes": [
                    { "chave": 'a', "icone": 'brush-outline', "cor_icone": '#8B5CF6', "label": 'Criar e desenhar', "descricao": 'Expressar conceitos de forma visual e inventiva.' },
                    { "chave": 'b', "icone": 'calculator-outline', "cor_icone": '#4F46E5', "label": 'Resolver cálculos', "descricao": 'Lidar com números, equações e raciocínio lógico.' },
                    { "chave": 'c', "icone": 'pencil-outline', "cor_icone": '#00D4FF', "label": 'Escrever e comunicar', "descricao": 'Expressar ideias através das palavras faladas ou escritas.' },
                    { "chave": 'd', "icone": 'list-outline', "cor_icone": '#F59E0B', "label": 'Organizar e planejar', "descricao": 'Criar listas, estruturar tarefas e coordenar cronogramas.' }
                ]
            },
            {
                "id": 6,
                "categoria": 'FOCO E DISCIPLINA',
                "icone_categoria": 'eye-outline',
                "pergunta": 'Como é sua relação com prazos e metas?',
                "instrucao": 'Escolha apenas uma opção.',
                "opcoes": [
                    { "chave": 'a', "icone": 'checkmark-done-outline', "cor_icone": '#10B981', "label": 'Me planejo e entrego antes do prazo', "descricao": 'Evito deixar as tarefas para a última hora.' },
                    { "chave": 'b', "icone": 'flash-outline', "cor_icone": '#F59E0B', "label": 'Trabalho bem sob pressão', "descricao": 'Rendo muito quando o prazo está apertado.' },
                    { "chave": 'c', "icone": 'time-outline', "cor_icone": '#EC4899', "label": 'Tenho dificuldade com prazos', "descricao": 'Costumo procrastinar e me atrasar um pouco.' },
                    { "chave": 'd', "icone": 'shuffle-outline', "cor_icone": '#94A3B8', "label": 'Depende da tarefa', "descricao": 'Se for algo que gosto, foco total. Se não, procrastino.' }
                ]
            },
            {
                "id": 7,
                "categoria": 'COMUNICAÇÃO',
                "icone_categoria": 'chatbubble-outline',
                "pergunta": 'Como você se sente ao falar em público ou apresentar ideias?',
                "instrucao": 'Escolha apenas uma opção.',
                "opcoes": [
                    { "chave": 'a', "icone": 'megaphone-outline', "cor_icone": '#10B981', "label": 'Me sinto confortável e gosto', "descricao": 'Consigo me expressar com clareza e engajar as pessoas.' },
                    { "chave": 'b', "icone": 'trending-up-outline', "cor_icone": '#F59E0B', "label": 'Fico nervoso mas consigo', "descricao": 'Enfrento o nervosismo e entrego a mensagem.' },
                    { "chave": 'c', "icone": 'code-slash-outline', "cor_icone": '#4F46E5', "label": 'Prefiro trabalhar nos bastidores', "descricao": 'Foco na qualidade técnica do projeto em silêncio.' },
                    { "chave": 'd', "icone": 'eye-off-outline', "cor_icone": '#94A3B8', "label": 'Evito ao máximo', "descricao": 'Tenho bastante receio de me expor em público.' }
                ]
            },
            {
                "id": 8,
                "categoria": 'LIDERANÇA',
                "icone_categoria": 'people-outline',
                "pergunta": 'Em um trabalho em grupo, qual papel você normalmente assume?',
                "instrucao": 'Escolha apenas uma opção.',
                "opcoes": [
                    { "chave": 'a', "icone": 'ribbon-outline', "cor_icone": '#F59E0B', "label": 'Líder — organizo e divido tarefas', "descricao": 'Gosto de guiar a equipe em direção ao objetivo.' },
                    { "chave": 'b', "icone": 'construct-outline', "cor_icone": '#4F46E5', "label": 'Executor — faço as tarefas bem feitas', "descricao": 'Gosto de focar na entrega prática da minha parte.' },
                    { "chave": 'c', "icone": 'bulb-outline', "cor_icone": '#8B5CF6', "label": 'Criativo — gero as ideias', "descricao": 'Contribuo com conceitos inovadores e insights.' },
                    { "chave": 'd', "icone": 'heart-outline', "cor_icone": '#EC4899', "label": 'Mediador — resolvo conflitos', "descricao": 'Garanto que todos se comuniquem bem e trabalhem em paz.' }
                ]
            },
            # BLOCO 3 — DISCIPLINAS EM FOCO (perguntas 9 a 13)
            {
                "id": 9,
                "categoria": 'MATEMÁTICA',
                "icone_categoria": 'calculator-outline',
                "pergunta": 'Qual é a sua relação com Matemática?',
                "instrucao": 'Escolha apenas uma opção.',
                "opcoes": [
                    { "chave": 'a', "icone": 'trophy-outline', "cor_icone": '#10B981', "label": 'Adoro e me saio bem', "descricao": 'Acho lógica e números fascinantes.' },
                    { "chave": 'b', "icone": 'fitness-outline', "cor_icone": '#F59E0B', "label": 'Tenho dificuldade mas me esforço', "descricao": 'Estudo bastante para superar os desafios.' },
                    { "chave": 'c', "icone": 'remove-outline', "cor_icone": '#94A3B8', "label": 'É razoável, nem amo nem odeio', "descricao": 'Consigo lidar sem grandes problemas.' },
                    { "chave": 'd', "icone": 'close-circle-outline', "cor_icone": '#EC4899', "label": 'Tenho muita dificuldade', "descricao": 'Evito contas complexas o máximo possível.' }
                ]
            },
            {
                "id": 10,
                "categoria": 'CIÊNCIAS',
                "icone_categoria": 'flask-outline',
                "pergunta": 'Você tem mais afinidade com Física, Química ou Biologia?',
                "instrucao": 'Escolha apenas uma opção.',
                "opcoes": [
                    { "chave": 'a', "icone": 'magnet-outline', "cor_icone": '#4F46E5', "label": 'Física — leis, forças e energia', "descricao": 'Gosto de entender a mecânica do universo.' },
                    { "chave": 'b', "icone": 'flask-outline', "cor_icone": '#8B5CF6', "label": 'Química — substâncias e reações', "descricao": 'Interesse por reações químicas e elementos.' },
                    { "chave": 'c', "icone": 'leaf-outline', "cor_icone": '#10B981', "label": 'Biologia — vida e natureza', "descricao": 'Estudo do corpo humano, ecossistemas e seres vivos.' },
                    { "chave": 'd', "icone": 'close-outline', "cor_icone": '#94A3B8', "label": 'Nenhuma delas', "descricao": 'Prefiro outras áreas do conhecimento.' }
                ]
            },
            {
                "id": 11,
                "categoria": 'TECNOLOGIA',
                "icone_categoria": 'laptop-outline',
                "pergunta": 'Qual é a sua relação com computadores e programação?',
                "instrucao": 'Escolha apenas uma opção.',
                "opcoes": [
                    { "chave": 'a', "icone": 'code-slash-outline', "cor_icone": '#4F46E5', "label": 'Já sei programar ou quero aprender', "descricao": 'Quero dominar as tecnologias de ponta.' },
                    { "chave": 'b', "icone": 'desktop-outline', "cor_icone": '#00D4FF', "label": 'Gosto de usar, mas não de programar', "descricao": 'Uso ferramentas e softwares com facilidade.' },
                    { "chave": 'c', "icone": 'phone-portrait-outline', "cor_icone": '#94A3B8', "label": 'Uso o necessário no dia a dia', "descricao": 'Redes sociais, buscas e tarefas básicas.' },
                    { "chave": 'd', "icone": 'help-circle-outline', "cor_icone": '#EC4899', "label": 'Tenho dificuldade com tecnologia', "descricao": 'Acho sistemas computacionais confusos.' }
                ]
            },
            {
                "id": 12,
                "categoria": 'LINGUAGEM E ARTES',
                "icone_categoria": 'pencil-outline',
                "pergunta": 'Como você se relaciona com Português, Literatura e Artes?',
                "instrucao": 'Escolha apenas uma opção.',
                "opcoes": [
                    { "chave": 'a', "icone": 'book-outline', "cor_icone": '#8B5CF6', "label": 'Adoro escrever e ler', "descricao": 'Gosto de expressar meus pensamentos de forma escrita.' },
                    { "chave": 'b', "icone": 'color-palette-outline', "cor_icone": '#EC4899', "label": 'Gosto de artes visuais e design', "descricao": 'Aprecio pintura, desenho, fotografia e estética.' },
                    { "chave": 'c', "icone": 'construct-outline', "cor_icone": '#4F46E5', "label": 'Prefiro conteúdo técnico', "descricao": 'Prefiro leituras científicas, códigos ou manuais objetivos.' },
                    { "chave": 'd', "icone": 'close-outline', "cor_icone": '#94A3B8', "label": 'Não tenho muita afinidade', "descricao": 'Prefiro outras disciplinas no geral.' }
                ]
            },
            {
                "id": 13,
                "categoria": 'HISTÓRIA E SOCIEDADE',
                "icone_categoria": 'earth-outline',
                "pergunta": 'Você se interessa por História, Geografia ou Sociologia?',
                "instrucao": 'Escolha apenas uma opção.',
                "opcoes": [
                    { "chave": 'a', "icone": 'globe-outline', "cor_icone": '#F59E0B', "label": 'Sim, adoro entender o mundo', "descricao": 'Interesse por geopolítica, sociedade e passado.' },
                    { "chave": 'b', "icone": 'book-outline', "cor_icone": '#94A3B8', "label": 'Um pouco, quando tem contexto', "descricao": 'Gosto quando se conecta com fatos reais.' },
                    { "chave": 'c', "icone": 'calculator-outline', "cor_icone": '#4F46E5', "label": 'Prefiro ciências exatas', "descricao": 'Meu interesse está no cálculo e no método científico.' },
                    { "chave": 'd', "icone": 'close-outline', "cor_icone": '#EC4899', "label": 'Não é minha área', "descricao": 'Acho essas matérias cansativas.' }
                ]
            },
            # BLOCO 4 — OBJETIVOS E ESTILO (perguntas 14 e 15)
            {
                "id": 14,
                "categoria": 'OBJETIVOS',
                "icone_categoria": 'rocket-outline',
                "pergunta": 'O que é mais importante para você no futuro profissional?',
                "instrucao": 'Escolha apenas uma opção.',
                "opcoes": [
                    { "chave": 'a', "icone": 'cash-outline', "cor_icone": '#10B981', "label": 'Boa remuneração e estabilidade', "descricao": 'Tranquilidade e segurança para planejar a vida.' },
                    { "chave": 'b', "icone": 'heart-outline', "cor_icone": '#EC4899', "label": 'Ajudar pessoas e causar impacto', "descricao": 'Fazer a diferença no dia a dia da comunidade.' },
                    { "chave": 'c', "icone": 'bulb-outline', "cor_icone": '#4F46E5', "label": 'Inovar e criar algo novo', "descricao": 'Idealizar e construir produtos, softwares ou ideias inovadoras.' },
                    { "chave": 'd', "icone": 'school-outline', "cor_icone": '#8B5CF6', "label": 'Aprender e crescer sempre', "descricao": 'Desenvolvimento contínuo como profissional e pessoa.' }
                ]
            },
            {
                "id": 15,
                "categoria": 'PERFIL FINAL',
                "icone_categoria": 'person-outline',
                "pergunta": 'Como você se descreveria em uma palavra?',
                "instrucao": 'Escolha apenas uma opção.',
                "opcoes": [
                    { "chave": 'a', "icone": 'analytics-outline', "cor_icone": '#4F46E5', "label": 'Analítico', "descricao": 'Guiado por dados, lógica e precisão.' },
                    { "chave": 'b', "icone": 'color-palette-outline', "cor_icone": '#8B5CF6', "label": 'Criativo', "descricao": 'Movido a novas ideias e soluções visuais.' },
                    { "chave": 'c', "icone": 'chatbubble-outline', "cor_icone": '#00D4FF', "label": 'Comunicativo', "descricao": 'Gosto de expressar e trocar ideias.' },
                    { "chave": 'd', "icone": 'flash-outline', "cor_icone": '#F59E0B', "label": 'Determinado', "descricao": 'Focado e persistente em cumprir objetivos.' }
                ]
            }
        ]

        for q_data in questions_data:
            pergunta = Pergunta.objects.create(
                id=q_data["id"],
                categoria=q_data["categoria"],
                icone_categoria=q_data["icone_categoria"],
                pergunta=q_data["pergunta"],
                instrucao=q_data["instrucao"]
            )
            for o_data in q_data["opcoes"]:
                Opcao.objects.create(
                    pergunta=pergunta,
                    chave=o_data["chave"],
                    icone=o_data["icone"],
                    cor_icone=o_data["cor_icone"],
                    label=o_data["label"],
                    descricao=o_data["descricao"]
                )

        self.stdout.write(self.style.SUCCESS('Successfully seeded 15 questionnaire questions and options!'))
