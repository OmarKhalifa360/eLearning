from rest_framework import serializers # type: ignore
from .models import User, Course, Lesson, Enrollment, Progress 
from django.contrib.auth.password_validation import validate_password # type: ignore
from rest_framework.validators import UniqueValidator # type: ignore


class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required = True,
        validators = [UniqueValidator(queryset=User.objects.all())]
    )
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    is_instructor = serializers.BooleanField(required=True)
    is_student = serializers.BooleanField(required=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'email', 'is_instructor', 'is_student')

    def create(self, validated_data):
        user = User.objects.create(
            username = validated_data['username'],
            email = validated_data['email'],
            is_instructor = validated_data['is_instructor'],
            is_student = validated_data['is_student']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'

class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = '__all__'

class EnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = '__all__'