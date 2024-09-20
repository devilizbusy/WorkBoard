from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import WorkBoard, Task
from .serializers import WorkBoardSerializer, TaskSerializer

class WorkBoardViewSet(viewsets.ModelViewSet):
    queryset = WorkBoard.objects.all()
    serializer_class = WorkBoardSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def get_queryset(self):
        return WorkBoard.objects.filter(created_by=self.request.user)

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(work_board__created_by=self.request.user)