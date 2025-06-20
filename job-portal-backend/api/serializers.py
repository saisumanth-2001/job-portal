from rest_framework import serializers
from .models import Job,UserProfile
from django.contrib.auth.models import User
from .models import Application



class JobSerializer(serializers.ModelSerializer):
    posted_by = serializers.PrimaryKeyRelatedField(read_only=True)  

    class Meta:
        model = Job
        fields = '__all__'


class ApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = '__all__'
        read_only_fields = ['applicant', 'applied_at']




class UserSerializer(serializers.ModelSerializer):
    role = serializers.CharField(source='userprofile.role', required=False)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'role']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        userprofile_data = validated_data.pop('userprofile', {})
        password = validated_data.pop('password')
        role = userprofile_data.get('role', 'CAN')

        user = User.objects.create_user(**validated_data, password=password)

        user.userprofile.role = role
        user.userprofile.save()
    
        return user


    def update(self, instance, validated_data):
        userprofile_data = validated_data.pop('userprofile', {})
        role = userprofile_data.get('role')

        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)

        password = validated_data.get('password', None)
        if password:
            instance.set_password(password)

        instance.save()

        if role:
            instance.userprofile.role = role
            instance.userprofile.save()

        return instance
