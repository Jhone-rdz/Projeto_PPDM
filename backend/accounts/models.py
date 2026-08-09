from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    curso_tecnico = models.CharField(
        max_length=150, 
        blank=True, 
        null=True,
        verbose_name="Curso Técnico Atual"
    )
    nivel = models.IntegerField(default=1, verbose_name="Nível")
    xp = models.IntegerField(default=0, verbose_name="Experiência (XP)")

    def __str__(self):
        return f"{self.username} (Nível {self.nivel})"
