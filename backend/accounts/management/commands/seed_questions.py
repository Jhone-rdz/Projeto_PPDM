from django.core.management.base import BaseCommand
from django.db import transaction
from accounts.models import Pergunta, Opcao

class Command(BaseCommand):
    help = 'Seeds initial career questionnaire questions and options'

    @transaction.atomic
    def handle(self, *args, **options):
        self.stdout.write('Seeding questions...')
        
        # Clear existing to prevent duplicate IDs or conflict
        Pergunta.objects.all().delete()

        questions_data = [
            {
                "id": 1,
                "categoria": 'ORIENTAÇÃO DE CURSO',
                "icone_categoria": 'compass-outline',
                "pergunta": 'Qual área mais desperta o seu interesse?',
                "instrucao": 'Escolha apenas uma opção.',
                "opcoes": [
                    { "chave": 'a', "icone": 'code-slash-outline', "cor_icone": '#4F46E5', "label": 'Tecnologia', "descricao": 'Desenvolver soluções digitais, criar sistemas e inovar com tecnologia.' },
                    { "chave": 'b', "icone": 'heart-outline', "cor_icone": '#EC4899', "label": 'Saúde', "descricao": 'Cuidar de pessoas, promover bem-estar e transformar vidas.' },
                    { "chave": 'c', "icone": 'book-outline', "cor_icone": '#8B5CF6', "label": 'Letras', "descricao": 'Estudar a linguagem, literatura e comunicação em todas as suas formas.' },
                    { "chave": 'd', "icone": 'leaf-outline', "cor_icone": '#10B981', "label": 'Agronomia', "descricao": 'Trabalhar com o campo, plantas, produção de alimentos e sustentabilidade.' },
                    { "chave": 'e', "icone": 'flask-outline', "cor_icone": '#3B82F6', "label": 'Química', "descricao": 'Explorar substâncias, reações e transformações que estão ao nosso redor.' },
                    { "chave": 'f', "icone": 'scale-outline', "cor_icone": '#F59E0B', "label": 'Direito', "descricao": 'Entender leis, justiça e lutar pelos direitos e deveres na sociedade.' },
                    { "chave": 'g', "icone": 'help-circle-outline', "cor_icone": '#6B7280', "label": 'Ainda não sei', "descricao": 'Quero explorar e descobrir minhas opções.' }
                ]
            },
            {
                "id": 2,
                "categoria": 'PERFIL PESSOAL',
                "icone_categoria": 'person-outline',
                "pergunta": 'Como você prefere trabalhar?',
                "instrucao": 'Escolha apenas uma opção.',
                "opcoes": [
                    { "chave": 'a', "icone": 'people-outline', "cor_icone": '#4F46E5', "label": 'Em equipe', "descricao": 'Gosto de colaborar e trabalhar junto com outras pessoas.' },
                    { "chave": 'b', "icone": 'person-outline', "cor_icone": '#10B981', "label": 'Sozinho', "descricao": 'Prefiro focar individualmente nas minhas tarefas.' },
                    { "chave": 'c', "icone": 'git-branch-outline', "cor_icone": '#F59E0B', "label": 'Ambos', "descricao": 'Me adapto bem tanto ao trabalho individual quanto em grupo.' }
                ]
            },
            {
                "id": 3,
                "categoria": 'HABILIDADES',
                "icone_categoria": 'flash-outline',
                "pergunta": 'Qual dessas atividades você faz com mais facilidade?',
                "instrucao": 'Escolha apenas uma opção.',
                "opcoes": [
                    { "chave": 'a', "icone": 'calculator-outline', "cor_icone": '#4F46E5', "label": 'Resolver problemas matemáticos', "descricao": 'Lógica e raciocínio numérico.' },
                    { "chave": 'b', "icone": 'color-palette-outline', "cor_icone": '#EC4899', "label": 'Criar e desenhar', "descricao": 'Expressão artística e visual.' },
                    { "chave": 'c', "icone": 'chatbubbles-outline', "cor_icone": '#10B981', "label": 'Comunicar e convencer', "descricao": 'Falar, escrever e liderar discussões.' },
                    { "chave": 'd', "icone": 'construct-outline', "cor_icone": '#F59E0B', "label": 'Construir e consertar', "descricao": 'Trabalho manual e técnico.' }
                ]
            },
            {
                "id": 4,
                "categoria": 'OBJETIVOS',
                "icone_categoria": 'trophy-outline',
                "pergunta": 'O que é mais importante para você no trabalho?',
                "instrucao": 'Escolha apenas uma opção.',
                "opcoes": [
                    { "chave": 'a', "icone": 'cash-outline', "cor_icone": '#10B981', "label": 'Boa remuneração', "descricao": 'Quero ter estabilidade financeira.' },
                    { "chave": 'b', "icone": 'heart-outline', "cor_icone": '#EC4899', "label": 'Ajudar pessoas', "descricao": 'Quero fazer diferença na vida de alguém.' },
                    { "chave": 'c', "icone": 'rocket-outline', "cor_icone": '#4F46E5', "label": 'Inovar e criar', "descricao": 'Quero construir coisas novas e impactantes.' },
                    { "chave": 'd', "icone": 'school-outline', "cor_icone": '#8B5CF6', "label": 'Aprender sempre', "descricao": 'Quero crescer e me desenvolver continuamente.' }
                ]
            },
            {
                "id": 5,
                "categoria": 'AMBIENTE',
                "icone_categoria": 'business-outline',
                "pergunta": 'Onde você prefere trabalhar?',
                "instrucao": 'Escolha apenas uma opção.',
                "opcoes": [
                    { "chave": 'a', "icone": 'laptop-outline', "cor_icone": '#4F46E5', "label": 'Home office / Remoto', "descricao": 'Trabalhar de casa com flexibilidade.' },
                    { "chave": 'b', "icone": 'business-outline', "cor_icone": '#F59E0B', "label": 'Escritório', "descricao": 'Ambiente corporativo e estruturado.' },
                    { "chave": 'c', "icone": 'medkit-outline', "cor_icone": '#EC4899', "label": 'Hospital ou clínica', "descricao": 'Ambiente de saúde e cuidado.' },
                    { "chave": 'd', "icone": 'leaf-outline', "cor_icone": '#10B981', "label": 'Ao ar livre / Campo', "descricao": 'Trabalho externo e contato com a natureza.' }
                ]
            },
            {
                "id": 6,
                "categoria": 'CURSO TÉCNICO',
                "icone_categoria": 'school-outline',
                "pergunta": 'O seu curso técnico atual influencia sua escolha de carreira?',
                "instrucao": 'Escolha apenas uma opção.',
                "opcoes": [
                    { "chave": 'a', "icone": 'checkmark-circle-outline', "cor_icone": '#10B981', "label": 'Sim, quero seguir nessa área', "descricao": 'Meu curso técnico define minha carreira.' },
                    { "chave": 'b', "icone": 'swap-horizontal-outline', "cor_icone": '#F59E0B', "label": 'Talvez, ainda estou descobrindo', "descricao": 'Pode influenciar, mas não tenho certeza.' },
                    { "chave": 'c', "icone": 'close-circle-outline', "cor_icone": '#EC4899', "label": 'Não, quero mudar de área', "descricao": 'Meu curso técnico não define minha graduação.' }
                ]
            },
            {
                "id": 7,
                "categoria": 'PERFIL FINAL',
                "icone_categoria": 'star-outline',
                "pergunta": 'Como você se descreveria?',
                "instrucao": 'Escolha apenas uma opção.',
                "opcoes": [
                    { "chave": 'a', "icone": 'bulb-outline', "cor_icone": '#F59E0B', "label": 'Criativo e inovador', "descricao": 'Sempre buscando novas ideias e soluções.' },
                    { "chave": 'b', "icone": 'analytics-outline', "cor_icone": '#4F46E5', "label": 'Analítico e racional', "descricao": 'Gosto de dados, lógica e precisão.' },
                    { "chave": 'c', "icone": 'people-outline', "cor_icone": '#10B981', "label": 'Social e comunicativo', "descricao": 'Me conecto facilmente com pessoas.' },
                    { "chave": 'd', "icone": 'construct-outline', "cor_icone": '#EC4899', "label": 'Prático e executor', "descricao": 'Prefiro colocar a mão na massa e fazer acontecer.' }
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

        self.stdout.write(self.style.SUCCESS('Successfully seeded questionnaire questions and options!'))
