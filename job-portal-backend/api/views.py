from django.shortcuts import render
from rest_framework import viewsets
from .models import Job,Application
from .serializers import JobSerializer,ApplicationSerializer
from rest_framework.permissions import IsAuthenticatedOrReadOnly,AllowAny,IsAuthenticated
from rest_framework import generics
from .serializers import UserSerializer
from django.contrib.auth.models import User
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from rest_framework.decorators import action
from django.core.mail import send_mail
from django.conf import settings

# Create your views here.


class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.all().order_by('-posted_at')
    serializer_class = JobSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['location', 'job_type','is_remote'] 
    permission_classes = [IsAuthenticatedOrReadOnly]

    
    def perform_create(self, serializer):
        serializer.save(posted_by=self.request.user)
    

    def create(self, request, *args, **kwargs):
        if not hasattr(request.user, 'userprofile') or request.user.userprofile.role != 'EMP':
            return Response({'detail': 'Only employers can post jobs.'}, status=status.HTTP_403_FORBIDDEN)
        return super().create(request, *args, **kwargs)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def apply(self, request, pk=None):
        job = self.get_object()
        user = request.user

        if Application.objects.filter(job=job, applicant=user).exists():
            return Response({'detail': 'Already applied'}, status=status.HTTP_400_BAD_REQUEST)

        resume = request.FILES.get('resume')
        cover_letter = request.data.get('cover_letter', '')

        if not resume:
            return Response({'detail': 'Resume file is required.'}, status=status.HTTP_400_BAD_REQUEST)

        Application.objects.create(job=job, applicant=user, resume=resume, cover_letter=cover_letter)
        return Response({'detail': 'Application submitted successfully!'}, status=status.HTTP_201_CREATED)


class RegisterUserAPIView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]




class ApplicationViewSet(viewsets.ModelViewSet):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(applicant=self.request.user)

    @action(detail=True, methods=['patch'], permission_classes=[IsAuthenticated])
    def update_status(self, request, pk=None):
        application = self.get_object()

        if application.job.posted_by != request.user:
            return Response({'detail': 'Not authorized to update this application'}, status=status.HTTP_403_FORBIDDEN)

        status_value = request.data.get('status')
        if status_value not in dict(Application.STATUS_CHOICES):
            return Response({'detail': 'Invalid status value'}, status=status.HTTP_400_BAD_REQUEST)

        application.status = status_value
        application.save()

        subject = f'Your application status for "{application.job.title}" has been updated'
        message = (
            f'Hello {application.applicant.username},\n\n'
            f'Your application status has been updated to "{application.get_status_display()}".\n\n'
            'Best regards,\nJob Portal Team'
        )
        recipient_list = [application.applicant.email]

        send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, recipient_list)

        serializer = self.get_serializer(application)
        return Response(serializer.data)


class UserProfileAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def job_applicants(request, job_id):
    try:
        job = Job.objects.get(id=job_id)
    except Job.DoesNotExist:
        return Response({'error': 'Job not found'}, status=status.HTTP_404_NOT_FOUND)

    if job.posted_by != request.user:
        return Response({'error': 'You are not authorized to view applicants for this job.'}, status=status.HTTP_403_FORBIDDEN)

    applications = job.applications.all()
    serializer = ApplicationSerializer(applications, many=True)
    return Response(serializer.data)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_applications(request):
    applications = Application.objects.filter(applicant=request.user)
    serializer = ApplicationSerializer(applications, many=True)
    return Response(serializer.data)
