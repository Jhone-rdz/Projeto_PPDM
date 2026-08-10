from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .serializers import RegisterSerializer, CustomUserSerializer
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

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
from .models import Curso
from .serializers import CursoSerializer

class CursoListView(generics.ListAPIView):
    serializer_class = CursoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Curso.objects.all().order_by('-match_percent')
        
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

        # Level-up formula: 1 level per 100 XP
        novo_nivel = (user.xp // 100) + 1
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

