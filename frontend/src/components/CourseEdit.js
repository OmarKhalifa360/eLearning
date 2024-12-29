import React, { useState, useEffect } from 'react';
import axios from '../api';
import { useParams, useNavigate } from 'react-router-dom';

function CourseEdit() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`/courses/${id}/`);
        setTitle(res.data.title);
        setDescription(res.data.description);
      } catch (err) {
        console.error('Error fetching course:', err);
      }
    };
    fetchCourse();
  }, [id]);

  const handleUpdateCourse = async () => {
    try {
      await axios.put(`/courses/${id}/`, {
        title,
        description,
      });
      navigate('/dashboard');
    } catch (err) {
      console.error('Error updating course:', err);
    }
  };

  return (
    <div className='container mt-5'>
      <h2>Edit Course</h2>
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
      <button className='btn btn-primary' onClick={handleUpdateCourse}>
        Save Changes
      </button>
    </div>
  );
}

export default CourseEdit;