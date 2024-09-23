from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.authtoken.models import Token
from django.http import HttpResponse
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework import status
from api.models import WorkBoard, Task
from api.serializers import WorkBoardSerializer, WorkBoardCreateSerializer, TaskSerializer


# LoginView for handling user authentication and token creation
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        
        if user is not None:
            token, created = Token.objects.get_or_create(user=user)
            return Response({"token": token.key}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)


# Simple home view
def home(request):
    return HttpResponse("Welcome to the WorkBoard!")


# WorkBoard ViewSet
class WorkBoardViewSet(viewsets.ModelViewSet):
    queryset = WorkBoard.objects.all() 
    serializer_class = WorkBoardSerializer  # Default serializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return WorkBoard.objects.filter(owner=self.request.user)

    def get_serializer_class(self):
        if self.action == 'create':
            return WorkBoardCreateSerializer
        return WorkBoardSerializer

    # Action for adding tasks to a specific workboard
    @action(detail=True, methods=['post'])
    def add_task(self, request, pk=None):
        workboard = self.get_object()
        serializer = TaskSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(workboard=workboard)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


# Task ViewSet
class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all() 
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(workboard__owner=self.request.user)

    # Action to update the status of a specific task
    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        task = self.get_object()
        new_status = request.data.get('status')
        valid_statuses = [choice[0] for choice in Task.STATUS_CHOICES]
        
        if new_status in valid_statuses:
            task.status = new_status
            task.save()
            return Response({'status': 'status updated'}, status=200)
        return Response({'status': 'invalid status'}, status=400)
