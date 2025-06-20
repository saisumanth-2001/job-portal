from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import JobViewSet,ApplicationViewSet
from .views import RegisterUserAPIView,my_applications,UserProfileAPIView,job_applicants


router = DefaultRouter()
router.register(r'jobs', JobViewSet)
router.register(r'applications', ApplicationViewSet)


urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterUserAPIView.as_view(), name='register'),
    path('my-applications/',my_applications,name='my-applications'),
    path('profile/', UserProfileAPIView.as_view(), name='user-profile'),
    path('jobs/<int:job_id>/applicants/', job_applicants, name='job-applicants'),

]
