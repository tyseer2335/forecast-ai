import React, { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from './firebase';
import { useNavigate, NavLink } from 'react-router-dom'; 
import { getFirestore, doc, setDoc } from "firebase/firestore"; // Firestore imports
import zxcvbn from 'zxcvbn'; // Password strength checking
import "../css/responsive-custom-css.css"; // Custom CSS File for responsiveness

// Icons
import OwlLogo from '../assets/owl.svg';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const db = getFirestore(); // Initialize Firestore
  const [email, setEmail] = useState('');

  // States to confirm and set password.
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [passwordError, setPasswordError] = useState(''); // State for error
  const [successMessage, setSuccessMessage] = useState(''); // State for success message
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [passwordStrength, setPasswordStrength] = useState(0); // State to track password strength
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

  // Handle password input and check its strength
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const passwordValue = e.target.value;
    setPassword(passwordValue);

    // Check password strength using zxcvbn
    const strengthResult = zxcvbn(passwordValue);
    setPasswordStrength(strengthResult.score); // Score is between 0 and 4
  };

  // Function to validate email format
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous messages
    setPasswordError('');
    setSuccessMessage('');

    // Validate email format
    if (!validateEmail(email)) {
      setPasswordError('Please enter a valid email address.');
      console.log('Fail: Invalid email format');
      return;
    }

    // Check if the passwords match
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match!');
      console.log('Fail: Passwords do not match');
      return;
    }

    // Check if password is strong enough (zxcvbn score of at least 3)
    if (passwordStrength < 3) {
      setPasswordError('Password is too weak! Please choose a stronger password.');
      console.log('Fail: Password is too weak');
      return;
    }

    // If everything is valid, proceed with Firebase signup
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Signed in
      const user = userCredential.user;
      console.log('Success: User signed up successfully');

      // Send email verification
      await sendEmailVerification(user);
      console.log('Email verification sent!');
      setSuccessMessage('Verification email sent. Please check your inbox.');

      // Create a document in the Users collection
      await setDoc(doc(db, 'Users', user.uid), {
          email: user.email,
          created_at: new Date(),
      });

      navigate("/login"); // Navigate to login after successful sign-up
    } catch (error) {
        const errorCode = (error as any).code;
        const errorMessage = (error as any).message;

        // Check if the error is due to email already in use
        if (errorCode === 'auth/email-already-in-use') {
          setPasswordError('User already exists');
        } else {
          setPasswordError('Signup failed. Please try again.');
        }

        console.log('Fail: Signup failed', errorCode, errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-screen-black flex items-center justify-center font-inter">
      <div className="flex flex-col items-center space-y-6 w-1/3">

        {/* Logo and Title */}
        <div className="flex items-center space-x-4 center-mobile">
          <img src={OwlLogo} alt="logo" className="w-12 h-12" />
          <h1 className="text-3xl text-light-grey font-light">forecastAI</h1>
        </div>

        {/* Input Fields */}
        <form className="flex flex-col space-y-4 w-full" onSubmit={onSubmit}>
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
              onChange={handlePasswordChange} // Handle password change and check strength
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
              placeholder={confirmPasswordPlaceholder}
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

          {/* Password Strength Meter */}
          {password && (
            <div className="text-sm text-gray-400 text-center">
              {passwordStrength === 0 && 'Very Weak'}
              {passwordStrength === 1 && 'Weak'}
              {passwordStrength === 2 && 'Fair'}
              {passwordStrength === 3 && 'Good'}
              {passwordStrength === 4 && 'Strong'}
            </div>
          )}

          {/* Password Error Message */}
          {passwordError && (
            <div className="text-red-600 text-sm text-center">{passwordError}</div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="text-green-600 text-sm text-center">{successMessage}</div>
          )}

          {/* Signup Button */}
          <button
            type="submit"
            className="px-4 py-2 signup-login-button-mobile font-bold text-white border border-white rounded-3xl transition-transform duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            Sign up
          </button>
        </form>

        {/* Sign In Link */}
        <p className="text-base font-light text-light-grey mt-4">
          Already have an account?{' '}
          <NavLink
            to="/login"
            className="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            Sign in
          </NavLink>
        </p>

        {/* Rest Password */}
        <p className="text-base font-light text-light-grey mt-4">
          {' '}
          <NavLink
            to="/recover-password"
            className="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            Forgot Password
          </NavLink>
        </p>
      </div>
    </div>
  );
};

export default Signup;
