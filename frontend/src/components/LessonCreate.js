import React, { useState } from 'react';
import axios from '../api';
import { useNavigate, useParams } from 'react-router-dom';

function LessonCreate() {
  const { courseId } = useParams();
  const [title, setTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleCreateLesson = async () => {
    try {
      await axios.post('/lessons/', {
        course: courseId,
        title,
        video_url: videoUrl,
        description,
      });
      navigate(`/courses/${courseId}`);
    } catch (err) {
      console.error('Error creating lesson:', err);
    }
  };

  return (
    <div className='container mt-5'>
      <h2>Add New Lesson</h2>
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
        <label className='form-label'>Video URL</label>
        <input
          type='text'
          className='form-control'
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
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
      <button className='btn btn-primary' onClick={handleCreateLesson}>
        Add Lesson
      </button>
    </div>
  );
}

export default LessonCreate;