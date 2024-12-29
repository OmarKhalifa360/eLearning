import React from 'react';

function LessonPlayer({ lesson }) {
  return (
    <div className='mt-3'>
      <h5>{lesson.title}</h5>
      <div className='ratio ratio-16x9'>
        <iframe
          src={lesson.video_url}
          title={lesson.title}
          allowFullScreen
        ></iframe>
      </div>
      <p>{lesson.description}</p>
    </div>
  );
}

export default LessonPlayer;