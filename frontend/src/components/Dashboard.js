import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from '../api';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
    } else {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
        fetchUserInfo(decoded.user_id);
      } catch (err) {
        console.error('Token decoding failed:', err);
        navigate('/login');
      }
    }
  }, [navigate]);

  const fetchUserInfo = async (userId) => {
    try {
      const res = await axios.get(`/users/${userId}/`);
      setUsername(res.data.username);

      if (res.data.is_instructor) {
        await fetchInstructorCourses();
      } else if (res.data.is_student) {
        await fetchStudentEnrollments();
      }
    } catch (err) {
      console.error('Error fetching user info:', err);
      setError('Failed to load user information.');
    } finally {
      setLoading(false);
    }
  };

  const fetchInstructorCourses = async () => {
    try {
      const res = await axios.get('/courses/');
      console.log('Instructor courses:', res.data);
      setCourses(res.data);
    } catch (err) {
      console.error('Error fetching instructor courses:', err);
    }
  };

  const fetchStudentEnrollments = async () => {
    try {
      const res = await axios.get('/enrollments/');
      console.log('Enrollments:', res.data);
      const enrolledCourses = res.data.map((enrollment) => enrollment.course);
      setCourses(enrolledCourses);
    } catch (err) {
      console.error('Error fetching student enrollments:', err);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await axios.delete(`/courses/${courseId}/`);
        // Refresh the course list
        fetchInstructorCourses();
      } catch (err) {
        console.error('Error deleting course:', err);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/');
  };

  return (
    <div className='container mt-5'>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className='d-flex justify-content-between align-items-center'>
            <h2>Welcome, {username}!</h2>
            <button className='btn btn-danger' onClick={handleLogout}>
              Logout
            </button>
          </div>
  
          {user.is_instructor && (
            <>
              <h4 className='mt-4'>Instructor Dashboard</h4>
              <Link to='/courses/create' className='btn btn-primary mb-3'>
                Create New Course
              </Link>
              {courses.length > 0 ? (
                <table className='table table-striped'>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((course) => (
                      <tr key={course.id}>
                        <td>{course.title}</td>
                        <td>
                          <Link
                            to={`/course/${course.id}`}
                            className='btn btn-sm btn-outline-primary me-2'
                          >
                            View
                          </Link>
                          <button className='btn btn-sm btn-danger'
                            onClick={() => handleDeleteCourse(course.id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>You have not created any courses yet.</p>
              )}
            </>
          )}
  
          {user.is_student && (
            <>
              <h4 className='mt-4'>Student Dashboard</h4>
              <Link to='/courses' className='btn btn-primary mb-3'>
                Browse Courses
              </Link>
              {courses.length > 0 ? (
                <ul className='list-group'>
                  {courses.map((course) => (
                    <li key={course.id} className='list-group-item'>
                      <Link to={`/course/${course.id}`}>{course.title}</Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>You are not enrolled in any courses yet.</p>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default Dashboard;