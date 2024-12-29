import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const token = localStorage.getItem('access_token');

  return (
    <div className='container mt-5'>
      <h1>Welcome to eLearning Platform</h1>
      <p>
        This is an online platform where instructors can create courses, and students can enroll
        and learn at their own pace.
      </p>
      <div className='mt-4'>
        {token ? (
          <>
            <Link to='/dashboard' className='btn btn-primary me-2'>
              Go to Dashboard
            </Link>
          </>
        ) : (
          <>
            <Link to='/login' className='btn btn-primary me-2'>
              Login
            </Link>
            <Link to='/register' className='btn btn-secondary'>
              Register
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Home;