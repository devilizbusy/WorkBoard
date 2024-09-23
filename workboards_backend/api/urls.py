# workboards_backend/api/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token
from .views import WorkBoardListView, WorkBoardViewSet, TaskViewSet, LoginView 
from . import views


router = DefaultRouter()
router.register(r'workboards', WorkBoardViewSet)
router.register(r'tasks', TaskViewSet)
urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('workboards/', WorkBoardListView.as_view(), name='workboard-list'),
    path('workboards/<int:workboard_id>/tasks/', views.get_tasks, name='get_tasks'),
    path('tasks/create/', views.create_task, name='create_task'),
    path('tasks/<int:task_id>/update/', views.update_task, name='update_task'),
    path('tasks/<int:task_id>/delete/', views.delete_task, name='delete_task'),
    path('api-token-auth/', obtain_auth_token, name='api_token_auth'),
    path('', include(router.urls)), 
]