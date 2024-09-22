# api/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WorkBoardViewSet, TaskViewSet

router = DefaultRouter()
router.register(r'workboards', WorkBoardViewSet, basename='workboard')
router.register(r'tasks', TaskViewSet, basename='task')

urlpatterns = [
    path('', include(router.urls)),
]
