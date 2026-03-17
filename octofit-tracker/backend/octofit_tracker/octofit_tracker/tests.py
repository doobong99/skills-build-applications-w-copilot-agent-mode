from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient

from .models import Activity, LeaderboardEntry, Team, UserProfile, Workout


class OctoFitCollectionsApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        Team.objects.create(name='marvel team', universe='marvel', motto='Avengers Assemble!')
        Team.objects.create(name='dc team', universe='dc', motto='Justice for all!')

        UserProfile.objects.create(
            username='Peter Parker',
            email='spiderman@octofit.com',
            team_name='marvel team',
            points=980,
        )
        UserProfile.objects.create(
            username='Bruce Wayne',
            email='batman@octofit.com',
            team_name='dc team',
            points=1050,
        )

        Activity.objects.create(
            user_email='spiderman@octofit.com',
            activity_type='Wall Climb Sprints',
            distance_km=5.2,
            performed_at=timezone.now(),
            notes='Rooftop interval training',
        )

        LeaderboardEntry.objects.create(
            user_email='batman@octofit.com',
            team_name='dc team',
            score=1050,
            rank=1,
        )

        Workout.objects.create(
            user_email='spiderman@octofit.com',
            workout_name='Spider Agility',
            duration_minutes=45,
            calories_burned=420,
        )

    def test_users_collection_endpoint(self):
        response = self.client.get('/api/users/')
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(len(response.json()), 1)

    def test_teams_collection_endpoint(self):
        response = self.client.get('/api/teams/')
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(len(response.json()), 1)

    def test_activities_collection_endpoint(self):
        response = self.client.get('/api/activities/')
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(len(response.json()), 1)

    def test_leaderboard_collection_endpoint(self):
        response = self.client.get('/api/leaderboard/')
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(len(response.json()), 1)

    def test_workouts_collection_endpoint(self):
        response = self.client.get('/api/workouts/')
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(len(response.json()), 1)

    def test_summary_endpoint(self):
        response = self.client.get('/api/summary/')
        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertIn('counts', payload)
        self.assertIn('highlights', payload)
        self.assertGreaterEqual(payload['counts']['users'], 1)
