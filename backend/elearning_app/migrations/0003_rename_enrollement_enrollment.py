# Generated by Django 5.1.4 on 2024-12-27 05:33

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('elearning_app', '0002_course_created_at_lesson_uploaded_at_enrollement_and_more'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Enrollement',
            new_name='Enrollment',
        ),
    ]
