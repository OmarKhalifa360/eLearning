import React, { useState } from 'react';
import axios from '../api';
import { useNavigate } from 'react-router-dom';

function CourseCreate() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleCreateCourse = async () => {
    try {
      await axios.post('/courses/', {
        title,
        description,
      });
      navigate('/dashboard');
    } catch (err) {
      console.error('Error creating course:', err);
    }
  };

  return (
    <div className='container mt-5'>
      <h2>Create New Course</h2>
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
      <button className='btn btn-primary' onClick={handleCreateCourse}>
        Create Course
      </button>
    </div>
  );
}

export default CourseCreate;