# workboards_backend/api/serializers.py
from rest_framework import serializers
from .models import WorkBoard, Task

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'status', 'workboard']

class WorkBoardSerializer(serializers.ModelSerializer):
    tasks = TaskSerializer(many=True, read_only=True)

    class Meta:
        model = WorkBoard
        fields = ['id', 'name', 'description', 'tasks']

class WorkBoardCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkBoard
        fields = ['name', 'description']  # Include fields you want to allow for creation
