from rest_framework import generics, permissions, status
from rest_framework.permissions import AllowAny
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework import viewsets
from django.shortcuts import get_object_or_404
from .models import WorkBoard, Task
from .serializers import WorkBoardSerializer, TaskSerializer

class WorkBoardViewSet(viewsets.ModelViewSet):
    queryset = WorkBoard.objects.all()
    serializer_class = WorkBoardSerializer
    
class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    
class WorkBoardListView(generics.ListCreateAPIView):
    queryset = WorkBoard.objects.all()
    serializer_class = WorkBoardSerializer
    permission_classes = [permissions.IsAuthenticated]  # Ensure user is authenticated

    def get_queryset(self):
        return WorkBoard.objects.filter(owner=self.request.user)  # Optional: Filter by user

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class LoginView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)

        if user is not None:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({'token': token.key})
        return Response({'error': 'Invalid Credentials'}, status=400)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_tasks(request, workboard_id):
    workboard = get_object_or_404(WorkBoard, id=workboard_id)
    tasks = Task.objects.filter(workboard=workboard)
    serializer = TaskSerializer(tasks, many=True)
    return Response(serializer.data)

# Create a new Task for a specific WorkBoard
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def create_task(request, workboard_id):
    workboard = get_object_or_404(WorkBoard, id=workboard_id)
    serializer = TaskSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(workboard=workboard)  # Ensure task is linked to a workboard
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

# Update an existing Task
@api_view(['PUT'])
@permission_classes([permissions.IsAuthenticated])
def update_task(request, task_id):
    task = get_object_or_404(Task, id=task_id)
    serializer = TaskSerializer(task, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)

# Delete an existing Task
@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def delete_task(request, task_id):
    task = get_object_or_404(Task, id=task_id)
    task.delete()
    return Response(status=204)
