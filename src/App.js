import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Protected from './components/Protected';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Response from './pages/Response';
import UsersList from './pages/UsersList';
import UsersDetail from './pages/UsersDetail';
import ClassList from './pages/ClassList';
import ClassDetail from './pages/ClassDetail';

function App() {
  return (
    <div className='flex w-full h-screen'>
      <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/home" element={<Protected Component={Home} />} />
            <Route path="/profile/:user_id" element={<Protected Component={Profile} />} />
            <Route path="/users" element={<Protected Component={UsersList} />} />
            <Route path="/users/:id/edit" element={<Protected Component={UsersDetail} />} />
            <Route path="/response" element={<Protected Component={Response} />} />
            <Route path="/class" element={<Protected Component={ClassList} />} />
            <Route path="/class/:id/edit" element={<Protected Component={ClassDetail} />} />
          </Routes>
      </Router>
    </div>
  );
}

export default App;