from rest_framework import serializers
from bson import ObjectId
import ast
from .models import User, Team, Activity, Leaderboard, Workout


def _parse_list_field(value):
    """Normalise a Djongo JSONField that may come back as a Python-repr string."""
    if isinstance(value, list):
        return value
    if isinstance(value, str):
        try:
            parsed = ast.literal_eval(value)
            return parsed if isinstance(parsed, list) else []
        except (ValueError, SyntaxError):
            return []
    return []


class ListField(serializers.Field):
    """Read/write field that keeps members as a real Python list."""

    def to_representation(self, value):
        return _parse_list_field(value)

    def to_internal_value(self, data):
        if isinstance(data, list):
            return data
        if isinstance(data, str):
            return _parse_list_field(data)
        raise serializers.ValidationError('Expected a list.')


class UserSerializer(serializers.ModelSerializer):
    _id = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['_id', 'username', 'email', 'password']

    def get__id(self, obj):
        return str(obj._id) if obj._id else None


class TeamSerializer(serializers.ModelSerializer):
    _id = serializers.SerializerMethodField()
    members = ListField()

    class Meta:
        model = Team
        fields = ['_id', 'name', 'members']

    def get__id(self, obj):
        return str(obj._id) if obj._id else None


class ActivitySerializer(serializers.ModelSerializer):
    _id = serializers.SerializerMethodField()

    class Meta:
        model = Activity
        fields = ['_id', 'username', 'activity_type', 'duration', 'date']

    def get__id(self, obj):
        return str(obj._id) if obj._id else None


class LeaderboardSerializer(serializers.ModelSerializer):
    _id = serializers.SerializerMethodField()

    class Meta:
        model = Leaderboard
        fields = ['_id', 'username', 'score', 'calories']

    def get__id(self, obj):
        return str(obj._id) if obj._id else None


class WorkoutSerializer(serializers.ModelSerializer):
    _id = serializers.SerializerMethodField()

    class Meta:
        model = Workout
        fields = ['_id', 'name', 'description', 'exercises']

    def get__id(self, obj):
        return str(obj._id) if obj._id else None



