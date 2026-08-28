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
            'id', 'onboarding_completo', 'xp_hoje', 'respostas_hoje',
            'forcas', 'disciplinas', 'progresso_geral'
        ]

    def update(self, instance, validated_data):
        instance = super().update(instance, validated_data)
        
        # Recalculate user level when XP is modified via API
        if 'xp' in validated_data:
            from .models import PerfilUsuario
            try:
                perfil = instance.perfil
                logica, criatividade, foco, comunicacao, lideranca = perfil.logica, perfil.criatividade, perfil.foco, perfil.comunicacao, perfil.lideranca
                matematica, fisica, programacao, desenho, portugues, biologia, quimica, historia = perfil.matematica, perfil.fisica, perfil.programacao, perfil.desenho, perfil.portugues, perfil.biologia, perfil.quimica, perfil.historia
            except PerfilUsuario.DoesNotExist:
                fb = get_fallback_profile(instance.curso_tecnico)
                logica, criatividade, foco, comunicacao, lideranca = fb['logica'], fb['criatividade'], fb['foco'], fb['comunicacao'], fb['lideranca']
                matematica, fisica, programacao, desenho, portugues, biologia, quimica, historia = fb['matematica'], fb['fisica'], fb['programacao'], fb['desenho'], fb['portugues'], fb['biologia'], fb['quimica'], fb['historia']
            
            xp_bonus = instance.xp // 10
            total_sum = (
                min(100, logica + int(xp_bonus * 1.2)) + min(100, criatividade + int(xp_bonus * 0.8)) + min(100, foco + int(xp_bonus * 1.1)) +
                min(100, comunicacao + int(xp_bonus * 0.9)) + min(100, lideranca + int(xp_bonus * 1.0)) +
                min(100, matematica + int(xp_bonus * 1.1)) + min(100, fisica + int(xp_bonus * 1.0)) + min(100, programacao + int(xp_bonus * 1.2)) +
                min(100, desenho + int(xp_bonus * 0.8)) + min(100, portugues + int(xp_bonus * 0.9)) + min(100, biologia + int(xp_bonus * 0.7)) +
                min(100, quimica + int(xp_bonus * 0.7)) + min(100, historia + int(xp_bonus * 0.8))
            )
            progresso_geral = round(total_sum / 13)
            
            if progresso_geral >= 100:
                nivel_num = 5
            elif progresso_geral >= 80:
                nivel_num = 4
            elif progresso_geral >= 60:
                nivel_num = 3
            elif progresso_geral >= 40:
                nivel_num = 2
            elif progresso_geral >= 20:
                nivel_num = 1
            else:
                nivel_num = 0
                
            if instance.nivel != nivel_num:
                instance.nivel = nivel_num
                instance.save(update_fields=['nivel'])
                
        return instance

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
    free_text_motivation = serializers.CharField(max_length=500, required=False, allow_blank=True, default="")
    free_text_daily_life = serializers.CharField(max_length=500, required=False, allow_blank=True, default="")
    free_text_dislikes = serializers.CharField(max_length=500, required=False, allow_blank=True, default="")

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
        free_motivation = self.validated_data.get('free_text_motivation', '')
        free_daily_life = self.validated_data.get('free_text_daily_life', '')
        free_dislikes = self.validated_data.get('free_text_dislikes', '')
        
        created_objects = []
        
        with transaction.atomic():
            # Update user free text fields and objetivo_carreira based on Question 1 selection
            user.free_text_motivation = free_motivation
            user.free_text_daily_life = free_daily_life
            user.free_text_dislikes = free_dislikes
            
            # Map question 1 selection to objective
            for item in respostas_data:
                if item['pergunta_id'] == 1:
                    opcao = Opcao.objects.filter(pergunta_id=1, chave=item['opcao_chave']).first()
                    if opcao:
                        user.objetivo_carreira = opcao.label
                    break
            
            user.save()

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

        # Trigger deterministic calculations and persist results
        from .compatibility_service import calcular_e_persistir_matches
        try:
            calcular_e_persistir_matches(user)
        except Exception as e:
            print(f"Error calculating matches: {e}")
                
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
    scoreTecnico = serializers.SerializerMethodField()
    scoreComportamental = serializers.SerializerMethodField()
    scorePragmatico = serializers.SerializerMethodField()
    explicacoes = serializers.SerializerMethodField()
    confianca = serializers.SerializerMethodField()
    trilha = serializers.SerializerMethodField()
    explicacaoIa = serializers.SerializerMethodField()

    class Meta:
        model = Curso
        fields = [
            'id', 'nome', 'tipo', 'duracao', 'descricao', 'tags',
            'icone', 'corIcone', 'corFundo', 'match', 'tipoMatch',
            'scoreTecnico', 'scoreComportamental', 'scorePragmatico',
            'explicacoes', 'confianca', 'trilha', 'explicacaoIa'
        ]

    def _get_detailed_match(self, obj):
        # Cache results by course ID
        if not hasattr(self, '_detailed_match_cache'):
            self._detailed_match_cache = {}
            
        if obj.id in self._detailed_match_cache:
            return self._detailed_match_cache[obj.id]
            
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            result = {
                'match': obj.match_percent,
                'score_tecnico': obj.match_percent,
                'score_comportamental': obj.match_percent,
                'score_pragmatico': obj.match_percent,
                'explicacoes': ["Sem informações de perfil suficientes."],
                'confianca': "RESULTADO IMPRECISO",
                'trilha': "Novos Horizontes",
                'explicacao_ia': ""
            }
            self._detailed_match_cache[obj.id] = result
            return result

        try:
            user = request.user
            from .models import CursoMatch
            from .compatibility_service import calcular_e_persistir_matches, calcular_confianca_questionario

            match_obj = CursoMatch.objects.filter(user=user, curso=obj).first()
            if not match_obj:
                # Calculate if not present
                calcular_e_persistir_matches(user)
                match_obj = CursoMatch.objects.filter(user=user, curso=obj).first()

            if match_obj:
                explicacoes = []
                sub = match_obj.sub_scores
                
                # Check for positive alignments
                if sub.get('eixo_analitico_criativo', 50) > 65:
                    explicacoes.append("Seu raciocínio lógico e analítico se alinham com a grade científica deste curso.")
                elif sub.get('maturidade_pratica', 50) > 65:
                    explicacoes.append("Sua bagagem e vivência de atividades práticas dão excelente suporte técnico de partida.")
                elif sub.get('eixo_lideranca_tecnico', 50) > 65:
                    explicacoes.append("Sua facilidade de liderança e comunicação é muito valorizada nesta área.")
                else:
                    explicacoes.append("A grade deste curso se encaixa com as habilidades gerais mapeadas no seu questionário.")

                # Warnings / outliers
                has_outlier = (
                    sub.get('eixo_analitico_criativo', 50) < 25 or
                    sub.get('eixo_lideranca_tecnico', 50) < 25 or
                    sub.get('eixo_pratica_teoria', 50) < 25 or
                    sub.get('eixo_rotina_autonomia', 50) < 25
                )
                if has_outlier:
                    explicacoes.append("Atenção: Identificamos um forte choque de perfil comportamental com a rotina de trabalho desta carreira.")
                elif sub.get('disciplinas_fit', 50) < 45:
                    explicacoes.append("Atenção: A grade curricular do curso exige matérias em que você demonstrou menor afinidade.")
                elif sub.get('fit_duracao', 50) < 80:
                    explicacoes.append("Atenção: A duração mais longa do bacharelado pode ser um fator limitante para inserção rápida no mercado.")

                result = {
                    'match': match_obj.score_final,
                    'score_tecnico': match_obj.score_tecnico,
                    'score_comportamental': match_obj.score_comportamental,
                    'score_pragmatico': match_obj.score_pragmatico,
                    'explicacoes': explicacoes[:2],
                    'confianca': calcular_confianca_questionario(user),
                    'trilha': sub.get('trilha', 'Novos Horizontes'),
                    'explicacao_ia': match_obj.explicacao or ""
                }
            else:
                result = {
                    'match': obj.match_percent,
                    'score_tecnico': obj.match_percent,
                    'score_comportamental': obj.match_percent,
                    'score_pragmatico': obj.match_percent,
                    'explicacoes': ["Erro ao carregar compatibilidade."],
                    'confianca': "RESULTADO IMPRECISO",
                    'trilha': "Novos Horizontes",
                    'explicacao_ia': ""
                }
            
            self._detailed_match_cache[obj.id] = result
            return result
        except Exception as e:
            print("Error in cached _get_detailed_match:", e)
            result = {
                'match': obj.match_percent,
                'score_tecnico': obj.match_percent,
                'score_comportamental': obj.match_percent,
                'score_pragmatico': obj.match_percent,
                'explicacoes': ["Erro ao calcular detalhes de match."],
                'confianca': "RESULTADO IMPRECISO",
                'trilha': "Novos Horizontes",
                'explicacao_ia': ""
            }
            self._detailed_match_cache[obj.id] = result
            return result

    def get_match(self, obj):
        res = self._get_detailed_match(obj)
        return res['match']

    def get_tipoMatch(self, obj):
        match_val = self.get_match(obj)
        if match_val >= 80:
            return 'MATCH ALTO'
        elif match_val >= 50:
            return 'MATCH BOM'
        else:
            return 'MATCH REGULAR'

    def get_scoreTecnico(self, obj):
        res = self._get_detailed_match(obj)
        return res['score_tecnico']

    def get_scoreComportamental(self, obj):
        res = self._get_detailed_match(obj)
        return res['score_comportamental']

    def get_scorePragmatico(self, obj):
        res = self._get_detailed_match(obj)
        return res['score_pragmatico']

    def get_explicacoes(self, obj):
        res = self._get_detailed_match(obj)
        return res['explicacoes']

    def get_confianca(self, obj):
        res = self._get_detailed_match(obj)
        return res['confianca']

    def get_trilha(self, obj):
        res = self._get_detailed_match(obj)
        return res['trilha']

    def get_explicacaoIa(self, obj):
        res = self._get_detailed_match(obj)
        return res['explicacao_ia']

