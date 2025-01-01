# elearning_app/urls.py
from django.urls import path, include
from rest_framework import routers
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)
from .views import (
    CustomTokenObtainPairView,
    UserInfoView,
    RegisterView,
    CourseViewSet,
    LessonViewSet,
    EnrollmentViewSet,
    ProgressViewSet,
    UserViewSet,
    QuizViewSet,
    QuestionViewSet,
    ChoiceViewSet,
    NotificationViewSet
)

router = routers.DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'courses', CourseViewSet, basename='course')
router.register(r'lessons', LessonViewSet, basename='lesson')
router.register(r'enrollments', EnrollmentViewSet, basename='enrollment')
router.register(r'progress', ProgressViewSet, basename='progress')
router.register(r'quizzes', QuizViewSet)
router.register(r'questions', QuestionViewSet)
router.register(r'choices', ChoiceViewSet)
router.register(r'notifications', NotificationViewSet, basename='notification')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('user/', UserInfoView.as_view(), name='user_info'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]