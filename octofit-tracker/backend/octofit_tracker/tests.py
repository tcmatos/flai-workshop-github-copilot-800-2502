from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from .models import User, Team, Activity, Leaderboard, Workout
from datetime import date


class UserModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create(
            username='testuser',
            email='test@example.com',
            password='testpass',
        )

    def tearDown(self):
        User.objects.all().delete()

    def test_user_creation(self):
        self.assertEqual(self.user.username, 'testuser')
        self.assertEqual(self.user.email, 'test@example.com')

    def test_user_str(self):
        self.assertEqual(str(self.user), 'testuser')


class TeamModelTest(TestCase):
    def setUp(self):
        self.team = Team.objects.create(
            name='Team Marvel',
            members=['ironman', 'spiderman'],
        )

    def tearDown(self):
        Team.objects.all().delete()

    def test_team_creation(self):
        self.assertEqual(self.team.name, 'Team Marvel')
        self.assertIn('ironman', self.team.members)

    def test_team_str(self):
        self.assertEqual(str(self.team), 'Team Marvel')


class ActivityModelTest(TestCase):
    def setUp(self):
        self.activity = Activity.objects.create(
            username='ironman',
            activity_type='flight training',
            duration=45.0,
            date=date(2024, 1, 10),
        )

    def tearDown(self):
        Activity.objects.all().delete()

    def test_activity_creation(self):
        self.assertEqual(self.activity.username, 'ironman')
        self.assertEqual(self.activity.activity_type, 'flight training')
        self.assertEqual(self.activity.duration, 45.0)

    def test_activity_str(self):
        self.assertIn('ironman', str(self.activity))


class LeaderboardModelTest(TestCase):
    def setUp(self):
        self.entry = Leaderboard.objects.create(
            username='superman',
            score=990,
        )

    def tearDown(self):
        Leaderboard.objects.all().delete()

    def test_leaderboard_creation(self):
        self.assertEqual(self.entry.username, 'superman')
        self.assertEqual(self.entry.score, 990)

    def test_leaderboard_str(self):
        self.assertIn('superman', str(self.entry))


class WorkoutModelTest(TestCase):
    def setUp(self):
        self.workout = Workout.objects.create(
            name='Stark Iron Conditioning',
            description='High-intensity suit-inspired workout.',
            exercises=['repulsor aim drills', 'flight stabilization'],
        )

    def tearDown(self):
        Workout.objects.all().delete()

    def test_workout_creation(self):
        self.assertEqual(self.workout.name, 'Stark Iron Conditioning')
        self.assertIn('repulsor aim drills', self.workout.exercises)

    def test_workout_str(self):
        self.assertEqual(str(self.workout), 'Stark Iron Conditioning')


class APIEndpointTest(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_api_root(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_users_endpoint(self):
        response = self.client.get('/api/users/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_teams_endpoint(self):
        response = self.client.get('/api/teams/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_activities_endpoint(self):
        response = self.client.get('/api/activities/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_leaderboard_endpoint(self):
        response = self.client.get('/api/leaderboard/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_workouts_endpoint(self):
        response = self.client.get('/api/workouts/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
