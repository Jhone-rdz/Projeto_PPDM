from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class CustomUserSerializer(serializers.ModelSerializer):
    onboarding_completo = serializers.SerializerMethodField()
    xp_hoje = serializers.SerializerMethodField()
    respostas_hoje = serializers.SerializerMethodField()
    forcas = serializers.SerializerMethodField()
    disciplinas = serializers.SerializerMethodField()
    progresso_geral = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'curso_tecnico', 'nivel', 'xp', 
            'onboarding_completo', 'objetivo_carreira', 'streak', 'xp_hoje', 'respostas_hoje',
            'forcas', 'disciplinas', 'progresso_geral'
        ]
        read_only_fields = [
            'id', 'nivel', 'xp', 'onboarding_completo', 'xp_hoje', 'respostas_hoje',
            'forcas', 'disciplinas', 'progresso_geral'
        ]

    def get_onboarding_completo(self, obj):
        from .models import Pergunta
        perguntas_count = Pergunta.objects.count()
        if perguntas_count == 0:
            return False
        return obj.respostas.count() >= perguntas_count

    def get_xp_hoje(self, obj):
        from datetime import date
        from django.db.models import Sum
        from .models import DesafioConcluido
        total_xp = DesafioConcluido.objects.filter(
            user=obj,
            concluido_em=date.today()
        ).aggregate(total=Sum('desafio__xp'))['total']
        return total_xp or 0

    def get_respostas_hoje(self, obj):
        from datetime import date
        return obj.respostas.filter(created_at__date=date.today()).count()

    def get_forcas(self, obj):
        respostas = obj.respostas.select_related('pergunta', 'opcao').all()
        forcas_totais = {
            'logica': 0, 'criatividade': 0, 'foco': 0, 'comunicacao': 0, 'lideranca': 0
        }
        
        WEIGHTS = {
            1: {
                'a': {'tecnologia': 3, 'logica': 2, 'programacao': 2},
                'b': {'saude': 3, 'biologia': 2, 'foco': 1},
                'c': {'negocios': 3, 'comunicacao': 2, 'lideranca': 1},
                'd': {'artes': 3, 'criatividade': 3, 'desenho': 2},
                'e': {'direito': 3, 'comunicacao': 2, 'portugues': 2},
                'f': {'agronomia': 3, 'biologia': 2, 'quimica': 1},
                'g': {}
            },
            2: {
                'a': {'tecnologia': 2, 'logica': 2, 'programacao': 2},
                'b': {'artes': 2, 'criatividade': 3, 'desenho': 2},
                'c': {'foco': 2, 'portugues': 2, 'historia': 1},
                'd': {'saude': 2, 'comunicacao': 2, 'lideranca': 1},
                'e': {'negocios': 2, 'comunicacao': 2, 'lideranca': 2},
                'f': {'agronomia': 2, 'biologia': 1, 'foco': 1}
            },
            3: {
                'a': {'foco': 2},
                'b': {},
                'c': {'criatividade': 1}
            },
            4: {
                'a': {'logica': 3, 'matematica': 2, 'foco': 1},
                'b': {'criatividade': 3, 'logica': 1},
                'c': {'comunicacao': 3, 'lideranca': 1},
                'd': {'foco': 3, 'logica': 1, 'programacao': 1}
            },
            5: {
                'a': {'criatividade': 3, 'desenho': 3, 'artes': 2},
                'b': {'logica': 3, 'matematica': 3, 'fisica': 1},
                'c': {'comunicacao': 3, 'portugues': 3, 'criatividade': 1},
                'd': {'logica': 2, 'foco': 3, 'lideranca': 1}
            },
            6: {
                'a': {'foco': 3, 'lideranca': 1, 'logica': 1},
                'b': {'foco': 2, 'criatividade': 1},
                'c': {'criatividade': 2},
                'd': {'foco': 1, 'comunicacao': 1}
            },
            7: {
                'a': {'comunicacao': 3, 'lideranca': 2, 'portugues': 1},
                'b': {'comunicacao': 2, 'foco': 1},
                'c': {'logica': 2, 'criatividade': 2, 'programacao': 1},
                'd': {'foco': 2, 'portugues': 1}
            },
            8: {
                'a': {'lideranca': 3, 'comunicacao': 2, 'foco': 1},
                'b': {'foco': 3, 'logica': 2},
                'c': {'criatividade': 3, 'lideranca': 1},
                'd': {'comunicacao': 3, 'lideranca': 2}
            },
            9: {
                'a': {'matematica': 3, 'logica': 2, 'fisica': 1},
                'b': {'matematica': 2, 'foco': 2},
                'c': {'matematica': 1, 'logica': 1},
                'd': {'criatividade': 1, 'portugues': 1}
            },
            10: {
                'a': {'fisica': 3, 'matematica': 2, 'logica': 1},
                'b': {'quimica': 3, 'logica': 1, 'foco': 1},
                'c': {'biologia': 3, 'saude': 1, 'agronomia': 1},
                'd': {'portugues': 1, 'criatividade': 1}
            },
            11: {
                'a': {'programacao': 3, 'logica': 2, 'tecnologia': 2},
                'b': {'tecnologia': 2, 'foco': 1},
                'c': {'comunicacao': 1},
                'd': {'criatividade': 1, 'desenho': 1}
            },
            12: {
                'a': {'portugues': 3, 'comunicacao': 2, 'criatividade': 1},
                'b': {'desenho': 3, 'criatividade': 3, 'artes': 2},
                'c': {'logica': 2, 'foco': 1, 'programacao': 1},
                'd': {'matematica': 1, 'logica': 1}
            },
            13: {
                'a': {'historia': 3, 'comunicacao': 1, 'portugues': 1},
                'b': {'historia': 1, 'portugues': 1},
                'c': {'logica': 2, 'matematica': 1},
                'd': {'programacao': 1, 'tecnologia': 1}
            },
            14: {
                'a': {'negocios': 1, 'foco': 2, 'lideranca': 1},
                'b': {'saude': 2, 'comunicacao': 2, 'lideranca': 1},
                'c': {'tecnologia': 2, 'criatividade': 3, 'programacao': 1},
                'd': {'foco': 2, 'logica': 1, 'historia': 1}
            },
            15: {
                'a': {'logica': 3, 'matematica': 1, 'foco': 1},
                'b': {'criatividade': 3, 'desenho': 1, 'artes': 1},
                'c': {'comunicacao': 3, 'lideranca': 1, 'portugues': 1},
                'd': {'foco': 3, 'lideranca': 2}
            }
        }

        for resp in respostas:
            p_id = resp.pergunta.id
            chave = resp.opcao.chave
            if p_id in WEIGHTS and chave in WEIGHTS[p_id]:
                peso = WEIGHTS[p_id][chave]
                for k, v in peso.items():
                    if k in forcas_totais:
                        forcas_totais[k] += v

        max_forcas = 15
        result = []
        display_names = {
            'logica': 'Lógica',
            'criatividade': 'Criatividade',
            'foco': 'Foco',
            'comunicacao': 'Comunicação',
            'lideranca': 'Liderança'
        }
        for k, v in forcas_totais.items():
            pct = min(100, round((v / max_forcas) * 100))
            val_norm = min(95, max(30, pct))
            result.append({"nome": display_names[k], "valor": val_norm})
        return result

    def get_disciplinas(self, obj):
        respostas = obj.respostas.select_related('pergunta', 'opcao').all()
        disciplinas_totais = {
            'matematica': 0, 'fisica': 0, 'programacao': 0, 'desenho': 0, 'portugues': 0,
            'biologia': 0, 'quimica': 0, 'historia': 0
        }
        
        WEIGHTS = {
            1: {
                'a': {'tecnologia': 3, 'logica': 2, 'programacao': 2},
                'b': {'saude': 3, 'biologia': 2, 'foco': 1},
                'c': {'negocios': 3, 'comunicacao': 2, 'lideranca': 1},
                'd': {'artes': 3, 'criatividade': 3, 'desenho': 2},
                'e': {'direito': 3, 'comunicacao': 2, 'portugues': 2},
                'f': {'agronomia': 3, 'biologia': 2, 'quimica': 1},
                'g': {}
            },
            2: {
                'a': {'tecnologia': 2, 'logica': 2, 'programacao': 2},
                'b': {'artes': 2, 'criatividade': 3, 'desenho': 2},
                'c': {'foco': 2, 'portugues': 2, 'historia': 1},
                'd': {'saude': 2, 'comunicacao': 2, 'lideranca': 1},
                'e': {'negocios': 2, 'comunicacao': 2, 'lideranca': 2},
                'f': {'agronomia': 2, 'biologia': 1, 'foco': 1}
            },
            3: {
                'a': {'foco': 2},
                'b': {},
                'c': {'criatividade': 1}
            },
            4: {
                'a': {'logica': 3, 'matematica': 2, 'foco': 1},
                'b': {'criatividade': 3, 'logica': 1},
                'c': {'comunicacao': 3, 'lideranca': 1},
                'd': {'foco': 3, 'logica': 1, 'programacao': 1}
            },
            5: {
                'a': {'criatividade': 3, 'desenho': 3, 'artes': 2},
                'b': {'logica': 3, 'matematica': 3, 'fisica': 1},
                'c': {'comunicacao': 3, 'portugues': 3, 'criatividade': 1},
                'd': {'logica': 2, 'foco': 3, 'lideranca': 1}
            },
            6: {
                'a': {'foco': 3, 'lideranca': 1, 'logica': 1},
                'b': {'foco': 2, 'criatividade': 1},
                'c': {'criatividade': 2},
                'd': {'foco': 1, 'comunicacao': 1}
            },
            7: {
                'a': {'comunicacao': 3, 'lideranca': 2, 'portugues': 1},
                'b': {'comunicacao': 2, 'foco': 1},
                'c': {'logica': 2, 'criatividade': 2, 'programacao': 1},
                'd': {'foco': 2, 'portugues': 1}
            },
            8: {
                'a': {'lideranca': 3, 'comunicacao': 2, 'foco': 1},
                'b': {'foco': 3, 'logica': 2},
                'c': {'criatividade': 3, 'lideranca': 1},
                'd': {'comunicacao': 3, 'lideranca': 2}
            },
            9: {
                'a': {'matematica': 3, 'logica': 2, 'fisica': 1},
                'b': {'matematica': 2, 'foco': 2},
                'c': {'matematica': 1, 'logica': 1},
                'd': {'criatividade': 1, 'portugues': 1}
            },
            10: {
                'a': {'fisica': 3, 'matematica': 2, 'logica': 1},
                'b': {'quimica': 3, 'logica': 1, 'foco': 1},
                'c': {'biologia': 3, 'saude': 1, 'agronomia': 1},
                'd': {'portugues': 1, 'criatividade': 1}
            },
            11: {
                'a': {'programacao': 3, 'logica': 2, 'tecnologia': 2},
                'b': {'tecnologia': 2, 'foco': 1},
                'c': {'comunicacao': 1},
                'd': {'criatividade': 1, 'desenho': 1}
            },
            12: {
                'a': {'portugues': 3, 'comunicacao': 2, 'criatividade': 1},
                'b': {'desenho': 3, 'criatividade': 3, 'artes': 2},
                'c': {'logica': 2, 'foco': 1, 'programacao': 1},
                'd': {'matematica': 1, 'logica': 1}
            },
            13: {
                'a': {'historia': 3, 'comunicacao': 1, 'portugues': 1},
                'b': {'historia': 1, 'portugues': 1},
                'c': {'logica': 2, 'matematica': 1},
                'd': {'programacao': 1, 'tecnologia': 1}
            },
            14: {
                'a': {'negocios': 1, 'foco': 2, 'lideranca': 1},
                'b': {'saude': 2, 'comunicacao': 2, 'lideranca': 1},
                'c': {'tecnologia': 2, 'criatividade': 3, 'programacao': 1},
                'd': {'foco': 2, 'logica': 1, 'historia': 1}
            },
            15: {
                'a': {'logica': 3, 'matematica': 1, 'foco': 1},
                'b': {'criatividade': 3, 'desenho': 1, 'artes': 1},
                'c': {'comunicacao': 3, 'lideranca': 1, 'portugues': 1},
                'd': {'foco': 3, 'lideranca': 2}
            }
        }

        for resp in respostas:
            p_id = resp.pergunta.id
            chave = resp.opcao.chave
            if p_id in WEIGHTS and chave in WEIGHTS[p_id]:
                peso = WEIGHTS[p_id][chave]
                for k, v in peso.items():
                    if k in disciplinas_totais:
                        disciplinas_totais[k] += v

        max_disciplinas = 12
        result = []
        display_names = {
            'matematica': 'Matemática',
            'fisica': 'Física',
            'programacao': 'Programação',
            'desenho': 'Desenho',
            'portugues': 'Português',
            'biologia': 'Biologia',
            'quimica': 'Química',
            'historia': 'História'
        }
        for k, v in disciplinas_totais.items():
            pct = min(100, round((v / max_disciplinas) * 100))
            val_norm = min(95, max(30, pct))
            result.append({"nome": display_names[k], "valor": val_norm})
        return result

    def get_progresso_geral(self, obj):
        from .models import Desafio, DesafioConcluido
        total_desafios = Desafio.objects.count()
        if total_desafios == 0:
            return 0
        concluidos = DesafioConcluido.objects.filter(user=obj).count()
        return min(100, int((concluidos / total_desafios) * 100))

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'curso_tecnico']

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Este e-mail já está sendo utilizado.")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            curso_tecnico=validated_data.get('curso_tecnico', '')
        )
        return user

from django.db import transaction
from .models import Pergunta, Opcao, RespostaUsuario, Curso, Desafio

class OpcaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Opcao
        fields = ['chave', 'icone', 'cor_icone', 'label', 'descricao']

class PerguntaSerializer(serializers.ModelSerializer):
    opcoes = OpcaoSerializer(many=True, read_only=True)

    class Meta:
        model = Pergunta
        fields = ['id', 'categoria', 'icone_categoria', 'pergunta', 'instrucao', 'opcoes']

class RespostaItemSerializer(serializers.Serializer):
    pergunta_id = serializers.IntegerField()
    opcao_chave = serializers.CharField(max_length=2)

class RespostaQuestionarioSerializer(serializers.Serializer):
    respostas = RespostaItemSerializer(many=True)

    def validate_respostas(self, value):
        if not value:
            raise serializers.ValidationError("A lista de respostas não pode estar vazia.")
        
        # Verify that all questions exist
        for item in value:
            p_id = item['pergunta_id']
            o_key = item['opcao_chave']
            try:
                pergunta = Pergunta.objects.get(id=p_id)
            except Pergunta.DoesNotExist:
                raise serializers.ValidationError(f"Pergunta com ID {p_id} não existe.")
            
            if not Opcao.objects.filter(pergunta=pergunta, chave=o_key).exists():
                raise serializers.ValidationError(f"Opção '{o_key}' inválida para a pergunta {p_id}.")
        
        return value

    def save(self, user):
        respostas_data = self.validated_data['respostas']
        created_objects = []
        
        with transaction.atomic():
            for item in respostas_data:
                pergunta = Pergunta.objects.get(id=item['pergunta_id'])
                opcao = Opcao.objects.get(pergunta=pergunta, chave=item['opcao_chave'])
                
                # Update or create answer
                resposta, created = RespostaUsuario.objects.update_or_create(
                    user=user,
                    pergunta=pergunta,
                    defaults={'opcao': opcao}
                )
                created_objects.append(resposta)
                
        return created_objects

class CursoSerializer(serializers.ModelSerializer):
    tags = serializers.ReadOnlyField()

    class Meta:
        model = Curso
        fields = [
            'id', 'nome', 'tipo', 'duracao', 'descricao', 
            'area', 'tags', 'match_percent', 'icone', 
            'cor_icone', 'cor_fundo'
        ]

class DesafioSerializer(serializers.ModelSerializer):
    concluido = serializers.SerializerMethodField()

    class Meta:
        model = Desafio
        fields = [
            'id', 'titulo', 'descricao', 'xp',
            'icone', 'cor_icone', 'action_text',
            'route_target', 'concluido'
        ]

    def get_concluido(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
        from datetime import date
        from .models import DesafioConcluido
        return DesafioConcluido.objects.filter(
            user=request.user,
            desafio=obj,
            concluido_em=date.today()
        ).exists()

class CursoComMatchSerializer(serializers.ModelSerializer):
    tags = serializers.ReadOnlyField()
    corIcone = serializers.CharField(source='cor_icone')
    corFundo = serializers.CharField(source='cor_fundo')
    match = serializers.SerializerMethodField()
    tipoMatch = serializers.SerializerMethodField()

    class Meta:
        model = Curso
        fields = [
            'id', 'nome', 'tipo', 'duracao', 'descricao', 'tags',
            'icone', 'corIcone', 'corFundo', 'match', 'tipoMatch'
        ]

    def get_match(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return obj.match_percent
        try:
            perfil = request.user.perfil
            # Get the match percent from user's computed areas
            area_score = getattr(perfil, obj.area.lower(), None)
            if area_score is not None:
                return area_score
        except Exception:
            pass
        return obj.match_percent

    def get_tipoMatch(self, obj):
        match_val = self.get_match(obj)
        if match_val >= 80:
            return 'MATCH ALTO'
        elif match_val >= 50:
            return 'MATCH BOM'
        else:
            return 'MATCH REGULAR'

