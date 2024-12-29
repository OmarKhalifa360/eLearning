import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:8000/api/login/', {
        username,
        password,
      });
      localStorage.setItem('access_token', res.data.access);
      localStorage.setItem('refresh_token', res.data.refresh);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className='container mt-5'>
      <h2 className='mb-4'>Login</h2>
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
        <label className='form-label'>Password</label>
        <input
          type='password'
          className='form-control'
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button className='btn btn-primary' onClick={handleLogin}>
        Login
      </button>
      <p className='mt-3'>
        Don't have an account? <Link to='/register'>Register here</Link>
      </p>
    </div>
  );
}

export default Login;