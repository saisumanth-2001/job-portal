from rest_framework import serializers
from .models import Job,UserProfile
from django.contrib.auth.models import User
from .models import Application
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class JobSerializer(serializers.ModelSerializer):
    posted_by = serializers.PrimaryKeyRelatedField(read_only=True)  

    class Meta:
        model = Job
        fields = '__all__'


class ApplicationSerializer(serializers.ModelSerializer):
    job = JobSerializer(read_only=True)
    class Meta:
        model = Application
        fields = '__all__'
        read_only_fields = ['applicant', 'applied_at']


class UserSerializer(serializers.ModelSerializer):
    role = serializers.CharField(source='userprofile.role', required=False)
    is_verified = serializers.BooleanField(source='userprofile.is_verified', read_only=True)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'role', 'is_verified']
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


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = user.userprofile.role
        token['is_verified'] = user.userprofile.is_verified
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['role'] = self.user.userprofile.role
        data['is_verified'] = self.user.userprofile.is_verified
        return data
