# api/views.py
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import WorkBoard, Task
from .serializers import WorkBoardSerializer, WorkBoardCreateSerializer, TaskSerializer

class WorkBoardViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return WorkBoard.objects.filter(owner=self.request.user)

    def get_serializer_class(self):
        if self.action == 'create':
            return WorkBoardCreateSerializer
        return WorkBoardSerializer

    @action(detail=True, methods=['post'])
    def add_task(self, request, pk=None):
        workboard = self.get_object()
        serializer = TaskSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(workboard=workboard)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(workboard__owner=self.request.user)

    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        task = self.get_object()
        new_status = request.data.get('status')
        if new_status in dict(Task.STATUS_CHOICES).keys():
            task.status = new_status
            task.save()
            return Response({'status': 'status updated'})
        return Response({'status': 'invalid status'}, status=400)