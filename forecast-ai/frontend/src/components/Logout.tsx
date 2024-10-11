import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('selectedChatId');
    // localStorage.clear(); // Uncomment this if you want to clear all localStorage
    navigate('/login');
  }, [navigate]);

  return (
    <div className="h-screen bg-screen-black flex justify-center items-center">
      <p className="text-white">Logging out...</p>
    </div>
  );
};

export default Logout;
