// src/components/Sidebar.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, query, orderBy, getDocs } from 'firebase/firestore'; 
import OwlLogo from '../assets/owl.svg';
import SettingsLogo from '../assets/settings.svg';
import { auth } from './firebase';

const Sidebar: React.FC = () => {
  const db = getFirestore();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [chats, setChats] = useState<any[]>([]);
  const navigate = useNavigate();
  const userId = auth.currentUser?.uid;

  

  // Fetch chats on component mount
  useEffect(() => {
    const fetchChats = async () => {
      if (!userId) {
        navigate('/login');
        return;
      }
      const q = query(collection(db, 'Users', userId, 'Chats'), orderBy('updatedAt', 'desc'));
      const querySnapshot = await getDocs(q);

      const chatList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setChats(chatList);
    };

    fetchChats();
  }, []);

  // Helper function to categorize chats by time period
  const categorizeChats = (chatList: any[]) => {
    const todayChats: any[] = [];
    const last7DaysChats: any[] = [];
    const last30DaysChats: any[] = [];
    const earlierChats: any[] = [];

    const now = new Date();
    const today = now.setHours(0, 0, 0, 0);
    const oneDay = 1000 * 60 * 60 * 24;
    const sevenDaysAgo = today - oneDay * 7;
    const thirtyDaysAgo = today - oneDay * 30;

    chatList.forEach((chat) => {
      const updatedAt = chat.updatedAt.toDate(); // Convert Firestore timestamp to JS Date
      const updatedAtTime = updatedAt.getTime();

      if (updatedAtTime >= today) {
        todayChats.push(chat);
      } else if (updatedAtTime >= sevenDaysAgo) {
        last7DaysChats.push(chat);
      } else if (updatedAtTime >= thirtyDaysAgo) {
        last30DaysChats.push(chat);
      } else {
        earlierChats.push(chat);
      }
    });

    return { todayChats, last7DaysChats, last30DaysChats, earlierChats };
  };

  const { todayChats, last7DaysChats, last30DaysChats, earlierChats } = categorizeChats(chats);

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
        {/* Today */}
        {todayChats.length > 0 && (
          <>
            <h3 className="p-1 text-sm text-light-grey mt-4">Today</h3>
            {todayChats.map((chat) => (
              <div key={chat.id} className="p-2 hover:bg-button-hover rounded-md cursor-pointer">
                {chat.name || `Chat ${chat.id}`}
              </div>
            ))}
          </>
        )}

        {/* Previous 7 days */}
        {last7DaysChats.length > 0 && (
          <>
            <h3 className="p-1 text-sm text-light-grey mt-4">Previous 7 days</h3>
            {last7DaysChats.map((chat) => (
              <div key={chat.id} className="p-2 hover:bg-button-hover rounded-md cursor-pointer">
                {chat.name || `Chat ${chat.id}`}
              </div>
            ))}
          </>
        )}

        {/* Previous 30 days */}
        {last30DaysChats.length > 0 && (
          <>
            <h3 className="p-1 text-sm text-light-grey mt-4">Previous 30 days</h3>
            {last30DaysChats.map((chat) => (
              <div key={chat.id} className="p-2 hover:bg-button-hover rounded-md cursor-pointer">
                {chat.name || `Chat ${chat.id}`}
              </div>
            ))}
          </>
        )}

        {/* Earlier */}
        {earlierChats.length > 0 && (
          <>
            <h3 className="p-1 text-sm text-light-grey mt-4">Earlier</h3>
            {earlierChats.map((chat) => (
              <div key={chat.id} className="p-2 hover:bg-button-hover rounded-md cursor-pointer">
                {chat.name || `Chat ${chat.id}`}
              </div>
            ))}
          </>
        )}
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

      {/* Popup settings panel */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
          <div className="bg-[#282C2C] p-6 rounded-lg w-[400px]">
            <div>
              <h2 className="text-xl font-bold mb-4">Settings</h2>
              <button
                onClick={toggleSettings}
                className="absolute top-2 right-2">
              </button>

            {/* Settings content goes here */}
            <p className="text-right bottom-2 right-2 italic text-[#9A9A9A] text-sm"
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        toggleSettings();
                    }
                }}
            >
                Press ENTER to apply
            </p>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default Sidebar;
