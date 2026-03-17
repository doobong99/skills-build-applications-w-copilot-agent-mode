from datetime import timedelta

from django.core.management.base import BaseCommand
from django.utils import timezone

from octofit_tracker.models import Activity, LeaderboardEntry, Team, UserProfile, Workout


class Command(BaseCommand):
    help = 'octofit_db 데이터베이스에 테스트 데이터를 입력합니다.'

    def handle(self, *args, **options):
        Activity.objects.all().delete()
        LeaderboardEntry.objects.all().delete()
        Workout.objects.all().delete()
        UserProfile.objects.all().delete()
        Team.objects.all().delete()

        Team.objects.create(name='marvel team', universe='marvel', motto='Avengers Assemble!')
        Team.objects.create(name='dc team', universe='dc', motto='Justice for all!')

        UserProfile.objects.create(username='Peter Parker', email='spiderman@octofit.com', team_name='marvel team', points=980)
        UserProfile.objects.create(username='Tony Stark', email='ironman@octofit.com', team_name='marvel team', points=1100)
        UserProfile.objects.create(username='Bruce Wayne', email='batman@octofit.com', team_name='dc team', points=1050)
        UserProfile.objects.create(username='Diana Prince', email='wonderwoman@octofit.com', team_name='dc team', points=1020)

        now = timezone.now()

        Activity.objects.create(
            user_email='spiderman@octofit.com',
            activity_type='Wall Climb Sprints',
            distance_km=5.2,
            performed_at=now - timedelta(days=1),
            notes='Rooftop interval training',
        )
        Activity.objects.create(
            user_email='ironman@octofit.com',
            activity_type='Flight Endurance',
            distance_km=18.4,
            performed_at=now - timedelta(hours=12),
            notes='High altitude cardio session',
        )
        Activity.objects.create(
            user_email='batman@octofit.com',
            activity_type='Night Patrol Run',
            distance_km=12.7,
            performed_at=now - timedelta(hours=20),
            notes='City perimeter run',
        )
        Activity.objects.create(
            user_email='wonderwoman@octofit.com',
            activity_type='Amazon Strength Circuit',
            distance_km=6.5,
            performed_at=now - timedelta(hours=6),
            notes='Mixed strength + agility',
        )

        Workout.objects.create(user_email='spiderman@octofit.com', workout_name='Spider Agility', duration_minutes=45, calories_burned=420)
        Workout.objects.create(user_email='ironman@octofit.com', workout_name='Arc Reactor HIIT', duration_minutes=50, calories_burned=510)
        Workout.objects.create(user_email='batman@octofit.com', workout_name='Gotham Core', duration_minutes=55, calories_burned=480)
        Workout.objects.create(user_email='wonderwoman@octofit.com', workout_name='Warrior Conditioning', duration_minutes=48, calories_burned=460)

        LeaderboardEntry.objects.create(user_email='ironman@octofit.com', team_name='marvel team', score=1100, rank=1)
        LeaderboardEntry.objects.create(user_email='batman@octofit.com', team_name='dc team', score=1050, rank=2)
        LeaderboardEntry.objects.create(user_email='wonderwoman@octofit.com', team_name='dc team', score=1020, rank=3)
        LeaderboardEntry.objects.create(user_email='spiderman@octofit.com', team_name='marvel team', score=980, rank=4)

        self.stdout.write(self.style.SUCCESS('테스트 데이터 적재를 완료했습니다.'))
