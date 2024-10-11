import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, query, orderBy, onSnapshot } from 'firebase/firestore'; 
import OwlLogo from '../assets/owl.svg';
import SettingsLogo from '../assets/settings.svg';
import { auth } from './firebase';

const Sidebar: React.FC = () => {
  const db = getFirestore();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [chats, setChats] = useState<any[]>([]);
  const navigate = useNavigate();
  const userId = auth.currentUser?.uid;
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }

    const q = query(collection(db, 'Users', userId, 'Chats'), orderBy('updated_at', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const chatList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setChats(chatList);
    });

    const savedChatId = localStorage.getItem('selectedChatId');
    if (savedChatId) {
      setSelectedChatId(savedChatId);
    }

    return () => unsubscribe();
  }, [userId, navigate, db]);

  // Helper function to categorize chats by time period
  const categorizeChats = (chatList: any[]) => {
    const categories: {
      todayChats: any[],
      last7DaysChats: any[],
      last30DaysChats: any[],
      earlierChats: any[],
    } = {
      todayChats: [],
      last7DaysChats: [],
      last30DaysChats: [],
      earlierChats: [],
    };

    const now = new Date();
    const today = now.setHours(0, 0, 0, 0);
    const oneDay = 1000 * 60 * 60 * 24;
    const sevenDaysAgo = today - oneDay * 7;
    const thirtyDaysAgo = today - oneDay * 30;

    chatList.forEach((chat) => {
      console.log(chat);
      const updatedAtTime = chat.updated_at.toDate().getTime();

      if (updatedAtTime >= today) {
        categories.todayChats.push(chat);
      } else if (updatedAtTime >= sevenDaysAgo) {
        categories.last7DaysChats.push(chat);
      } else if (updatedAtTime >= thirtyDaysAgo) {
        categories.last30DaysChats.push(chat);
      } else {
        categories.earlierChats.push(chat);
      }
    });

    return categories;
  };

  const { todayChats, last7DaysChats, last30DaysChats, earlierChats } = categorizeChats(chats);

  // Reusable component to display chat sections
  const ChatSection = ({ title, chatList }: { title: string; chatList: any[] }) => (
    <>
      {chatList.length > 0 && (
        <>
          <h3 className="p-1 text-sm text-light-grey mt-4">{title}</h3>
          {chatList.map((chat) => (
            <div
              key={chat.id}
              className={`p-2 hover:bg-button-hover rounded-md cursor-pointer ${chat.id === selectedChatId ? 'bg-button-hover font-bold' : ''}`} // Highlight selected chat
              onClick={() => handleChatClick(chat.id)}
            >
              {chat.title || `Chat ${chat.id}`}
            </div>
          ))}
        </>
      )}
    </>
  );

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const handleChatClick = (chatId: string) => {
    if (chatId === selectedChatId) {
      setSelectedChatId(null);
      localStorage.removeItem('selectedChatId');
      return;
    }
    setSelectedChatId(chatId);
    localStorage.setItem('selectedChatId', chatId);
    // navigate(`/chat/${chatId}`); TODO: Not sure how chat page is implemented -- Will be tested later
  };

  return (
    <div className="bg-sidebar-bg text-[#B0B1AF] h-screen flex flex-col justify-between w-1/5 min-w-[250px]">
      {/* Logo and program title */}
      <div className="flex items-center justify-between p-4 fixed top-0 left-0 z-10">
        <div className="flex items-center">
          <img src={OwlLogo} alt="logo" className="w-8 h-8" />
          <span className="text-2xl ps-2 text-light-grey font-light">forecastAI</span>
        </div>
      </div>

      {/* Chat history */}
      <div className="overflow-y-auto mt-16 px-4 pb-20">
        <ChatSection title="Today" chatList={todayChats} />
        <ChatSection title="Previous 7 days" chatList={last7DaysChats} />
        <ChatSection title="Previous 30 days" chatList={last30DaysChats} />
        <ChatSection title="Earlier" chatList={earlierChats} />
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
            <h2 className="text-xl font-bold mb-4">Settings</h2>
            <button
              onClick={toggleSettings}
              className="absolute top-2 right-2">
              {/* Settings content */}
            </button>
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
      )}
    </div>
  );
};

export default Sidebar;
