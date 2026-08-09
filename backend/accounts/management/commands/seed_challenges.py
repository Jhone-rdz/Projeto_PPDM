from django.core.management.base import BaseCommand
from accounts.models import Desafio


class Command(BaseCommand):
    help = 'Populates the database with the default daily challenges for NexoCareer.'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding daily challenges...')

        challenges = [
            {
                'titulo': 'Falar com a IA Nexo',
                'descricao': 'Tire uma dúvida sobre sua carreira ideal com o mentor inteligente.',
                'xp': 20,
                'icone': 'chatbubble-ellipses-outline',
                'cor_icone': '#8B5CF6',
                'action_text': 'Abrir Chat',
                'route_target': '/(tabs)/chat',
            },
            {
                'titulo': 'Explore Tecnologia',
                'descricao': 'Visualize os detalhes de pelo menos 2 cursos da área de TI.',
                'xp': 30,
                'icone': 'school-outline',
                'cor_icone': '#00D4FF',
                'action_text': 'Ir para Cursos',
                'route_target': '/(tabs)/carreiras',
            },
            {
                'titulo': 'Evolua seu Perfil',
                'descricao': 'Responda à questão diária de aptidão para impulsionar suas forças.',
                'xp': 25,
                'icone': 'hardware-chip-outline',
                'cor_icone': '#EC4899',
                'action_text': 'Evoluir Perfil',
                'route_target': '/(tabs)/',
            },
        ]

        created_count = 0
        for data in challenges:
            desafio, created = Desafio.objects.get_or_create(
                titulo=data['titulo'],
                defaults=data,
            )
            if created:
                created_count += 1
                self.stdout.write(self.style.SUCCESS(f"  [+] Created: {desafio}"))
            else:
                self.stdout.write(f"  [~] Already exists: {desafio}")

        self.stdout.write(self.style.SUCCESS(
            f'\nDone! {created_count} new challenge(s) created, {len(challenges) - created_count} already existed.'
        ))
