from rest_framework import serializers # type: ignore
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User, Course, Lesson, Enrollment, Progress, Quiz, Question, Choice, Notification, ChatMessage
from django.contrib.auth.password_validation import validate_password # type: ignore
from rest_framework.validators import UniqueValidator # type: ignore


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user
        data['user'] = {
            'username': user.username,
            'is_instructor': user.is_instructor,
            'is_student': user.is_student,
        }
        return data

class UserRegistrationSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]
    )
    password2 = serializers.CharField(write_only=True, required=True)
    is_instructor = serializers.BooleanField(required=True)
    is_student = serializers.BooleanField(required=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'password2', 'email', 'is_instructor', 'is_student')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({'password': "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User(
            username=validated_data['username'],
            email=validated_data['email'],
            is_instructor=validated_data.get('is_instructor', False),
            is_student=validated_data.get('is_student', False),
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'is_instructor', 'is_student')
        read_only_fields = ('id', 'username', 'email', 'is_instructor', 'is_student')

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'

class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = '__all__'

class CourseSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)
    instructor = serializers.StringRelatedField()
    
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

class ProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Progress
        fields = fields = ['id', 'enrollment', 'lesson', 'completed', 'last_accessed']

class ChoiceSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

    class Meta:
        model = Choice
        fields = ['id', 'text', 'is_correct']
        extra_kwargs = {'id': {'read_only': False}}

class QuestionSerializer(serializers.ModelSerializer):
    choices = ChoiceSerializer(many=True)
    id = serializers.IntegerField(required=False)

    class Meta:
        model = Question
        fields = ['id', 'quiz', 'text', 'question_type', 'correct_answer', 'choices']
        extra_kwargs = {'id': {'read_only': False}}

    def create(self, validated_data):
        choices_data = validated_data.pop('choices', [])
        question = Question.objects.create(**validated_data)
        for choice_data in choices_data:
            Choice.objects.create(question=question, **choice_data)
        return question
    
    def update(self, instance, validated_data):
        choices_data = validated_data.pop('choices', [])
        instance.text = validated_data.get('text', instance.text)
        instance.question_type = validated_data.get('question_type', instance.question_type)
        instance.correct_answer = validated_data.get('correct_answer', instance.correct_answer)
        instance.save()

        # Update choices
        existing_ids = [choice.id for choice in instance.choices.all()]
        new_ids = [choice.get('id') for choice in choices_data if choice.get('id')]

        # Delete choices not in new data
        for choice in instance.choices.all():
            if choice.id not in new_ids:
                choice.delete()

        # Create or update choices
        for choice_data in choices_data:
            choice_id = choice_data.get('id', None)
            if choice_id:
                choice = Choice.objects.get(id=choice_id)
                choice.text = choice_data.get('text', choice.text)
                choice.is_correct = choice_data.get('is_correct', choice.is_correct)
                choice.save()
            else:
                Choice.objects.create(question=instance, **choice_data)

        return instance

class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True)
    id = serializers.IntegerField(required=False)

    class Meta:
        model = Quiz
        fields = ['id', 'course', 'title', 'questions']
        extra_kwargs = {'id': {'read_only': False}}

    def create(self, validated_data):
        questions_data = validated_data.pop('questions', [])
        quiz = Quiz.objects.create(**validated_data)
        for question_data in questions_data:
            question_data['quiz'] = quiz
            self.fields['questions'].create(question_data)
        return quiz

    def update(self, instance, validated_data):
        questions_data = validated_data.pop('questions', [])
        instance.title = validated_data.get('title', instance.title)
        instance.save()

        # Update questions
        existing_ids = [question.id for question in instance.questions.all()]
        new_ids = [question.get('id') for question in questions_data if question.get('id')]

        # Delete questions not in new data
        for question in instance.questions.all():
            if question.id not in new_ids:
                question.delete()

        # Create or update questions
        for question_data in questions_data:
            question_id = question_data.get('id', None)
            if question_id:
                question = Question.objects.get(id=question_id)
                self.fields['questions'].update(question, question_data)
            else:
                question_data['quiz'] = instance
                self.fields['questions'].create(question_data)

        return instance

class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = '__all__'
