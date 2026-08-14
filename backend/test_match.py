import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from accounts.models import Curso
from accounts.serializers import CursoComMatchSerializer
from rest_framework.request import Request
from rest_framework.test import APIRequestFactory

User = get_user_model()
user = User.objects.first()

if user:
    print(f"User: {user.username}")
    print(f"Curso Técnico: {user.curso_tecnico}")
    print(f"XP: {user.xp}")
    
    # Create a mock request with the user authenticated
    factory = APIRequestFactory()
    request = factory.get('/')
    request.user = user
    
    print("\nCalculated Matches using Serializer:")
    serializer = CursoComMatchSerializer(Curso.objects.all()[:15], many=True, context={'request': request})
    for item in serializer.data:
        print(f"  {item['nome']}: match={item['match']}, tipoMatch={item['tipoMatch']}")
else:
    print("Nenhum usuário encontrado.")
