"""octofit_tracker URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
import os

from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    ActivityViewSet,
    LeaderboardEntryViewSet,
    TeamViewSet,
    UserProfileViewSet,
    WorkoutViewSet,
    api_summary,
)

codespace_name = os.environ.get('CODESPACE_NAME')
if codespace_name:
    codespace_base_url = f"https://{codespace_name}-8000.app.github.dev"
else:
    codespace_base_url = "http://localhost:8000"

router = DefaultRouter()
router.register(r'users', UserProfileViewSet, basename='users')
router.register(r'teams', TeamViewSet, basename='teams')
router.register(r'activities', ActivityViewSet, basename='activities')
router.register(r'leaderboard', LeaderboardEntryViewSet, basename='leaderboard')
router.register(r'workouts', WorkoutViewSet, basename='workouts')


def api_root(request):
    return JsonResponse({
        'message': 'OctoFit Tracker API',
        'base_url': codespace_base_url,
        'endpoints': {
            'users': f'{codespace_base_url}/api/users/',
            'teams': f'{codespace_base_url}/api/teams/',
            'activities': f'{codespace_base_url}/api/activities/',
            'leaderboard': f'{codespace_base_url}/api/leaderboard/',
            'workouts': f'{codespace_base_url}/api/workouts/',
            'summary': f'{codespace_base_url}/api/summary/',
        },
    })

urlpatterns = [
    path('', api_root, name='root-api'),
    path('admin/', admin.site.urls),
    path('api/', api_root, name='api-root'),
    path('api/summary/', api_summary, name='api-summary'),
    path('api/', include(router.urls)),
]
