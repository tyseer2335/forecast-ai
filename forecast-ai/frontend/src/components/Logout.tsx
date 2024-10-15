// src/components/Logout.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
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
