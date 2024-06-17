import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Users from './pages/Users';
import Response from './pages/Response';
import Protected from './components/Protected';
import UsersDetail from './pages/Users_Detail';
// import { AuthProvider } from './components/AuthContext';

function App() {
  return (
    <div className='flex w-full h-screen'>
      <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/home" element={<Protected Component={Home} />} />
            <Route path="/profile" element={<Protected Component={Profile} />} />
            <Route path="/users" element={<Protected Component={Users} />} />
            <Route path="/response" element={<Protected Component={Response} />} />
            <Route path="/users/:id/edit" element={<Protected Component={UsersDetail} />} />
          </Routes>
      </Router>
    </div>
  );
}

export default App;