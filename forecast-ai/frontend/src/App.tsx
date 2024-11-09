import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Logout from './components/Logout';
import MainContainer from './components/MainContainer';
import RequestPasswordReset from './components/RequestPasswordReset';
import ResetPassword from './components/ResetPassword'; 
import HandleAction from './components/HandleAction'; 
import LearnMore from './components/LearnMore';
import { auth } from './components/firebase';
import { onAuthStateChanged } from 'firebase/auth';


const App: React.FC = () => {
  // Auth Check: Set up a listener to check the authentication state
  if (!localStorage.getItem("userId") && window.location.pathname == '/') {
    window.location.href = '/login';
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/" element={<MainContainer/>} />
        <Route path="/recover-password" element={<RequestPasswordReset />} />
        <Route path="/handle-action" element={<HandleAction />} /> 
        <Route path="/reset-password" element={<ResetPassword />} /> 
        <Route path="/learn-more" element={<LearnMore />} />
      </Routes>
    </Router>
  );
};

export default App;
