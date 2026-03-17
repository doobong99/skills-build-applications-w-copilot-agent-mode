from django.http import JsonResponse
from rest_framework import viewsets

from .models import Activity, LeaderboardEntry, Team, UserProfile, Workout
from .serializers import (
    ActivitySerializer,
    LeaderboardEntrySerializer,
    TeamSerializer,
    UserProfileSerializer,
    WorkoutSerializer,
)


class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all().order_by('name')
    serializer_class = TeamSerializer


class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all().order_by('-points', 'username')
    serializer_class = UserProfileSerializer


class ActivityViewSet(viewsets.ModelViewSet):
    queryset = Activity.objects.all().order_by('-performed_at')
    serializer_class = ActivitySerializer


class LeaderboardEntryViewSet(viewsets.ModelViewSet):
    queryset = LeaderboardEntry.objects.all().order_by('rank')
    serializer_class = LeaderboardEntrySerializer


class WorkoutViewSet(viewsets.ModelViewSet):
    queryset = Workout.objects.all().order_by('-calories_burned', 'workout_name')
    serializer_class = WorkoutSerializer


def api_summary(request):
    top_user = UserProfile.objects.all().order_by('-points').first()
    top_team = LeaderboardEntry.objects.all().order_by('rank').first()

    return JsonResponse({
        'counts': {
            'users': UserProfile.objects.count(),
            'teams': Team.objects.count(),
            'activities': Activity.objects.count(),
            'leaderboard': LeaderboardEntry.objects.count(),
            'workouts': Workout.objects.count(),
        },
        'highlights': {
            'top_user': {
                'username': top_user.username,
                'points': top_user.points,
            } if top_user else None,
            'top_team_entry': {
                'team_name': top_team.team_name,
                'score': top_team.score,
                'rank': top_team.rank,
            } if top_team else None,
        },
    })
