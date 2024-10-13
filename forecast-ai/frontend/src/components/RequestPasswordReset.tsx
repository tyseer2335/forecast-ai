import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from './firebase'; 
import { NavLink } from 'react-router-dom'; 
import "../css/responsive-custom-css.css";

const RequestPasswordReset: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(''); 
  const [error, setError] = useState(''); 

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();

    setMessage('');
    setError('');

    sendPasswordResetEmail(auth, email)
      .then(() => {
        setMessage('If email is correct, then password reset email sent! Please check your inbox.');
      })
      .catch((error) => {
        setError('Failed to send password reset email. Please try again.');
        console.error('Error:', error.message);
      });
  };

  return (
    <div className="min-h-screen bg-screen-black flex items-center justify-center font-inter">
      <div className="flex flex-col items-center space-y-6 w-1/3">
        {/* Page Title */}
        <h1 className="text-3xl text-title-light-grey font-light text-center">Recover Password</h1>

        {/* Form to Enter Email */}
        <form className="flex flex-col space-y-4 w-full" onSubmit={handlePasswordReset}>
          <input
            id="email-address"
            name="email"
            type="email"
            required
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="text-input-mobile px-4 py-3 input-fields-mobile bg-mid-dark-grey text-mid-light-grey rounded-2xl focus:outline-none w-full input-mobile"
          />

          {/* Display Success or Error Message */}
          {message && <div className="text-green-600 text-sm text-center">{message}</div>}
          {error && <div className="text-red-600 text-sm text-center">{error}</div>}

          {/* Submit Button */}
          <button
            type="submit"
            className="send-reset-email-btn signup-login-button-mobile font-bold text-white border border-white rounded-3xl transition-transform duration-300 transform hover:scale-105 hover:shadow-lg"
            >
            Send Reset Email
            </button>

        </form>

        {/* Back to Login Link */}
        <p className="text-base font-light text-title-light-grey mt-4 text-center">
          Remember your password?{' '}
          <NavLink
            to="/login"
            className="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            Login
          </NavLink>
        </p>
      </div>
    </div>
  );
};

export default RequestPasswordReset;
