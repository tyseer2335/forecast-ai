// src/components/Logout.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase';

/**
 * Logout Component
 * 
 * This component handles the logout process by clearing session and local storage,
 * signing out the user from Firebase authentication, and redirecting them to the login page.
 * 
 * @component
 * 
 * Hooks:
 * - `useNavigate`: Used to redirect the user to the login page after sign-out.
 * - `useEffect`: Clears storage and signs out the user when the component mounts.
 * 
 * Side Effects:
 * - Clears session and local storage to remove any saved user data.
 * - Signs out the user from Firebase authentication.
 * - Redirects the user to the login page upon logout.
 * 
 * Render:
 * - Displays a logout message on the screen while the process completes.
 * 
 * @returns {JSX.Element} A message indicating the user is being logged out.
 */


const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    sessionStorage.clear();
    localStorage.clear();
    auth.signOut();

    navigate('/login');
  }, [navigate]);

  return (
    <div className="h-screen bg-screen-black flex justify-center items-center">
      <p className="text-white">Logging out...</p>
    </div>
  );
};

export default Logout;
