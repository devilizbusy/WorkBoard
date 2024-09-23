from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView
from api.views import WorkBoardViewSet, TaskViewSet, LoginView,get_tasks, create_task, update_task, delete_task
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'workboards', WorkBoardViewSet)
router.register(r'tasks', TaskViewSet)
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('api/', include(router.urls)),
    path('api/login/', LoginView.as_view(), name='login'),
    path('', RedirectView.as_view(url='/admin/', permanent=True), name='index'),
    path('workboards/<int:workboard_id>/tasks/', get_tasks, name='get-tasks'),
    path('workboards/<int:workboard_id>/tasks/create/', create_task, name='create-task'),
    path('tasks/<int:task_id>/update/', update_task, name='update-task'),
    path('tasks/<int:task_id>/delete/', delete_task, name='delete-task'),
]