from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .serializers import RegisterSerializer, CustomUserSerializer
from rest_framework_simplejwt.tokens import RefreshToken

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
    elif "agropecuária" in curso or "agro" in curso or "agronomia" in curso or "campo" in curso or "pecuária" in curso:
        return {
            'logica': 50, 'criatividade': 45, 'foco': 65, 'comunicacao': 45, 'lideranca': 50,
            'matematica': 45, 'fisica': 40, 'programacao': 30, 'desenho': 35, 'portugues': 45,
            'biologia': 75, 'quimica': 70, 'historia': 40
        }
    else:
        # Balanced general default
        return {
            'logica': 50, 'criatividade': 50, 'foco': 50, 'comunicacao': 50, 'lideranca': 50,
            'matematica': 45, 'fisica': 40, 'programacao': 40, 'desenho': 40, 'portugues': 50,
            'biologia': 35, 'quimica': 35, 'historia': 45
        }

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Automatically generate tokens for the registered user
        refresh = RefreshToken.for_user(user)
        user_serializer = CustomUserSerializer(user)
        
        return Response({
            "user": user_serializer.data,
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "message": "Cadastro realizado com sucesso!"
        }, status=status.HTTP_201_CREATED)

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = CustomUserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        user = self.request.user
        from datetime import date
        today = date.today()
        
        if user.ultimo_login_dia is None:
            user.ultimo_login_dia = today
            user.streak = 1
            user.save(update_fields=['ultimo_login_dia', 'streak'])
        else:
            diff = today - user.ultimo_login_dia
            if diff.days == 1:
                user.streak += 1
                user.ultimo_login_dia = today
                user.save(update_fields=['ultimo_login_dia', 'streak'])
            elif diff.days > 1:
                user.streak = 1
                user.ultimo_login_dia = today
                user.save(update_fields=['ultimo_login_dia', 'streak'])
                
        return user

from .models import Pergunta
from .serializers import PerguntaSerializer, RespostaQuestionarioSerializer

class ListarPerguntasView(generics.ListAPIView):
    queryset = Pergunta.objects.all().order_by('id')
    serializer_class = PerguntaSerializer
    permission_classes = [permissions.IsAuthenticated]

class SalvarRespostasView(generics.GenericAPIView):
    serializer_class = RespostaQuestionarioSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)

        # Add +50 XP bonus for completing onboarding
        user = request.user
        user.xp += 50
        user.save()

        user_serializer = CustomUserSerializer(user)

        return Response({
            "user": user_serializer.data,
            "message": "Respostas do questionário salvas e bônus de +50 XP concedido!"
        }, status=status.HTTP_200_OK)

from django.db.models import Q
from django.db import transaction
from .models import Curso, PerfilUsuario, Pergunta, Opcao, RespostaUsuario
from .serializers import CursoComMatchSerializer

def calcular_perfil_usuario(respostas_dict):
    totais = {
        'logica': 0, 'criatividade': 0, 'foco': 0, 'comunicacao': 0, 'lideranca': 0,
        'matematica': 0, 'fisica': 0, 'programacao': 0, 'desenho': 0, 'portugues': 0,
        'biologia': 0, 'quimica': 0, 'historia': 0,
        'tecnologia': 0, 'saude': 0, 'negocios': 0, 'artes': 0, 'direito': 0, 'agronomia': 0
    }
    
    for p_id, o_chave in respostas_dict.items():
        try:
            p_id = int(p_id)
            opcao = Opcao.objects.filter(pergunta_id=p_id, chave=o_chave).first()
            if opcao and opcao.peso:
                for key, val in opcao.peso.items():
                    if key in totais:
                        totais[key] += val
        except ValueError:
            pass

    max_forcas = 15
    max_disciplinas = 12
    max_areas = 9

    return {
        'forcas': {
            'logica': min(100, round((totais['logica'] / max_forcas) * 100)),
            'criatividade': min(100, round((totais['criatividade'] / max_forcas) * 100)),
            'foco': min(100, round((totais['foco'] / max_forcas) * 100)),
            'comunicacao': min(100, round((totais['comunicacao'] / max_forcas) * 100)),
            'lideranca': min(100, round((totais['lideranca'] / max_forcas) * 100)),
        },
        'disciplinas': {
            'matematica': min(100, round((totais['matematica'] / max_disciplinas) * 100)),
            'fisica': min(100, round((totais['fisica'] / max_disciplinas) * 100)),
            'programacao': min(100, round((totais['programacao'] / max_disciplinas) * 100)),
            'desenho': min(100, round((totais['desenho'] / max_disciplinas) * 100)),
            'portugues': min(100, round((totais['portugues'] / max_disciplinas) * 100)),
            'biologia': min(100, round((totais['biologia'] / max_disciplinas) * 100)),
            'quimica': min(100, round((totais['quimica'] / max_disciplinas) * 100)),
            'historia': min(100, round((totais['historia'] / max_disciplinas) * 100)),
        },
        'areas': {
            'tecnologia': min(100, round((totais['tecnologia'] / max_areas) * 100)),
            'saude': min(100, round((totais['saude'] / max_areas) * 100)),
            'negocios': min(100, round((totais['negocios'] / max_areas) * 100)),
            'artes': min(100, round((totais['artes'] / max_areas) * 100)),
            'direito': min(100, round((totais['direito'] / max_areas) * 100)),
            'agronomia': min(100, round((totais['agronomia'] / max_areas) * 100)),
        }
    }

class CursoListView(generics.ListAPIView):
    serializer_class = CursoComMatchSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Curso.objects.all()
        area = self.request.query_params.get('area', None)
        busca = self.request.query_params.get('busca', None)
        
        if area:
            queryset = queryset.filter(area__iexact=area.strip())
            
        if busca:
            queryset = queryset.filter(
                Q(nome__icontains=busca) | 
                Q(descricao__icontains=busca) |
                Q(tags_raw__icontains=busca)
            )
            
        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        data = serializer.data
        
        # Sort by match descending in Python
        data.sort(key=lambda x: x.get('match', 0), reverse=True)
        
        # Limit if query param present
        limite = request.query_params.get('limite', None)
        if limite:
            try:
                limite = int(limite)
                data = data[:limite]
            except ValueError:
                pass
                
        return Response(data)

from rest_framework.views import APIView

class RespostasQuestionarioView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        from .serializers import RespostaQuestionarioSerializer
        serializer = RespostaQuestionarioSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)

        # Build dictionary for profile calculation
        respostas_data = request.data.get('respostas', [])
        respostas_dict = {str(item['pergunta_id']): item['opcao_chave'] for item in respostas_data}

        # Re-calculate profile weights
        profile_data = calcular_perfil_usuario(respostas_dict)
        
        # Save or update PerfilUsuario
        perfil, created = PerfilUsuario.objects.update_or_create(
            user=request.user,
            defaults={
                'logica': profile_data['forcas']['logica'],
                'criatividade': profile_data['forcas']['criatividade'],
                'foco': profile_data['forcas']['foco'],
                'comunicacao': profile_data['forcas']['comunicacao'],
                'lideranca': profile_data['forcas']['lideranca'],
                
                'matematica': profile_data['disciplinas']['matematica'],
                'fisica': profile_data['disciplinas']['fisica'],
                'programacao': profile_data['disciplinas']['programacao'],
                'desenho': profile_data['disciplinas']['desenho'],
                'portugues': profile_data['disciplinas']['portugues'],
                'biologia': profile_data['disciplinas']['biologia'],
                'quimica': profile_data['disciplinas']['quimica'],
                'historia': profile_data['disciplinas']['historia'],
                
                'tecnologia': profile_data['areas']['tecnologia'],
                'saude': profile_data['areas']['saude'],
                'negocios': profile_data['areas']['negocios'],
                'artes': profile_data['areas']['artes'],
                'direito': profile_data['areas']['direito'],
                'agronomia': profile_data['areas']['agronomia'],
            }
        )

        return Response(profile_data, status=status.HTTP_200_OK)

    def get(self, request, *args, **kwargs):
        user = request.user
        answers = RespostaUsuario.objects.filter(user=user).select_related('pergunta', 'opcao')
        if not answers.exists():
            return Response({"detail": "O usuário ainda não respondeu ao questionário."}, status=status.HTTP_404_NOT_FOUND)

        # Build responses dict like { "1": "a", "2": "b" }
        respostas_dict = {str(ans.pergunta.id): ans.opcao.chave for ans in answers}
        
        # Calculate/retrieve calculated profile
        profile_data = calcular_perfil_usuario(respostas_dict)

        return Response({
            "respostas": respostas_dict,
            "perfil": profile_data
        }, status=status.HTTP_200_OK)

class PerfilView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        
        try:
            perfil = user.perfil
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
            fb = get_fallback_profile(user.curso_tecnico)
            logica, criatividade, foco, comunicacao, lideranca = fb['logica'], fb['criatividade'], fb['foco'], fb['comunicacao'], fb['lideranca']
            matematica, fisica, programacao, desenho, portugues, biologia, quimica, historia = fb['matematica'], fb['fisica'], fb['programacao'], fb['desenho'], fb['portugues'], fb['biologia'], fb['quimica'], fb['historia']

        # Apply XP bonus (1% per 10 XP)
        xp_bonus = user.xp // 10
        logica = min(100, logica + int(xp_bonus * 1.2))
        criatividade = min(100, criatividade + int(xp_bonus * 0.8))
        foco = min(100, foco + int(xp_bonus * 1.1))
        comunicacao = min(100, comunicacao + int(xp_bonus * 0.9))
        lideranca = min(100, lideranca + int(xp_bonus * 1.0))

        matematica = min(100, matematica + int(xp_bonus * 1.1))
        fisica = min(100, fisica + int(xp_bonus * 1.0))
        programacao = min(100, programacao + int(xp_bonus * 1.2))
        desenho = min(100, desenho + int(xp_bonus * 0.8))
        portugues = min(100, portugues + int(xp_bonus * 0.9))
        biologia = min(100, biologia + int(xp_bonus * 0.7))
        quimica = min(100, quimica + int(xp_bonus * 0.7))
        historia = min(100, historia + int(xp_bonus * 0.8))

        total_sum = (
            logica + criatividade + foco + comunicacao + lideranca +
            matematica + fisica + programacao + desenho + portugues + biologia + quimica + historia
        )
        progresso_geral = round(total_sum / 13)

        if progresso_geral >= 100:
            nivel_num = 5
            nivel_nome = "Além do Limite"
            nivel_progresso = 100
        elif progresso_geral >= 80:
            nivel_num = 4
            nivel_nome = "Super Nexo Blue"
            nivel_progresso = int((progresso_geral - 80) / 20 * 100)
        elif progresso_geral >= 60:
            nivel_num = 3
            nivel_nome = "Super Nexo 2"
            nivel_progresso = int((progresso_geral - 60) / 20 * 100)
        elif progresso_geral >= 40:
            nivel_num = 2
            nivel_nome = "Super Nexo 1"
            nivel_progresso = int((progresso_geral - 40) / 20 * 100)
        elif progresso_geral >= 20:
            nivel_num = 1
            nivel_nome = "Despertado"
            nivel_progresso = int((progresso_geral - 20) / 20 * 100)
        else:
            nivel_num = 0
            nivel_nome = "Iniciante"
            nivel_progresso = int(progresso_geral / 20 * 100)

        # Sync user level
        if user.nivel != nivel_num:
            user.nivel = nivel_num
            user.save(update_fields=['nivel'])

        return Response({
            "nome": user.username,
            "email": user.email,
            "curso_tecnico": user.curso_tecnico or "",
            "nivel": {
                "numero": nivel_num,
                "nome": nivel_nome,
                "progresso": nivel_progresso
            },
            "forcas": {
                "logica": logica,
                "criatividade": criatividade,
                "foco": foco,
                "comunicacao": comunicacao,
                "lideranca": lideranca
            },
            "disciplinas": {
                "matematica": matematica,
                "fisica": fisica,
                "programacao": programacao,
                "desenho": desenho,
                "portugues": portugues,
                "biologia": biologia,
                "quimica": quimica,
                "historia": historia
            },
            "progresso_geral": progresso_geral
        }, status=status.HTTP_200_OK)


from rest_framework.views import APIView
from .ai_service import get_ai_response
from datetime import datetime

class ChatView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        mensagem = request.data.get('mensagem', '').strip()
        if not mensagem:
            return Response({"detail": "A mensagem não pode estar vazia."}, status=status.HTTP_400_BAD_REQUEST)

        user = request.user
        curso_tecnico = user.curso_tecnico or ""

        # Query Gemini or fallback
        resposta = get_ai_response(mensagem, curso_tecnico)
        horario = datetime.now().strftime('%H:%M')

        return Response({
            "resposta": resposta,
            "horario": horario
        }, status=status.HTTP_200_OK)


from .models import Desafio, DesafioConcluido
from .serializers import DesafioSerializer
from datetime import date


class ListarDesafiosView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = DesafioSerializer

    def get_queryset(self):
        return Desafio.objects.all().order_by('id')

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


class ConcluirDesafioView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk, *args, **kwargs):
        try:
            desafio = Desafio.objects.get(pk=pk)
        except Desafio.DoesNotExist:
            return Response({"detail": "Desafio não encontrado."}, status=status.HTTP_404_NOT_FOUND)

        user = request.user
        today = date.today()

        # Prevent double-claiming on same day
        already_done = DesafioConcluido.objects.filter(
            user=user, desafio=desafio, concluido_em=today
        ).exists()

        if already_done:
            from django.db.models import Sum
            total_xp_hoje = DesafioConcluido.objects.filter(
                user=user, concluido_em=today
            ).aggregate(total=Sum('desafio__xp'))['total'] or 0
            return Response({
                "detail": "Você já concluiu esse desafio hoje!",
                "xp": user.xp,
                "nivel": user.nivel,
                "level_up": False,
                "xp_hoje": total_xp_hoje,
            }, status=status.HTTP_200_OK)

        # Register completion
        DesafioConcluido.objects.create(user=user, desafio=desafio)

        # Award XP
        nivel_anterior = user.nivel
        user.xp += desafio.xp

        # Calculate new level based on forces + disciplines average including the updated XP bonus
        try:
            perfil = user.perfil
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
            fb = get_fallback_profile(user.curso_tecnico)
            logica, criatividade, foco, comunicacao, lideranca = fb['logica'], fb['criatividade'], fb['foco'], fb['comunicacao'], fb['lideranca']
            matematica, fisica, programacao, desenho, portugues, biologia, quimica, historia = fb['matematica'], fb['fisica'], fb['programacao'], fb['desenho'], fb['portugues'], fb['biologia'], fb['quimica'], fb['historia']

        xp_bonus = user.xp // 10
        total_sum = (
            min(100, logica + int(xp_bonus * 1.2)) + min(100, criatividade + int(xp_bonus * 0.8)) + min(100, foco + int(xp_bonus * 1.1)) +
            min(100, comunicacao + int(xp_bonus * 0.9)) + min(100, lideranca + int(xp_bonus * 1.0)) +
            min(100, matematica + int(xp_bonus * 1.1)) + min(100, fisica + int(xp_bonus * 1.0)) + min(100, programacao + int(xp_bonus * 1.2)) +
            min(100, desenho + int(xp_bonus * 0.8)) + min(100, portugues + int(xp_bonus * 0.9)) + min(100, biologia + int(xp_bonus * 0.7)) +
            min(100, quimica + int(xp_bonus * 0.7)) + min(100, historia + int(xp_bonus * 0.8))
        )
        progresso_geral = round(total_sum / 13)

        if progresso_geral >= 100:
            novo_nivel = 5
        elif progresso_geral >= 80:
            novo_nivel = 4
        elif progresso_geral >= 60:
            novo_nivel = 3
        elif progresso_geral >= 40:
            novo_nivel = 2
        elif progresso_geral >= 20:
            novo_nivel = 1
        else:
            novo_nivel = 0

        user.nivel = novo_nivel
        user.save()

        level_up = novo_nivel > nivel_anterior

        # Get xp_hoje
        from django.db.models import Sum
        total_xp_hoje = DesafioConcluido.objects.filter(
            user=user, concluido_em=today
        ).aggregate(total=Sum('desafio__xp'))['total'] or 0

        return Response({
            "detail": f"Desafio concluído! +{desafio.xp} XP",
            "xp": user.xp,
            "nivel": user.nivel,
            "level_up": level_up,
            "xp_hoje": total_xp_hoje,
        }, status=status.HTTP_200_OK)

class ResetProgressView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        
        # 1. Clear all question responses
        user.respostas.all().delete()
        
        # 2. Reset user stats
        user.xp = 0
        user.nivel = 0
        user.save(update_fields=['xp', 'nivel'])
        
        # 3. Clear user profile
        from .models import PerfilUsuario
        PerfilUsuario.objects.filter(user=user).delete()
        
        # 4. Clear completed challenges
        from .models import DesafioConcluido
        DesafioConcluido.objects.filter(user=user).delete()
        
        return Response({
            "detail": "Progresso redefinido com sucesso! Você será redirecionado para o onboarding."
        }, status=status.HTTP_200_OK)

