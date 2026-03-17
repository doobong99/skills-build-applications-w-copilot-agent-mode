from django.contrib import admin

from .models import Activity, LeaderboardEntry, Team, UserProfile, Workout


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'team_name', 'points')
    search_fields = ('username', 'email', 'team_name')


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ('name', 'universe', 'motto')
    search_fields = ('name', 'universe')


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ('user_email', 'activity_type', 'distance_km', 'performed_at')
    search_fields = ('user_email', 'activity_type')


@admin.register(LeaderboardEntry)
class LeaderboardEntryAdmin(admin.ModelAdmin):
    list_display = ('rank', 'user_email', 'team_name', 'score')
    search_fields = ('user_email', 'team_name')


@admin.register(Workout)
class WorkoutAdmin(admin.ModelAdmin):
    list_display = ('user_email', 'workout_name', 'duration_minutes', 'calories_burned')
    search_fields = ('user_email', 'workout_name')
