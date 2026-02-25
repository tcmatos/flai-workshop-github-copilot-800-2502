from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('octofit_tracker', '0002_leaderboard_calories'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='name',
            field=models.CharField(default='', max_length=150),
        ),
    ]
