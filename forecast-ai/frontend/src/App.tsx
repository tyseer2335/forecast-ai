// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import MainContainer from './components/MainContainer';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainContainer />}/>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
};

export default App;