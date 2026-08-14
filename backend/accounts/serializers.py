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
        from .models import PerfilUsuario
        try:
            perfil = obj.perfil
            logica = perfil.logica
            criatividade = perfil.criatividade
            foco = perfil.foco
            comunicacao = perfil.comunicacao
            lideranca = perfil.lideranca
        except PerfilUsuario.DoesNotExist:
            logica = criatividade = foco = comunicacao = lideranca = 30

        xp_bonus = obj.xp // 10
        return [
            {"nome": "Lógica", "valor": min(100, logica + xp_bonus)},
            {"nome": "Criatividade", "valor": min(100, criatividade + xp_bonus)},
            {"nome": "Foco", "valor": min(100, foco + xp_bonus)},
            {"nome": "Comunicação", "valor": min(100, comunicacao + xp_bonus)},
            {"nome": "Liderança", "valor": min(100, lideranca + xp_bonus)},
        ]

    def get_disciplinas(self, obj):
        from .models import PerfilUsuario
        try:
            perfil = obj.perfil
            matematica = perfil.matematica
            fisica = perfil.fisica
            programacao = perfil.programacao
            desenho = perfil.desenho
            portugues = perfil.portugues
            biologia = perfil.biologia
            quimica = perfil.quimica
            historia = perfil.historia
        except PerfilUsuario.DoesNotExist:
            matematica = fisica = programacao = desenho = portugues = biologia = quimica = historia = 30

        xp_bonus = obj.xp // 10
        return [
            {"nome": "Matemática", "valor": min(100, matematica + xp_bonus)},
            {"nome": "Física", "valor": min(100, fisica + xp_bonus)},
            {"nome": "Programação", "valor": min(100, programacao + xp_bonus)},
            {"nome": "Desenho", "valor": min(100, desenho + xp_bonus)},
            {"nome": "Português", "valor": min(100, portugues + xp_bonus)},
            {"nome": "Biologia", "valor": min(100, biologia + xp_bonus)},
            {"nome": "Química", "valor": min(100, quimica + xp_bonus)},
            {"nome": "História", "valor": min(100, historia + xp_bonus)},
        ]

    def get_progresso_geral(self, obj):
        from .models import PerfilUsuario
        try:
            perfil = obj.perfil
            logica = perfil.logica
            criatividade = perfil.criatividade
            foco = perfil.foco
            comunicacao = perfil.comunicacao
            lideranca = perfil.lideranca
            
            matematica = perfil.matematica
            fisica = perfil.fisica
            programacao = perfil.programacao
            desenho = perfil.desenho
            portugues = perfil.portugues
            biologia = perfil.biologia
            quimica = perfil.quimica
            historia = perfil.historia
        except PerfilUsuario.DoesNotExist:
            logica = criatividade = foco = comunicacao = lideranca = 30
            matematica = fisica = programacao = desenho = portugues = biologia = quimica = historia = 30

        xp_bonus = obj.xp // 10
        total_sum = (
            min(100, logica + xp_bonus) + min(100, criatividade + xp_bonus) + min(100, foco + xp_bonus) +
            min(100, comunicacao + xp_bonus) + min(100, lideranca + xp_bonus) +
            min(100, matematica + xp_bonus) + min(100, fisica + xp_bonus) + min(100, programacao + xp_bonus) +
            min(100, desenho + xp_bonus) + min(100, portugues + xp_bonus) + min(100, biologia + xp_bonus) +
            min(100, quimica + xp_bonus) + min(100, historia + xp_bonus)
        )
        return round(total_sum / 13)

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

