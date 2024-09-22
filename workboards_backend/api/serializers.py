# api/serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import WorkBoard, Task

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class TaskSerializer(serializers.ModelSerializer):
    assignee = UserSerializer(read_only=True)
    assignee_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), source='assignee', write_only=True, allow_null=True)

    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'status', 'assignee', 'assignee_id', 'created_at', 'updated_at']

class WorkBoardSerializer(serializers.ModelSerializer):
    tasks = TaskSerializer(many=True, read_only=True)
    owner = UserSerializer(read_only=True)

    class Meta:
        model = WorkBoard
        fields = ['id', 'title', 'description', 'owner', 'tasks', 'created_at', 'updated_at']

class WorkBoardCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkBoard
        fields = ['id', 'title', 'description']

    def create(self, validated_data):
        validated_data['owner'] = self.context['request'].user
        return super().create(validated_data)