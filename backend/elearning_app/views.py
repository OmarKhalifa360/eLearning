from rest_framework import generics, viewsets, permissions # type: ignore
from rest_framework.views import APIView # type: ignore
from rest_framework.permissions import IsAuthenticated, BasePermission
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import User, Course, Lesson, Enrollment, Progress, Quiz, Question, Choice, Notification, ChatMessage
from .serializers import (
    CustomTokenObtainPairSerializer,
    UserSerializer, 
    CourseSerializer, 
    LessonSerializer, 
    EnrollmentSerializer,
    ProgressSerializer, 
    QuizSerializer, 
    QuestionSerializer, 
    ChoiceSerializer, 
    UserRegistrationSerializer, 
    NotificationSerializer, 
    ChatMessageSerializer
)

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = (permissions.AllowAny,)

class UserInfoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            'username': user.username,
            'is_instructor': user.is_instructor,
            'is_student': user.is_student,
        })

class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

class IsInstructor(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_instructor

class IsInstructorOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.instructor == request.user

class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

class CourseViewSet(viewsets.ModelViewSet):
    # queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated, IsInstructorOwner]

    @action(detail=True, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def enrolled_students(self, request, pk=None):
        course = self.get_object()
        enrollments = Enrollment.objects.filter(course=course)
        students = [enrollment.student for enrollment in enrollments]
        serializer = UserSerializer(students, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def enroll(self, request, pk=None):
        course = self.get_object()
        enrollment, created = Enrollment.objects.get_or_create(
            course=course, student=request.user)
        if created:
            return Response({'status': 'enrolled'})
        else:
            return Response({'status': 'already enrolled'})
        
    def perform_create(self, serializer):
        serializer.save(instructor=self.request.user)

    def get_queryset(self):
        user = self.request.user
        if self.request.user.is_instructor:
            return Course.objects.filter(instructor=user)
        return Course.objects.none()

class LessonViewSet(viewsets.ModelViewSet):
    # queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        course_id = self.request.query_params.get('course_id')
        if course_id:
            return Lesson.objects.filter(course_id=course_id)
        return Lesson.objects.none()

class EnrollmentViewSet(viewsets.ModelViewSet):
    # queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Enrollment.objects.filter(student=self.request.user)
    
class ProgressViewSet(viewsets.ModelViewSet):
    queryset = Progress.objects.all()
    serializer_class = ProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Progress.objects.filter(enrollment_student=self.request.user)

class QuizViewSet(viewsets.ModelViewSet):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Set the instructor as the owner of the quiz
        serializer.save()

    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        quiz = self.get_object()
        answers = request.data.get('answers', {})
        score = 0
        for question in quiz.questions.all():
            if question.correct_answer == answers.get(str(question.id)):
                score += 1
        return Response({'score': score})

class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [permissions.IsAuthenticated, IsInstructor]

class ChoiceViewSet(viewsets.ModelViewSet):
    queryset = Choice.objects.all()
    serializer_class = ChoiceSerializer
    permission_classes = [permissions.IsAuthenticated, IsInstructor]

class ChatMessageViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ChatMessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        room_name = self.request.query_params.get('room_name')
        return ChatMessage.objects.filter(room_name=room_name).order_by('timestamp')
