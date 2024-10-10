import React, { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';
import { useNavigate, NavLink } from 'react-router-dom'; 
import "../css/login-custom-css.css"; // Custom CSS File for responsiveness 

// Icons
import OwlLogo from '../assets/owl.svg';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  // States to confirm and set password.
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [passwordError, setPasswordError] = useState(''); // State for error
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [confirmPasswordPlaceholder, setConfirmPasswordPlaceholder] = useState('Confirm Password'); // Placeholder state

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Update placeholder based on screen size
  const handleResize = () => {
    if (window.innerWidth <= 640) {
      setConfirmPasswordPlaceholder('Confirm');
    } else {
      setConfirmPasswordPlaceholder('Confirm Password');
    }
  };

  useEffect(() => {
    // Set the initial placeholder based on window size
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if the passwords match
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match!');
      console.log('Fail: Passwords do not match'); // Log "Fail" when passwords don't match
      return;
    }

    // If passwords match, proceed with Firebase signup
    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        console.log('Success: User signed up successfully'); // Log "Success" when signup is successful
        navigate('/');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        
        // Check if the error is due to email already in use
        if (errorCode === 'auth/email-already-in-use') {
          setPasswordError('User already exists.'); // Set custom error message
        } else {
          setPasswordError('Signup failed. Please try again.');
        }

        console.log('Fail: Signup failed', errorCode, errorMessage); // Log "Fail" if Firebase signup fails
      });
  };

  return (
    <div className="min-h-screen bg-screen-black flex items-center justify-center font-inter">
      <div className="flex flex-col items-center space-y-6 w-1/3">
        
        {/* Logo and Title */}
        <div className="flex items-center space-x-4 center-mobile">
          <img src={OwlLogo} alt="logo" className="w-12 h-12" />
          <h1 className="text-3xl text-title-light-grey font-light">forecastAI</h1>
        </div>

        {/* Input Fields */}
        <div className="flex flex-col space-y-4 w-full">
          <input
            id="email-address"
            name="email"
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="text-input-mobile px-4 py-3 input-fields-mobile bg-mid-dark-grey text-mid-light-grey rounded-2xl focus:outline-none w-full input-mobile"
          />
          {/* Password Field with Toggle Visibility */}
          <div className="relative w-full">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-input-mobile px-4 py-3 input-fields-mobile bg-mid-dark-grey text-mid-light-grey rounded-2xl focus:outline-none w-full input-mobile"
            />
            {/* Toggle Button (Show/Hide Password) */}
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" aria-hidden="true" />
              ) : (
                <EyeIcon className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>

          {/* Confirm Password Field with Dynamic Placeholder */}
          <div className="relative w-full">
            <input
              id="confirm-password"
              name="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              required
              placeholder={confirmPasswordPlaceholder} // Use the state for dynamic placeholder
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="text-input-mobile px-4 py-3 pr-10 input-fields-mobile bg-mid-dark-grey text-mid-light-grey rounded-2xl focus:outline-none w-full input-mobile confirm-placeholder"
            />
            {/* Toggle Button for Confirm Password */}
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" aria-hidden="true" />
              ) : (
                <EyeIcon className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Password Error Message */}
        {passwordError && (
          <div className="text-red-600 text-sm text-center">{passwordError}</div>
        )}

        {/* Signup Button */}
        <button
          type="submit"
          onClick={onSubmit}
          className="px-4 py-2 signup-login-button-mobile font-bold text-white border border-white rounded-3xl transition-transform duration-300 transform hover:scale-105 hover:shadow-lg"
        >
          Sign up
        </button>

        {/* Sign In Link */}
        <p className="text-base font-light text-title-light-grey mt-4">
          Already have an account?{' '}
          <NavLink
            to="/login"
            className="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            Sign in
          </NavLink>
        </p>
      </div>
    </div>
  );
};

export default Signup;
