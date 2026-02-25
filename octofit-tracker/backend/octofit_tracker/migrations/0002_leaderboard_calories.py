from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('octofit_tracker', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='leaderboard',
            name='calories',
            field=models.IntegerField(default=0),
        ),
    ]
