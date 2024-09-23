# workboards_backend/api/models.py
from django.db import models

class WorkBoard(models.Model):
    name = models.CharField(max_length=100, default="workboards")
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

class Task(models.Model):
    STATUS_CHOICES = [
        ('To-Do', 'To-Do'),
        ('In Progress', 'In Progress'),
        ('Completed', 'Completed'),
    ]

    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='To-Do')
    workboard = models.ForeignKey(WorkBoard, related_name='tasks', on_delete=models.CASCADE)

    def __str__(self):
        return self.title