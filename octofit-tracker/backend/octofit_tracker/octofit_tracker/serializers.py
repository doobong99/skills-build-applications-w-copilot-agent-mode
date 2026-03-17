from rest_framework import serializers

from .models import Activity, LeaderboardEntry, Team, UserProfile, Workout


class ObjectIdStringModelSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField(read_only=True)

    def get_id(self, obj):
        return str(obj.id) if getattr(obj, 'id', None) else None


class TeamSerializer(ObjectIdStringModelSerializer):
    class Meta:
        model = Team
        fields = '__all__'


class UserProfileSerializer(ObjectIdStringModelSerializer):
    class Meta:
        model = UserProfile
        fields = '__all__'


class ActivitySerializer(ObjectIdStringModelSerializer):
    class Meta:
        model = Activity
        fields = '__all__'


class LeaderboardEntrySerializer(ObjectIdStringModelSerializer):
    class Meta:
        model = LeaderboardEntry
        fields = '__all__'


class WorkoutSerializer(ObjectIdStringModelSerializer):
    class Meta:
        model = Workout
        fields = '__all__'
