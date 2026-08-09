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
        return self.request.user

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
