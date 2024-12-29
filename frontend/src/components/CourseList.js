import React, { useEffect, useState } from 'react';
import axios from '../api'; // Your axios instance with authentication
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function CourseList() {
  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      const decoded = jwtDecode(token);
      setUser(decoded);
    }

    const fetchCourses = async () => {
      try {
        const res = await axios.get('/courses/');
        setCourses(res.data);
      } catch (err) {
        console.error('Error fetching courses:', err);
      }
    };
    fetchCourses();
  }, []);

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await axios.delete(`/courses/${courseId}/`);
        // Refresh the course list
        setCourses(courses.filter((course) => course.id !== courseId));
      } catch (err) {
        console.error('Error deleting course:', err);
        alert('Failed to delete the course.');
      }
    }
  };

  return (
    <div className='container mt-5'>
      <h2>Available Courses</h2>
      {courses.length > 0 ? (
        <ul className='list-group'>
          {courses.map((course) => (
            <li key={course.id} className='list-group-item'>
              <div className='d-flex justify-content-between align-items-center'>
                <div>
                  <Link to={`/course/${course.id}`}>{course.title}</Link>
                </div>
                <div>
                  {/* Chat Access Link */}
                  <Link to={`/chat/${course.id}`} className='btn btn-sm btn-secondary me-2'>
                    Chat
                  </Link>
                  {/* Show Delete button only if the user is the instructor of the course */}
                  {user && user.is_instructor && user.user_id === course.instructor && (
                    <button
                      className='btn btn-sm btn-danger'
                      onClick={() => handleDeleteCourse(course.id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No courses available.</p>
      )}
    </div>
  );
}

export default CourseList;