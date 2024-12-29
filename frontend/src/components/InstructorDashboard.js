import React, { useEffect, useState } from 'react';
import axios from '../api'; // Use axiosInstance from api.js
import { Link } from 'react-router-dom';

function InstructorDashboard() {
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const fetchCourses = async () => {
    try {
      const res = await axios.get('/courses/');
      setCourses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const createCourse = async () => {
    try {
      await axios.post('/courses/', { title, description });
      setTitle('');
      setDescription('');
      fetchCourses();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteCourse = async (id) => {
    try {
      await axios.delete(`/courses/${id}/`);
      fetchCourses();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className='container mt-5'>
      <h2>Your Courses</h2>

      <div className='mt-4 mb-4'>
        <h4>Create a New Course</h4>
        <div className='mb-3'>
          <label className='form-label'>Title</label>
          <input
            type='text'
            className='form-control'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className='mb-3'>
          <label className='form-label'>Description</label>
          <textarea
            className='form-control'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <button className='btn btn-success' onClick={createCourse}>
          Create Course
        </button>
      </div>

      <h4>Manage Courses</h4>
      <table className='table'>
        <thead>
          <tr>
            <th>Title</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id}>
              <td>
                <Link to={`/course/${course.id}`}>{course.title}</Link>
              </td>
              <td>
                <button
                  className='btn btn-danger btn-sm'
                  onClick={() => deleteCourse(course.id)}
                >
                  Delete
                </button>
                {/* Add Edit button and functionality if needed */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InstructorDashboard;