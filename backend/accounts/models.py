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
    objetivo_carreira = models.CharField(
        max_length=150,
        default="Tecnologia",
        blank=True,
        null=True,
        verbose_name="Objetivo de Carreira"
    )
    ultimo_login_dia = models.DateField(
        null=True,
        blank=True,
        verbose_name="Último login no dia"
    )
    streak = models.IntegerField(
        default=1,
        verbose_name="Sequência de dias logado"
    )
    
    # Novos campos de texto livre do questionário
    free_text_motivation = models.TextField(
        max_length=500,
        blank=True,
        null=True,
        verbose_name="Motivação Profissional"
    )
    free_text_daily_life = models.TextField(
        max_length=500,
        blank=True,
        null=True,
        verbose_name="Dia de Trabalho Ideal"
    )
    free_text_dislikes = models.TextField(
        max_length=500,
        blank=True,
        null=True,
        verbose_name="O que não deseja no trabalho"
    )

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
    cor_icone = models.CharField(max_length=20, default="#8B5CF6", verbose_name="Cor do Ícone")
    label = models.CharField(max_length=200, verbose_name="Rótulo")
    descricao = models.CharField(max_length=300, verbose_name="Descrição")
    peso = models.JSONField(default=dict, blank=True, verbose_name="Peso")

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
        ('artes', 'Artes'),
        ('direito', 'Direito'),
        ('agronomia', 'Agronomia'),
    ]
    
    nome = models.CharField(max_length=200, verbose_name="Nome do Curso")
    tipo = models.CharField(max_length=100, verbose_name="Tipo (e.g. Bacharelado, Tecnólogo)")
    duracao = models.CharField(max_length=50, verbose_name="Duração (e.g. 4 anos)")
    descricao = models.TextField(verbose_name="Descrição")
    area = models.CharField(max_length=30, choices=AREA_CHOICES, default='tecnologia', verbose_name="Área do Curso")
    
    # Tags stored as a comma-separated string
    tags_raw = models.CharField(max_length=500, verbose_name="Tags (separadas por vírgula)")
    
    match_percent = models.IntegerField(default=85, verbose_name="Percentual de Match")
    icone = models.CharField(max_length=100, default='school-outline', verbose_name="Ícone Ionicons")
    cor_icone = models.CharField(max_length=20, default='#6B21A8', verbose_name="Cor do Ícone")
    cor_fundo = models.CharField(max_length=20, default='#111827', verbose_name="Cor de Fundo da Caixa de Ícone")
    
    # Store description vector embedding (precalculated once)
    embedding = models.JSONField(blank=True, null=True, verbose_name="Embedding da Descrição")

    @property
    def tags(self):
        return [t.strip() for t in self.tags_raw.split(',') if t.strip()]

    def __str__(self):
        return f"[{self.get_area_display()}] {self.nome}"


class CursoMatch(models.Model):
    user = models.ForeignKey('CustomUser', on_delete=models.CASCADE, related_name='curso_matches', verbose_name="Usuário")
    curso = models.ForeignKey(Curso, on_delete=models.CASCADE, related_name='user_matches', verbose_name="Curso")
    
    score_final = models.IntegerField(default=0, verbose_name="Score Final")
    score_tecnico = models.IntegerField(default=0, verbose_name="Score Técnico")
    score_comportamental = models.IntegerField(default=0, verbose_name="Score Comportamental")
    score_pragmatico = models.IntegerField(default=0, verbose_name="Score Pragmático")
    
    # Stores detailed sub-scores (MEC, disciplines, etc.) as JSON
    sub_scores = models.JSONField(default=dict, verbose_name="Sub-scores Detalhados")
    
    # AI Explainability fields
    explicacao = models.TextField(blank=True, null=True, verbose_name="Explicabilidade da IA")
    explicacao_status = models.CharField(
        max_length=20,
        choices=[('pending', 'Pendente'), ('completed', 'Concluído'), ('failed', 'Falhou')],
        default='pending',
        verbose_name="Status da Explicabilidade"
    )
    
    created_at = models.DateTimeField(auto_now=True, verbose_name="Calculado em")

    class Meta:
        verbose_name = "Match de Curso"
        verbose_name_plural = "Matches de Cursos"
        unique_together = ('user', 'curso')

    def __str__(self):
        return f"{self.user.username} - {self.curso.nome} ({self.score_final}%)"


class Desafio(models.Model):
    titulo = models.CharField(max_length=150, verbose_name="Título")
    descricao = models.TextField(verbose_name="Descrição")
    xp = models.IntegerField(verbose_name="XP Bônus")
    icone = models.CharField(max_length=100, verbose_name="Ícone Ionicons")
    cor_icone = models.CharField(max_length=20, verbose_name="Cor do Ícone")
    action_text = models.CharField(max_length=100, blank=True, null=True, verbose_name="Texto do Botão de Ação")
    route_target = models.CharField(max_length=100, blank=True, null=True, verbose_name="Rota Alvo Interna")

    class Meta:
        verbose_name = "Desafio"
        verbose_name_plural = "Desafios"

    def __str__(self):
        return f"{self.titulo} (+{self.xp} XP)"


class DesafioConcluido(models.Model):
    user = models.ForeignKey('CustomUser', on_delete=models.CASCADE, related_name='desafios_concluidos', verbose_name="Usuário")
    desafio = models.ForeignKey(Desafio, on_delete=models.CASCADE, verbose_name="Desafio")
    concluido_em = models.DateField(auto_now_add=True, verbose_name="Concluído Em")

    class Meta:
        verbose_name = "Desafio Concluído"
        verbose_name_plural = "Desafios Concluídos"
        unique_together = ('user', 'desafio', 'concluido_em')

    def __str__(self):
        return f"{self.user.username} - {self.desafio.titulo} ({self.concluido_em})"


class PerfilUsuario(models.Model):
    user = models.OneToOneField('CustomUser', on_delete=models.CASCADE, related_name='perfil', verbose_name="Usuário")
    
    # Forças
    logica = models.IntegerField(default=0, verbose_name="Lógica")
    criatividade = models.IntegerField(default=0, verbose_name="Criatividade")
    foco = models.IntegerField(default=0, verbose_name="Foco")
    comunicacao = models.IntegerField(default=0, verbose_name="Comunicação")
    lideranca = models.IntegerField(default=0, verbose_name="Liderança")
    
    # Disciplinas
    matematica = models.IntegerField(default=0, verbose_name="Matemática")
    fisica = models.IntegerField(default=0, verbose_name="Física")
    programacao = models.IntegerField(default=0, verbose_name="Programação")
    desenho = models.IntegerField(default=0, verbose_name="Desenho")
    portugues = models.IntegerField(default=0, verbose_name="Português")
    biologia = models.IntegerField(default=0, verbose_name="Biologia")
    quimica = models.IntegerField(default=0, verbose_name="Química")
    historia = models.IntegerField(default=0, verbose_name="História")
    
    # Áreas
    tecnologia = models.IntegerField(default=0, verbose_name="Tecnologia")
    saude = models.IntegerField(default=0, verbose_name="Saúde")
    negocios = models.IntegerField(default=0, verbose_name="Negócios")
    artes = models.IntegerField(default=0, verbose_name="Artes")
    direito = models.IntegerField(default=0, verbose_name="Direito")
    agronomia = models.IntegerField(default=0, verbose_name="Agronomia")

    class Meta:
        verbose_name = "Perfil de Usuário"
        verbose_name_plural = "Perfis de Usuários"

    def __str__(self):
        return f"Perfil de {self.user.username}"

