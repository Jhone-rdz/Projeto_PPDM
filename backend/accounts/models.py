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

class Pergunta(models.Model):
    categoria = models.CharField(max_length=100, verbose_name="Categoria")
    icone_categoria = models.CharField(max_length=100, verbose_name="Ícone da Categoria")
    pergunta = models.TextField(verbose_name="Pergunta")
    instrucao = models.CharField(max_length=150, default="Escolha apenas uma opção.", verbose_name="Instrução")

    def __str__(self):
        return f"[{self.categoria}] {self.pergunta[:40]}"

class Opcao(models.Model):
    pergunta = models.ForeignKey(Pergunta, on_delete=models.CASCADE, related_name='opcoes', verbose_name="Pergunta")
    chave = models.CharField(max_length=2, verbose_name="Chave (a, b, c...)")
    icone = models.CharField(max_length=100, verbose_name="Ícone")
    cor_icone = models.CharField(max_length=20, verbose_name="Cor do Ícone")
    label = models.CharField(max_length=150, verbose_name="Label")
    descricao = models.TextField(verbose_name="Descrição")

    class Meta:
        verbose_name = "Opção"
        verbose_name_plural = "Opções"
        unique_together = ('pergunta', 'chave')

    def __str__(self):
        return f"{self.pergunta.id}{self.chave} - {self.label}"

class RespostaUsuario(models.Model):
    user = models.ForeignKey('CustomUser', on_delete=models.CASCADE, related_name='respostas', verbose_name="Usuário")
    pergunta = models.ForeignKey(Pergunta, on_delete=models.CASCADE, verbose_name="Pergunta")
    opcao = models.ForeignKey(Opcao, on_delete=models.CASCADE, verbose_name="Opção Selecionada")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Criado em")

    class Meta:
        verbose_name = "Resposta de Usuário"
        verbose_name_plural = "Respostas de Usuários"
        unique_together = ('user', 'pergunta')

    def __str__(self):
        return f"{self.user.username} - P{self.pergunta.id}: {self.opcao.chave}"

class Curso(models.Model):
    AREA_CHOICES = [
        ('tecnologia', 'Tecnologia'),
        ('saude', 'Saúde'),
        ('negocios', 'Negócios'),
    ]
    
    nome = models.CharField(max_length=200, verbose_name="Nome do Curso")
    tipo = models.CharField(max_length=100, verbose_name="Tipo (e.g. Bacharelado, Tecnólogo)")
    duracao = models.CharField(max_length=50, verbose_name="Duração (e.g. 4 anos)")
    descricao = models.TextField(verbose_name="Descrição")
    area = models.CharField(max_length=20, choices=AREA_CHOICES, default='tecnologia', verbose_name="Área do Curso")
    
    # Tags stored as a comma-separated string
    tags_raw = models.CharField(max_length=500, verbose_name="Tags (separadas por vírgula)")
    
    match_percent = models.IntegerField(default=85, verbose_name="Percentual de Match")
    icone = models.CharField(max_length=100, default='school-outline', verbose_name="Ícone Ionicons")
    cor_icone = models.CharField(max_length=20, default='#6B21A8', verbose_name="Cor do Ícone")
    cor_fundo = models.CharField(max_length=20, default='#111827', verbose_name="Cor de Fundo da Caixa de Ícone")

    @property
    def tags(self):
        return [t.strip() for t in self.tags_raw.split(',') if t.strip()]

    def __str__(self):
        return f"[{self.get_area_display()}] {self.nome}"
