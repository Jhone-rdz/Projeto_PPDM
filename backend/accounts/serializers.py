from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

def get_fallback_profile(curso_tecnico):
    curso = (curso_tecnico or "").strip().lower()
    
    if "desenvolvimento" in curso or "informática" in curso or "tecnologia" in curso or "ti" in curso:
        return {
            'logica': 65, 'criatividade': 50, 'foco': 60, 'comunicacao': 45, 'lideranca': 40,
            'matematica': 60, 'fisica': 50, 'programacao': 70, 'desenho': 35, 'portugues': 50,
            'biologia': 30, 'quimica': 30, 'historia': 40
        }
    elif "administração" in curso or "adm" in curso or "logística" in curso or "negócios" in curso:
        return {
            'logica': 55, 'criatividade': 45, 'foco': 60, 'comunicacao': 65, 'lideranca': 70,
            'matematica': 55, 'fisica': 30, 'programacao': 30, 'desenho': 35, 'portugues': 60,
            'biologia': 30, 'quimica': 30, 'historia': 55
        }
    elif "enfermagem" in curso or "saúde" in curso or "biológica" in curso:
        return {
            'logica': 45, 'criatividade': 40, 'foco': 70, 'comunicacao': 60, 'lideranca': 50,
            'matematica': 40, 'fisica': 40, 'programacao': 30, 'desenho': 30, 'portugues': 55,
            'biologia': 75, 'quimica': 60, 'historia': 50
        }
    elif "eletrotécnica" in curso or "mecatrônica" in curso or "automação" in curso or "mecânica" in curso:
        return {
            'logica': 60, 'criatividade': 45, 'foco': 65, 'comunicacao': 40, 'lideranca': 45,
            'matematica': 65, 'fisica': 70, 'programacao': 50, 'desenho': 55, 'portugues': 45,
            'biologia': 30, 'quimica': 40, 'historia': 35
        }
    else:
        # Balanced general default
        return {
            'logica': 50, 'criatividade': 50, 'foco': 50, 'comunicacao': 50, 'lideranca': 50,
            'matematica': 45, 'fisica': 40, 'programacao': 40, 'desenho': 40, 'portugues': 50,
            'biologia': 35, 'quimica': 35, 'historia': 45
        }

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
            fb = get_fallback_profile(obj.curso_tecnico)
            logica, criatividade, foco, comunicacao, lideranca = fb['logica'], fb['criatividade'], fb['foco'], fb['comunicacao'], fb['lideranca']

        xp_bonus = obj.xp // 10
        return [
            {"nome": "Lógica", "valor": min(100, logica + int(xp_bonus * 1.2))},
            {"nome": "Criatividade", "valor": min(100, criatividade + int(xp_bonus * 0.8))},
            {"nome": "Foco", "valor": min(100, foco + int(xp_bonus * 1.1))},
            {"nome": "Comunicação", "valor": min(100, comunicacao + int(xp_bonus * 0.9))},
            {"nome": "Liderança", "valor": min(100, lideranca + int(xp_bonus * 1.0))},
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
            fb = get_fallback_profile(obj.curso_tecnico)
            matematica, fisica, programacao, desenho, portugues, biologia, quimica, historia = fb['matematica'], fb['fisica'], fb['programacao'], fb['desenho'], fb['portugues'], fb['biologia'], fb['quimica'], fb['historia']

        xp_bonus = obj.xp // 10
        return [
            {"nome": "Matemática", "valor": min(100, matematica + int(xp_bonus * 1.1))},
            {"nome": "Física", "valor": min(100, fisica + int(xp_bonus * 1.0))},
            {"nome": "Programação", "valor": min(100, programacao + int(xp_bonus * 1.2))},
            {"nome": "Desenho", "valor": min(100, desenho + int(xp_bonus * 0.8))},
            {"nome": "Português", "valor": min(100, portugues + int(xp_bonus * 0.9))},
            {"nome": "Biologia", "valor": min(100, biologia + int(xp_bonus * 0.7))},
            {"nome": "Química", "valor": min(100, quimica + int(xp_bonus * 0.7))},
            {"nome": "História", "valor": min(100, historia + int(xp_bonus * 0.8))},
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
            fb = get_fallback_profile(obj.curso_tecnico)
            logica, criatividade, foco, comunicacao, lideranca = fb['logica'], fb['criatividade'], fb['foco'], fb['comunicacao'], fb['lideranca']
            matematica, fisica, programacao, desenho, portugues, biologia, quimica, historia = fb['matematica'], fb['fisica'], fb['programacao'], fb['desenho'], fb['portugues'], fb['biologia'], fb['quimica'], fb['historia']

        xp_bonus = obj.xp // 10
        total_sum = (
            min(100, logica + int(xp_bonus * 1.2)) + min(100, criatividade + int(xp_bonus * 0.8)) + min(100, foco + int(xp_bonus * 1.1)) +
            min(100, comunicacao + int(xp_bonus * 0.9)) + min(100, lideranca + int(xp_bonus * 1.0)) +
            min(100, matematica + int(xp_bonus * 1.1)) + min(100, fisica + int(xp_bonus * 1.0)) + min(100, programacao + int(xp_bonus * 1.2)) +
            min(100, desenho + int(xp_bonus * 0.8)) + min(100, portugues + int(xp_bonus * 0.9)) + min(100, biologia + int(xp_bonus * 0.7)) +
            min(100, quimica + int(xp_bonus * 0.7)) + min(100, historia + int(xp_bonus * 0.8))
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

def get_course_requirements(nome, area):
    nome_lower = nome.lower()
    reqs = {}
    
    # Default requirements by area
    if area == 'tecnologia':
        reqs = {'logica': 0.4, 'programacao': 0.4, 'matematica': 0.2}
        if 'inteligência' in nome_lower or 'dados' in nome_lower:
            reqs = {'logica': 0.3, 'programacao': 0.3, 'matematica': 0.4}
        elif 'segurança' in nome_lower or 'redes' in nome_lower:
            reqs = {'foco': 0.4, 'logica': 0.3, 'programacao': 0.3}
    elif area == 'saude':
        reqs = {'biologia': 0.4, 'foco': 0.3, 'quimica': 0.3}
        if 'psicologia' in nome_lower:
            reqs = {'comunicacao': 0.4, 'foco': 0.3, 'historia': 0.3}
        elif 'educação física' in nome_lower:
            reqs = {'foco': 0.4, 'biologia': 0.3, 'lideranca': 0.3}
    elif area == 'negocios':
        reqs = {'lideranca': 0.3, 'comunicacao': 0.3, 'matematica': 0.4}
        if 'marketing' in nome_lower:
            reqs = {'criatividade': 0.4, 'comunicacao': 0.4, 'portugues': 0.2}
        elif 'recursos humanos' in nome_lower:
            reqs = {'comunicacao': 0.4, 'lideranca': 0.3, 'portugues': 0.3}
    elif area == 'artes':
        reqs = {'criatividade': 0.5, 'desenho': 0.3, 'foco': 0.2}
        if 'arquitetura' in nome_lower:
            reqs = {'criatividade': 0.3, 'desenho': 0.3, 'fisica': 0.4}
        elif 'cinema' in nome_lower or 'audiovisual' in nome_lower:
            reqs = {'criatividade': 0.4, 'comunicacao': 0.3, 'historia': 0.3}
    elif area == 'direito':
        reqs = {'portugues': 0.4, 'comunicacao': 0.3, 'historia': 0.3}
        if 'direito' in nome_lower:
            reqs = {'portugues': 0.3, 'comunicacao': 0.4, 'historia': 0.3}
        elif 'geografia' in nome_lower:
            reqs = {'historia': 0.4, 'fisica': 0.3, 'foco': 0.3}
    elif area == 'agronomia':
        reqs = {'biologia': 0.4, 'quimica': 0.3, 'foco': 0.3}
        if 'veterinária' in nome_lower or 'zootecnia' in nome_lower:
            reqs = {'biologia': 0.5, 'foco': 0.3, 'quimica': 0.2}
        elif 'máquinas' in nome_lower or 'agrícola' in nome_lower:
            reqs = {'fisica': 0.4, 'matematica': 0.3, 'logica': 0.3}
            
    return reqs

def get_user_boosted_scores(user):
    from .models import PerfilUsuario
    try:
        perfil = user.perfil
        scores = {
            'logica': perfil.logica,
            'criatividade': perfil.criatividade,
            'foco': perfil.foco,
            'comunicacao': perfil.comunicacao,
            'lideranca': perfil.lideranca,
            'matematica': perfil.matematica,
            'fisica': perfil.fisica,
            'programacao': perfil.programacao,
            'desenho': perfil.desenho,
            'portugues': perfil.portugues,
            'biologia': perfil.biologia,
            'quimica': perfil.quimica,
            'historia': perfil.historia,
            'tecnologia': perfil.tecnologia,
            'saude': perfil.saude,
            'negocios': perfil.negocios,
            'artes': perfil.artes,
            'direito': perfil.direito,
            'agronomia': perfil.agronomia
        }
    except PerfilUsuario.DoesNotExist:
        fb = get_fallback_profile(user.curso_tecnico)
        scores = {
            'logica': fb['logica'],
            'criatividade': fb['criatividade'],
            'foco': fb['foco'],
            'comunicacao': fb['comunicacao'],
            'lideranca': fb['lideranca'],
            'matematica': fb['matematica'],
            'fisica': fb['fisica'],
            'programacao': fb['programacao'],
            'desenho': fb['desenho'],
            'portugues': fb['portugues'],
            'biologia': fb['biologia'],
            'quimica': fb['quimica'],
            'historia': fb['historia'],
            'tecnologia': fb['logica'],
            'saude': fb['biologia'],
            'negocios': fb['lideranca'],
            'artes': fb['criatividade'],
            'direito': fb['portugues'],
            'agronomia': fb['biologia']
        }
        
    xp_bonus = user.xp // 10
    boosted = {}
    
    multipliers = {
        'logica': 1.2, 'criatividade': 0.8, 'foco': 1.1, 'comunicacao': 0.9, 'lideranca': 1.0,
        'matematica': 1.1, 'fisica': 1.0, 'programacao': 1.2, 'desenho': 0.8, 'portugues': 0.9,
        'biologia': 0.7, 'quimica': 0.7, 'historia': 0.8,
        'tecnologia': 1.0, 'saude': 1.0, 'negocios': 1.0, 'artes': 1.0, 'direito': 1.0, 'agronomia': 1.0
    }
    
    for k, v in scores.items():
        mult = multipliers.get(k, 1.0)
        boosted[k] = min(100, v + int(xp_bonus * mult))
        
    return boosted

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
            scores = get_user_boosted_scores(request.user)
            area_score = scores.get(obj.area.lower(), 50)
            
            # Get requirements
            reqs = get_course_requirements(obj.nome, obj.area.lower())
            
            attr_score = 0
            for attr, weight in reqs.items():
                val = scores.get(attr, 50)
                attr_score += val * weight
                
            if not reqs:
                attr_score = area_score
                
            # Combine 40% area affinity + 60% specific skills alignment
            match_val = round((area_score * 0.4) + (attr_score * 0.6))
            
            # Apply a small course-specific offset to break ties and differentiate similar scores
            match_val = match_val - (obj.id % 4)

            # Boost if technical course matches tags
            user_tech = (request.user.curso_tecnico or "").lower()
            if user_tech:
                boost = 0
                for tag in obj.tags:
                    if tag.lower() in user_tech or user_tech in tag.lower():
                        boost += 5
                match_val = match_val + boost
                
            return max(30, min(98, match_val))
        except Exception:
            return obj.match_percent

    def get_tipoMatch(self, obj):
        match_val = self.get_match(obj)
        if match_val >= 80:
            return 'MATCH ALTO'
        elif match_val >= 50:
            return 'MATCH BOM'
        else:
            return 'MATCH REGULAR'

