from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WorkBoardViewSet, TaskViewSet

router = DefaultRouter()
router.register(r'workboards', WorkBoardViewSet)
router.register(r'tasks', TaskViewSet)

urlpatterns = [
    path('', include(router.urls)),
]