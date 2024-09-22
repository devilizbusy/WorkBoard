# api/admin.py
from django.contrib import admin
from .models import WorkBoard, Task

@admin.register(WorkBoard)
class WorkBoardAdmin(admin.ModelAdmin):
    list_display = ('title', 'owner', 'created_at', 'updated_at')
    search_fields = ('title', 'description', 'owner__username')

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'workboard', 'status', 'assignee', 'created_at', 'updated_at')
    list_filter = ('status', 'workboard')
    search_fields = ('title', 'description', 'assignee__username')