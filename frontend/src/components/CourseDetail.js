import React, { useEffect, useState } from 'react';
import axios from '../api'; // Use axiosInstance from api.js
import { useParams } from 'react-router-dom';
import LessonPlayer from './LessonPlayer';

function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);

  const fetchCourse = async () => {
    try {
      const res = await axios.get(`/courses/${id}/`);
      setCourse(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLessons = async () => {
    try {
      const res = await axios.get(`/lessons/?course_id=${id}`);
      setLessons(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const checkEnrollment = async () => {
    try {
      const res = await axios.get('/enrollments/');
      const enrolled = res.data.some((enrollment) => enrollment.course.id == id);
      setIsEnrolled(enrolled);
    } catch (err) {
      console.error(err);
    }
  };

  const enrollInCourse = async () => {
    try {
      await axios.post(`/courses/${id}/enroll/`);
      setIsEnrolled(true);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCourse();
    fetchLessons();
    checkEnrollment();
  }, [id]);

  return (
    <div className='container mt-5'>
      {course && (
        <>
          <h2>{course.title}</h2>
          <p>{course.description}</p>
          {!isEnrolled ? (
            <button className='btn btn-primary' onClick={enrollInCourse}>
              Enroll
            </button>
          ) : (
            <>
              <h4 className='mt-4'>Lessons</h4>
              <ul className='list-group'>
                {lessons.map((lesson) => (
                  <li key={lesson.id} className='list-group-item'>
                    <LessonPlayer lesson={lesson} />
                  </li>
                ))}
              </ul>
            </>
          )}
        </>
      )}
      {user.is_instructor && (
        <>
          <Link
            to={`/courses/${course.id}/quizzes/create`}
            className='btn btn-primary mb-3'
          >
            Create Quiz
          </Link>
          {/* ... other instructor actions */}
        </>
      )}
    </div>
  );
}

export default CourseDetail;