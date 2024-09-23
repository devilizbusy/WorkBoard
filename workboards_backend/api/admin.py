# workboards_backend/api/admin.py
from django.contrib import admin
from .models import WorkBoard, Task

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ['title', 'status', 'workboard']
    list_filter = ['status', 'workboard']
    search_fields = ['title', 'description']

@admin.register(WorkBoard)
class WorkBoardAdmin(admin.ModelAdmin):
    list_display = ['name', 'description']
    search_fields = ['name', 'description']