// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Sidebar from './components/Sidebar';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Pages with no sidebar */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Pages with sidebar */}
        <Route
          path="*"
          element={
            <>
              <Sidebar />
              <div className="flex-grow p-10">
                <Routes>
                  <Route path="/" element={<div>Home Page</div>} />
                  {/* Other pages here */}
                </Routes>
              </div>
            </>
          } 
        />
      </Routes>
    </Router>
  );
};

export default App;
