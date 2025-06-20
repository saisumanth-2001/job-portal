from django.db import models
from django.db import models
from django.contrib.auth.models import User


# Create your models here.

class Job(models.Model):
    JOB_TYPES = (
        ('FT', 'Full-Time'),
        ('PT', 'Part-Time'),
        ('CT', 'Contract'),
        ('IN', 'Internship'),
    )
     
    title = models.CharField(max_length=100)
    company = models.CharField(max_length=100)
    location = models.CharField(max_length=100)
    job_type = models.CharField(max_length=2, choices=JOB_TYPES)
    is_remote = models.BooleanField(default=False)
    description = models.TextField()
    posted_by = models.ForeignKey(User, on_delete=models.CASCADE)
    posted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title




class UserProfile(models.Model):
    USER_ROLES = (
        ('EMP', 'Employer'),
        ('CAN', 'Candidate'),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=3, choices=USER_ROLES, default='CAN')

    def __str__(self):
        return f"{self.user.username} ({self.role})"
    


class Application(models.Model):
    STATUS_CHOICES = (
        ('P', 'Pending'),
        ('S', 'Shortlisted'),
        ('R', 'Rejected'),
    )
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')
    applicant = models.ForeignKey(User, on_delete=models.CASCADE)
    resume = models.FileField(upload_to='resumes/',blank=True,null=True)
    cover_letter = models.TextField(blank=True)
    applied_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=1, choices=STATUS_CHOICES, default='P')

    class Meta:
        unique_together = ('job', 'applicant')

    def __str__(self):
        return f"{self.applicant.username} -> {self.job.title} ({self.get_status_display()})"
