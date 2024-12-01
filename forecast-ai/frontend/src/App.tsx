import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Logout from './components/Logout';
import MainContainer from './components/MainContainer';
import ViewOnlyMainContainer from './components/ViewOnlyMainContainer';
import RequestPasswordReset from './components/RequestPasswordReset';
import ResetPassword from './components/ResetPassword'; 
import HandleAction from './components/HandleAction'; 
import LearnMore from './components/LearnMore';
import { auth } from './components/firebase';
import { onAuthStateChanged } from 'firebase/auth';

/**
 * App Component
 *
 * The main entry point for the application, setting up routing and handling authentication state.
 *
 * Key Features:
 * - **Auth Check**: Redirects users to the login page if they are not authenticated and try to access the main app route (`/`).
 * - **Router Setup**: Defines the main routes within the application, using `react-router-dom` for client-side routing.
 * - **Routes**:
 *   - `/login`: Renders the `Login` component for user sign-in.
 *   - `/signup`: Renders the `Signup` component for user account creation.
 *   - `/logout`: Renders the `Logout` component, which logs the user out and redirects to the login page.
 *   - `/`: Renders the `MainContainer` component, the main app content, accessible only after authentication.
 *   - `/recover-password`: Renders the `RequestPasswordReset` component to initiate password reset.
 *   - `/handle-action`: Renders the `HandleAction` component to handle Firebase actions such as email verification.
 *   - `/reset-password`: Renders the `ResetPassword` component for users to set a new password after a reset.
 *   - `/learn-more`: Renders the `LearnMore` component with information about the application.
 *
 * The component listens for authentication state changes to update the UI or trigger navigation based on user authentication status.
 */


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

        {/* When a user wants to use chatHash to view the shared chat by the link */}
        <Route path="/view-only/:chatRefHash" element={<ViewOnlyMainContainer />} />
      </Routes>
    </Router>
  );
};

export default App;
