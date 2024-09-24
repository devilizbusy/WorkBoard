from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import login, logout, authenticate
from .models import Board, Task
from .serializers import BoardSerializer, TaskSerializer, UserSerializer
from django.contrib.auth.models import User
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator
from django.views import View
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken

class BoardViewSet(viewsets.ModelViewSet):
    queryset = Board.objects.all()
    serializer_class = BoardSerializer

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
@ensure_csrf_cookie
def get_csrf_token(request):
    return JsonResponse({'detail': 'CSRF cookie set'})

# For class-based views
@method_decorator(ensure_csrf_cookie, name='dispatch')
class CSRFTokenView(View):
    def get(self, request):
        return JsonResponse({'detail': 'CSRF cookie set'})
    
@method_decorator(ensure_csrf_cookie, name='dispatch')
class CSRFTokenView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({'detail': 'CSRF cookie set'})

class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user:
            login(request, user)
            refresh = RefreshToken.for_user(user)
            return Response({
                'token': str(refresh.access_token),
                'refresh': str(refresh),
            }, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response({'detail': 'Successfully logged out.'}, status=status.HTTP_200_OK)
    
class CurrentUserView(APIView):
    def get(self, request):
        if request.user.is_authenticated:
            serializer = UserSerializer(request.user)
            return Response(serializer.data)
        return Response(status=status.HTTP_401_UNAUTHORIZED)
    
    
    @method_decorator(ensure_csrf_cookie, name='dispatch')
    class CSRFTokenView(View):
        def get(self, request):
            return JsonResponse({'detail': 'CSRF cookie set'})
    
    @method_decorator(ensure_csrf_cookie, name='dispatch')
    class CSRFTokenView(APIView):
        permission_classes = [AllowAny]
