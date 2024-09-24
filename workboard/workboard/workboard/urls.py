from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from boards.views import (
    BoardViewSet, 
    TaskViewSet, 
    UserViewSet, 
    LoginView, 
    LogoutView, 
    CurrentUserView,
    CSRFTokenView
)

router = DefaultRouter()
router.register(r'boards', BoardViewSet)
router.register(r'tasks', TaskViewSet)
router.register(r'users', UserViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/login/', LoginView.as_view(), name='login'),
    path('api/logout/', LogoutView.as_view(), name='api_logout'),
    path('api/users/me/', CurrentUserView.as_view(), name='current_user'),
    path('api/csrf/', CSRFTokenView.as_view(), name='csrf_token'),
    path('api-auth/', include('rest_framework.urls')),
]