import React from 'react';
import { useNavigate } from 'react-router-dom';

const LearnMore: React.FC = () => {
  const navigate = useNavigate(); 

  return (
    <div className="min-h-screen bg-screen-black flex items-center justify-center font-inter">
      <div className="flex flex-col items-center space-y-6 w-1/3 text-center">
        <p className="text-mid-light-grey leading-relaxed text-lg">
          forecastAI was developed by the University of Toronto, Department of Computer Science
        </p>
        
        {/* Back Button */}
        <button
          onClick={() => navigate('/login')}
          className="mt-6 px-4 py-2 font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-3xl transition-transform duration-300 transform hover:scale-105"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default LearnMore;
