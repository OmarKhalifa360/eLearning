import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import CourseList from './components/CourseList';
import CourseDetail from './components/CourseDetail';
import CourseCreate from './components/CourseCreate';
import PrivateRoute from './components/PrivateRoute';
import Chat from './components/Chat';
import QuizCreate from './components/QuizCreate';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/dashboard' element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path='/courses' element={<CourseList />} />
        <Route path='/course/:id' element={<CourseDetail />} />
        <Route path='/courses/create' element={<PrivateRoute><CourseCreate /></PrivateRoute>}/>
        <Route path='/courses/:id/quizzes/create' element={<PrivateRoute><QuizCreate /></PrivateRoute>}/>
        <Route path='/chat/:roomName' element={<PrivateRoute><Chat /></PrivateRoute>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;