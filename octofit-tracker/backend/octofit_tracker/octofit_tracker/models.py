from bson import ObjectId
from djongo import models


class Team(models.Model):
    id = models.ObjectIdField(primary_key=True, editable=False, default=ObjectId)
    name = models.CharField(max_length=100, unique=True)
    universe = models.CharField(max_length=20)
    motto = models.CharField(max_length=255, blank=True)

    class Meta:
        db_table = 'teams'

    def __str__(self):
        return self.name


class UserProfile(models.Model):
    id = models.ObjectIdField(primary_key=True, editable=False, default=ObjectId)
    username = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    team_name = models.CharField(max_length=100)
    points = models.IntegerField(default=0)

    class Meta:
        db_table = 'users'

    def __str__(self):
        return self.username


class Activity(models.Model):
    id = models.ObjectIdField(primary_key=True, editable=False, default=ObjectId)
    user_email = models.EmailField()
    activity_type = models.CharField(max_length=100)
    distance_km = models.FloatField(default=0)
    performed_at = models.DateTimeField()
    notes = models.CharField(max_length=255, blank=True)

    class Meta:
        db_table = 'activities'

    def __str__(self):
        return f"{self.user_email} - {self.activity_type}"


class LeaderboardEntry(models.Model):
    id = models.ObjectIdField(primary_key=True, editable=False, default=ObjectId)
    user_email = models.EmailField()
    team_name = models.CharField(max_length=100)
    score = models.IntegerField(default=0)
    rank = models.IntegerField(default=0)

    class Meta:
        db_table = 'leaderboard'

    def __str__(self):
        return f"{self.rank} - {self.user_email}"


class Workout(models.Model):
    id = models.ObjectIdField(primary_key=True, editable=False, default=ObjectId)
    user_email = models.EmailField()
    workout_name = models.CharField(max_length=100)
    duration_minutes = models.IntegerField()
    calories_burned = models.IntegerField()

    class Meta:
        db_table = 'workouts'

    def __str__(self):
        return f"{self.user_email} - {self.workout_name}"
