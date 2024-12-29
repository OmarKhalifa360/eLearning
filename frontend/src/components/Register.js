import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student'); // Default role
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleRegister = async () => {
    try {
      await axios.post('http://localhost:8000/api/register/', {
        username,
        email,
        password,
        is_instructor: role === 'instructor',
        is_student: role === 'student',
      });
      navigate('/login');
    } catch (err) {
      console.error(err);
      setError('Registration failed');
    }
  };

  return (
    <div className='container mt-5'>
      <h2 className='mb-4'>Register</h2>
      {error && <div className='alert alert-danger'>{error}</div>}
      <div className='mb-3'>
        <label className='form-label'>Username</label>
        <input
          type='text'
          className='form-control'
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className='mb-3'>
        <label className='form-label'>Email</label>
        <input
          type='email'
          className='form-control'
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className='mb-3'>
        <label className='form-label'>Password</label>
        <input
          type='password'
          className='form-control'
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className='mb-3'>
        <label className='form-label'>Select Role</label>
        <div>
          <div className='form-check'>
            <input
              type='radio'
              className='form-check-input'
              name='role'
              value='student'
              checked={role === 'student'}
              onChange={(e) => setRole(e.target.value)}
              id='studentRadio'
            />
            <label className='form-check-label' htmlFor='studentRadio'>
              Student
            </label>
          </div>
          <div className='form-check'>
            <input
              type='radio'
              className='form-check-input'
              name='role'
              value='instructor'
              checked={role === 'instructor'}
              onChange={(e) => setRole(e.target.value)}
              id='instructorRadio'
            />
            <label className='form-check-label' htmlFor='instructorRadio'>
              Instructor
            </label>
          </div>
        </div>
      </div>
      <button className='btn btn-primary' onClick={handleRegister}>
        Register
      </button>
    </div>
  );
}

export default Register;