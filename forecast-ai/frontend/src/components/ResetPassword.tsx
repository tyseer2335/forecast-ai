import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, NavLink } from 'react-router-dom';
import { confirmPasswordReset } from 'firebase/auth';
import { auth } from './firebase';
import zxcvbn from 'zxcvbn'; // Password strength checking 
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid'; // Import the icons

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const oobCode = searchParams.get('oobCode'); // Get the password reset code from URL

  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0); // Track password strength
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  // Redirect if no oobCode is present
  useEffect(() => {
    if (!oobCode) {
      setError('Error: Invalid or missing password reset code. Redirecting...');
      setTimeout(() => {
        navigate('/login'); // Redirect to signup after 3 seconds
      }, 3000);
    }
  }, [oobCode, navigate]);

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle password input and check its strength
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const passwordValue = e.target.value;
    setPassword(passwordValue);

    // Check password strength using zxcvbn
    const strengthResult = zxcvbn(passwordValue);
    setPasswordStrength(strengthResult.score); // Score is between 0 and 4
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    // Ensure the passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Ensure the password strength is good
    if (passwordStrength < 3) {
      setError('Password is too weak! Please choose a stronger password.');
      return;
    }

    // Proceed with resetting the password
    try {
      await confirmPasswordReset(auth, oobCode!, password);
      setMessage('Password has been reset successfully. You can now log in.');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      setError('Failed to reset password. Please try again.');
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-screen-black flex items-center justify-center font-inter">
      <div className="flex flex-col items-center space-y-6 w-1/3">

        {/* Page Title */}
        <h1 className="text-3xl text-light-grey font-light text-center">Reset Password</h1>

        {/* Form to Enter New Password */}
        {oobCode ? (
          <form className="flex flex-col space-y-4 w-full" onSubmit={handlePasswordReset}>
            <div className="relative w-full">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter new password"
                value={password}
                onChange={handlePasswordChange}
                className="text-input-mobile px-4 py-3 input-fields-mobile bg-mid-dark-grey text-mid-light-grey rounded-2xl focus:outline-none w-full input-mobile"
                required
              />
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

            <div className="relative w-full">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="text-input-mobile px-4 py-3 input-fields-mobile bg-mid-dark-grey text-mid-light-grey rounded-2xl focus:outline-none w-full input-mobile"
                required
              />
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

            {/* Display Success or Error Message */}
            {message && <div className="text-green-600 text-sm text-center">{message}</div>}
            {error && <div className="text-red-600 text-sm text-center">{error}</div>}

            {/* Submit Button */}
            <button
              type="submit"
              className="send-reset-email-btn signup-login-button-mobile font-bold text-white border border-white rounded-3xl transition-transform duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              Reset Password
            </button>
          </form>
        ) : (
          // Show error message if no oobCode or invalid access
          <div className="text-red-600 text-center">
            {error || 'Invalid access. Redirecting...'}
          </div>
        )}

        {/* Back to Login Link */}
        {message && (
          <p className="text-base font-light text-light-grey mt-4 text-center">
            <NavLink to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
              Back to Login
            </NavLink>
          </p>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
