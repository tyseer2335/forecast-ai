import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; 
import { applyActionCode } from "firebase/auth";  
import { auth } from "./firebase";

const HandleAction: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  // Parse the URL query parameters to get the action `mode` and `oobCode`
  const queryParams = new URLSearchParams(location.search);
  const mode = queryParams.get('mode'); // The action mode (resetPassword, verifyEmail, etc.)
  const oobCode = queryParams.get('oobCode'); // The Firebase action code

  useEffect(() => {
    // If `mode` or `oobCode` is missing, show an error message or redirect
    if (!mode || !oobCode) {
      setMessage('Invalid or missing parameters. Redirecting...');
      setTimeout(() => {
        navigate('/login'); // Redirect to login page
      }, 3000); // 3-second delay before redirect
      return;
    }

    // Handle the action based on the mode
    switch (mode) {
      case 'resetPassword':
        navigate(`/reset-password?oobCode=${oobCode}`);
        break;
      case 'verifyEmail':
        handleEmailVerification(oobCode);
        break;
      default:
        setMessage('Unknown action mode');
    }
  }, [mode, oobCode, navigate]);

  // Handle email verification
  const handleEmailVerification = async (code: string) => {
    try { 
      await applyActionCode(auth, code);
      // Insert email verification logic here
      setMessage('Email successfully verified! Redirecting to sign in...');
      setTimeout(() => {
        navigate('/login'); // Redirect to login after verification
      }, 3000);
    } catch (error) { 
      console.log('Failed to verify email. Please try again.')
    }
  };

  return (
    <div className="min-h-screen bg-screen-black flex items-center justify-center font-inter">
      <div className="flex flex-col items-center space-y-6 w-1/3">
        <h2 className="text-3xl text-light-grey font-light text-center">Processing your request...</h2>
        {message && (
          <p className="text-base font-light text-light-grey text-center">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default HandleAction;
