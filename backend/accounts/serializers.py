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
        forcas = {
            'Lógica': 30,
            'Criatividade': 30,
            'Foco': 30,
            'Comunicação': 30,
            'Liderança': 30,
        }
        if not respostas.exists():
            return [{"nome": k, "valor": v} for k, v in forcas.items()]

        for resp in respostas:
            p_id = resp.pergunta.id
            chave = resp.opcao.chave

            if p_id == 1:
                if chave == 'a':
                    forcas['Lógica'] += 25
                    forcas['Foco'] += 10
                elif chave == 'b':
                    forcas['Foco'] += 20
                    forcas['Liderança'] += 10
                elif chave == 'c':
                    forcas['Comunicação'] += 30
                    forcas['Criatividade'] += 10
                elif chave == 'd':
                    forcas['Foco'] += 20
                elif chave == 'e':
                    forcas['Lógica'] += 20
                elif chave == 'f':
                    forcas['Comunicação'] += 25
                    forcas['Liderança'] += 20
                elif chave == 'g':
                    forcas['Criatividade'] += 15
                    forcas['Comunicação'] += 15
            elif p_id == 2:
                if chave == 'a':
                    forcas['Comunicação'] += 20
                    forcas['Liderança'] += 25
                elif chave == 'b':
                    forcas['Foco'] += 35
                    forcas['Lógica'] += 10
                elif chave == 'c':
                    forcas['Foco'] += 20
                    forcas['Comunicação'] += 15
                    forcas['Liderança'] += 10
            elif p_id == 3:
                if chave == 'a':
                    forcas['Lógica'] += 35
                elif chave == 'b':
                    forcas['Criatividade'] += 45
                elif chave == 'c':
                    forcas['Comunicação'] += 45
                    forcas['Liderança'] += 25
                elif chave == 'd':
                    forcas['Foco'] += 25
            elif p_id == 4:
                if chave == 'a':
                    forcas['Lógica'] += 15
                    forcas['Foco'] += 15
                elif chave == 'b':
                    forcas['Comunicação'] += 20
                    forcas['Liderança'] += 15
                elif chave == 'c':
                    forcas['Criatividade'] += 35
                elif chave == 'd':
                    forcas['Foco'] += 20
                    forcas['Lógica'] += 15
            elif p_id == 5:
                if chave == 'a':
                    forcas['Foco'] += 25
                elif chave == 'b':
                    forcas['Comunicação'] += 15
                    forcas['Liderança'] += 10
                elif chave == 'c':
                    forcas['Foco'] += 15
                elif chave == 'd':
                    forcas['Criatividade'] += 15
            elif p_id == 6:
                if chave == 'a':
                    forcas['Lógica'] += 10
                    forcas['Liderança'] += 10
                elif chave == 'b':
                    forcas['Criatividade'] += 10
                elif chave == 'c':
                    forcas['Criatividade'] += 15
            elif p_id == 7:
                if chave == 'a':
                    forcas['Criatividade'] += 45
                elif chave == 'b':
                    forcas['Lógica'] += 45
                elif chave == 'c':
                    forcas['Comunicação'] += 45
                    forcas['Liderança'] += 25
                elif chave == 'd':
                    forcas['Foco'] += 35

        result = []
        for k, v in forcas.items():
            valor_normalizado = min(95, max(30, v))
            result.append({"nome": k, "valor": valor_normalizado})
        return result

    def get_disciplinas(self, obj):
        respostas = obj.respostas.select_related('pergunta', 'opcao').all()
        disciplinas = {
            'Matemática': 30,
            'Física': 30,
            'Programação': 30,
            'Desenho': 30,
            'Português': 30,
        }
        if not respostas.exists():
            return [{"nome": k, "valor": v} for k, v in disciplinas.items()]

        for resp in respostas:
            p_id = resp.pergunta.id
            chave = resp.opcao.chave

            if p_id == 1:
                if chave == 'a':
                    disciplinas['Programação'] += 40
                    disciplinas['Matemática'] += 15
                elif chave == 'b':
                    disciplinas['Física'] += 20
                elif chave == 'c':
                    disciplinas['Português'] += 50
                elif chave == 'd':
                    disciplinas['Matemática'] += 15
                    disciplinas['Física'] += 15
                    disciplinas['Desenho'] += 10
                elif chave == 'e':
                    disciplinas['Física'] += 30
                    disciplinas['Matemática'] += 10
                elif chave == 'f':
                    disciplinas['Português'] += 35
            elif p_id == 3:
                if chave == 'a':
                    disciplinas['Matemática'] += 45
                    disciplinas['Programação'] += 15
                elif chave == 'b':
                    disciplinas['Desenho'] += 50
                elif chave == 'c':
                    disciplinas['Português'] += 25
                elif chave == 'd':
                    disciplinas['Física'] += 35
                    disciplinas['Desenho'] += 15
            elif p_id == 4:
                if chave == 'c':
                    disciplinas['Programação'] += 25
                    disciplinas['Desenho'] += 15
                elif chave == 'd':
                    disciplinas['Matemática'] += 10
                    disciplinas['Português'] += 10
            elif p_id == 5:
                if chave == 'a':
                    disciplinas['Programação'] += 20
                elif chave == 'c':
                    disciplinas['Física'] += 15
                elif chave == 'd':
                    disciplinas['Desenho'] += 15
            elif p_id == 7:
                if chave == 'a':
                    disciplinas['Desenho'] += 20
                elif chave == 'b':
                    disciplinas['Matemática'] += 25
                    disciplinas['Programação'] += 20
                elif chave == 'c':
                    disciplinas['Português'] += 20
                elif chave == 'd':
                    disciplinas['Física'] += 20

        result = []
        for k, v in disciplinas.items():
            valor_normalizado = min(95, max(30, v))
            result.append({"nome": k, "valor": valor_normalizado})
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
