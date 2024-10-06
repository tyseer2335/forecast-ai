// src/components/Sidebar.tsx
import React, { useState } from 'react';
import OwlLogo from '../assets/owl.svg';
import SettingsLogo from '../assets/settings.svg';

const Sidebar: React.FC = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  return (
    <div className="bg-sidebar-bg text-[#B0B1AF] h-screen flex flex-col justify-between w-1/5 min-w-[250px]">
       
      {/* Logo and program title */}
      <div className="flex items-center justify-between p-4 fixed top-0 left-0 z-10">
        <div className="flex items-center">
        <div className="flex items-center space-x-4">
          <img src={OwlLogo} alt="logo" className="w-8 h-8" />
        </div>
          <span className="text-2xl ps-2 text-light-grey font-light">forecastAI</span>
        </div>
      </div>

      {/* Chat history */}
      <div className="overflow-y-auto mt-16 px-4 pb-20">
        {/* Placeholder for 'Today' */}
        <h3 className="p-1 text-sm text-light-grey mt-4">Today</h3>
        <div >
          <div className="p-2 hover:bg-button-hover rounded-md cursor-pointer">Chat 1</div>
          <div className="p-2 hover:bg-button-hover rounded-md cursor-pointer">Chat 2</div>
        </div>

        {/* Placeholder for 'Previous 7 days(This Week)' */}
        <h3 className="p-1 text-sm text-light-grey mt-4">Previous 7 days</h3>
        <div >
          <div className="p-2 hover:bg-button-hover rounded-md cursor-pointer">Chat 1</div>
          <div className="p-2 hover:bg-button-hover rounded-md cursor-pointer">Chat 2</div>
        </div>

        {/* Placeholder for 'Previous 30 days(This Month)' */}
        <h3 className="p-1 text-sm text-light-grey mt-4">Previous 30 days</h3>
        <div >
          <div className="p-2 hover:bg-button-hover rounded-md cursor-pointer">Chat 1</div>
          <div className="p-2 hover:bg-button-hover rounded-md cursor-pointer">Chat 2</div>
        </div>
        
        {/* Placeholder for 'Earlier'*/}
        <h3 className="p-1 text-sm text-light-grey mt-4">Earlier</h3>
        <div >
          <div className="p-2 hover:bg-button-hover rounded-md cursor-pointer">Chat 1</div>
          <div className="p-2 hover:bg-button-hover rounded-md cursor-pointer">Chat 2</div>
        </div>
        
      </div>

      {/* Settings button */}
      <div className="fixed bottom-0 left-0 p-4 flex justify-between items-center z-10">
        <button
          onClick={toggleSettings}
          className="flex items-center hover:bg-button-hover p-2 rounded-md"
        >
          <img src={SettingsLogo} alt="settings" className="w-7 h-7" /> 
          
          <span className="px-2 text-light-grey">Settings</span>
        </button>
      </div>

      {/* Popup settings panel (conditionally rendered) */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
          <div className="bg-[#282C2C] p-6 rounded-lg w-[400px]">
            <div>
              <h2 className="text-xl font-bold mb-4">Settings</h2>
              <button
                onClick={toggleSettings}
                className="absolute top-2 right-2">

                </button>
            
            {/* Settings content goes here! */}

            {/* Bottom right "Press ENTER to apply" text */}
            <p className="text-right bottom-2 right-2 italic text-[#9A9A9A] text-sm"
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        toggleSettings();
                    }
                }
            }
            >
                Press ENTER to apply
            </p>
          </div>
        </div>
      </div>
      )
      }
    </div>
  );
};

export default Sidebar;
