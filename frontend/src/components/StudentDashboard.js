import React, { useEffect, useState } from 'react';
import axios from '../api'; // Use axiosInstance from api.js
import { Link } from 'react-router-dom';

function StudentDashboard() {
  const [enrollments, setEnrollments] = useState([]);

  const fetchEnrollments = async () => {
    try {
      const res = await axios.get('/enrollments/');
      setEnrollments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  return (
    <div className='container mt-5'>
      <h2>Your Enrolled Courses</h2>
      <ul className='list-group'>
        {enrollments.map((enrollment) => (
          <li key={enrollment.id} className='list-group-item'>
            <Link to={`/course/${enrollment.course.id}`}>
              {enrollment.course.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StudentDashboard;