from django.core.management.base import BaseCommand
from octofit_tracker.models import User, Team, Activity, Leaderboard, Workout
from datetime import date


class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **kwargs):
        # Delete existing data
        User.objects.all().delete()
        Team.objects.all().delete()
        Activity.objects.all().delete()
        Leaderboard.objects.all().delete()
        Workout.objects.all().delete()

        self.stdout.write('Deleted existing data.')

        # Create Users (superheroes)
        users_data = [
            {'username': 'ironman', 'email': 'tony@stark.com', 'password': 'pepper123'},
            {'username': 'spiderman', 'email': 'peter@parker.com', 'password': 'webslinger'},
            {'username': 'captainamerica', 'email': 'steve@rogers.com', 'password': 'shield123'},
            {'username': 'thor', 'email': 'thor@asgard.com', 'password': 'mjolnir99'},
            {'username': 'blackwidow', 'email': 'natasha@shield.com', 'password': 'spy007'},
            {'username': 'batman', 'email': 'bruce@wayne.com', 'password': 'alfred123'},
            {'username': 'superman', 'email': 'clark@kent.com', 'password': 'krypton1'},
            {'username': 'wonderwoman', 'email': 'diana@themyscira.com', 'password': 'lasso42'},
            {'username': 'theflash', 'email': 'barry@allen.com', 'password': 'speedforce'},
            {'username': 'aquaman', 'email': 'arthur@atlantis.com', 'password': 'trident9'},
        ]
        users = []
        for data in users_data:
            user = User(**data)
            user.save()
            users.append(user)

        self.stdout.write(f'Created {len(users)} users.')

        # Create Teams
        marvel_members = [u.username for u in users if u.username in ['ironman', 'spiderman', 'captainamerica', 'thor', 'blackwidow']]
        dc_members = [u.username for u in users if u.username in ['batman', 'superman', 'wonderwoman', 'theflash', 'aquaman']]

        team_marvel = Team(name='Team Marvel', members=marvel_members)
        team_marvel.save()

        team_dc = Team(name='Team DC', members=dc_members)
        team_dc.save()

        self.stdout.write('Created 2 teams: Team Marvel and Team DC.')

        # Create Activities
        activities_data = [
            {'username': 'ironman', 'activity_type': 'flight training', 'duration': 45.0, 'date': date(2024, 1, 10)},
            {'username': 'spiderman', 'activity_type': 'web swinging', 'duration': 30.0, 'date': date(2024, 1, 11)},
            {'username': 'captainamerica', 'activity_type': 'shield throwing', 'duration': 60.0, 'date': date(2024, 1, 12)},
            {'username': 'thor', 'activity_type': 'hammer lifting', 'duration': 50.0, 'date': date(2024, 1, 13)},
            {'username': 'blackwidow', 'activity_type': 'martial arts', 'duration': 40.0, 'date': date(2024, 1, 14)},
            {'username': 'batman', 'activity_type': 'cape gliding', 'duration': 35.0, 'date': date(2024, 1, 10)},
            {'username': 'superman', 'activity_type': 'flying', 'duration': 55.0, 'date': date(2024, 1, 11)},
            {'username': 'wonderwoman', 'activity_type': 'lasso training', 'duration': 45.0, 'date': date(2024, 1, 12)},
            {'username': 'theflash', 'activity_type': 'speed running', 'duration': 20.0, 'date': date(2024, 1, 13)},
            {'username': 'aquaman', 'activity_type': 'swimming', 'duration': 60.0, 'date': date(2024, 1, 14)},
        ]
        for data in activities_data:
            activity = Activity(**data)
            activity.save()

        self.stdout.write(f'Created {len(activities_data)} activities.')

        # Create Leaderboard
        leaderboard_data = [
            {'username': 'ironman',        'score': 950, 'calories': 450},
            {'username': 'spiderman',      'score': 880, 'calories': 390},
            {'username': 'captainamerica', 'score': 920, 'calories': 520},
            {'username': 'thor',           'score': 870, 'calories': 480},
            {'username': 'blackwidow',     'score': 860, 'calories': 430},
            {'username': 'batman',         'score': 940, 'calories': 400},
            {'username': 'superman',       'score': 990, 'calories': 510},
            {'username': 'wonderwoman',    'score': 910, 'calories': 440},
            {'username': 'theflash',       'score': 850, 'calories': 350},
            {'username': 'aquaman',        'score': 830, 'calories': 470},
        ]
        for data in leaderboard_data:
            entry = Leaderboard(**data)
            entry.save()

        self.stdout.write(f'Created {len(leaderboard_data)} leaderboard entries.')

        # Create Workouts
        workouts_data = [
            {
                'name': 'Stark Iron Conditioning',
                'description': 'High-intensity suit-inspired workout for endurance and strength.',
                'exercises': ['suit donning simulation', 'repulsor aim drills', 'flight stabilization core work'],
            },
            {
                'name': 'Spider Agility Circuit',
                'description': 'Agility and reflexes training inspired by your friendly neighborhood hero.',
                'exercises': ['wall crawl simulation', 'quick-reflexes dodging', 'web cast precision throws'],
            },
            {
                'name': 'Shield Warrior Training',
                'description': 'Full-body strength and endurance program fit for a super-soldier.',
                'exercises': ['shield block drills', 'tactical sprints', 'super-soldier press'],
            },
            {
                'name': 'Gotham Night Patrol',
                'description': 'Stealth and strength training for the Dark Knight.',
                'exercises': ['grappling hook pull-ups', 'silent movement drills', 'batarang accuracy throws'],
            },
            {
                'name': 'Speed Force Intervals',
                'description': 'Lightning-fast interval training for maximum speed and recovery.',
                'exercises': ['rapid interval sprints', 'lightning reflex drills', 'speed force meditation'],
            },
        ]
        for data in workouts_data:
            workout = Workout(**data)
            workout.save()

        self.stdout.write(f'Created {len(workouts_data)} workouts.')

        self.stdout.write(self.style.SUCCESS('Database populated successfully with superhero test data!'))
