import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, query, orderBy, onSnapshot } from 'firebase/firestore'; 
import OwlLogo from '../assets/owl.svg';
import SettingsLogo from '../assets/settings.svg';
import { auth } from './firebase';
import OptionsIcon from '../assets/options-button.svg';
import { on } from 'events';
import { set } from 'date-fns';
import { doc, deleteDoc } from "firebase/firestore";
import { hover } from '@testing-library/user-event/dist/hover';


type SidebarProps = {
  newChatId: string | null;
}

const Sidebar: React.FC<SidebarProps> = ({ newChatId }) => {
  const db = getFirestore();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [chats, setChats] = useState<any[]>([]);
  const navigate = useNavigate();
  const userId = auth.currentUser?.uid;
  var [selectedChatId, setSelectedChatId] = useState<string>(localStorage.getItem('selectedChatId') ?? "");
  var [hoveredChatId, setHoveredChatId] = useState<string>("");
  var [editingChatId, setEditingChatId] = useState<string>("");

  useEffect(() => {
    if (newChatId) {
      selectChatSession(newChatId);
    }
  }, [newChatId]);

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
      selectChatSession(savedChatId);
    }

    return () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
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

  // A New Chat Session Button
  const NewChatSessionButton = () => (
    <div
      className={`p-2 hover:bg-button-hover rounded-md cursor-pointer ${!selectedChatId ? 'bg-button-hover font-bold' : ''}`}
      onClick={() => handleChatClick("")}
      data-testid="new-chat-session-button"
    >
      New Session
    </div>
  );

  const handleChatDelete = async (chatId: string) => {
    // Delete the chat
    // console.log("Delete chat with id:", chatId);
    // Now delete the chat from the firebase database (db)
    if (!userId) {
      return;
    }

    await deleteDoc(doc(db, "Users", userId, "Chats", chatId));

    // If the chat is selected, then clear the selectedChatId
    if (chatId === selectedChatId) {
      selectChatSession("");
    }
    
  }

  const handleChatRename = (chatId: string) => {
    // Rename the chat
  }

  const handleChatShare = (chatId: string) => {
    // Share the chat
  }

  const EditChatButton = (chatId: any) => (
    <div className="flex bg-button-hover rounded-md cursor-pointer">
      <button type="button">
        <img 
          src={OptionsIcon}
          alt="edit-btn"
          onClick={(e) => 
            {
              e.stopPropagation()
              setEditingChatId(chatId)
            }
          }
          />
      </button>
      {/* {editingChatId == chatId && <ChatEditMenu chatId={chatId} />} */}
    </div>
  );
  // Next Up:
  {/* TASK 1. For each chat session, if hovered or selected, then show an edit button - Done */}
  {/* TASK 2. When EditButton is clicked, show options block with options of Share, Delete, Rename at the right side of the options button like a small popup */}

  // For TASK 2, I'll just implement Delete for now
  const ChatEditMenu = ({ chatId }: { chatId: string }) => (
    <div className=" bg-[#282C2C] p-2 rounded-md absolute left-40">
      <button
        onClick={() => handleChatDelete(chatId)}
        className="p-1 hover:bg-button-hover rounded-md"
        data-testid="delete-chat-button"
      >
        x
      </button>
    </div>
  );

  // Individual chat session
  const ChatSession = ({ chat }: { chat: any }) => (
    <div
      key={chat.id}
      className={`p-2 hover:bg-button-hover rounded-md cursor-pointer flex justify-between ${chat.id === selectedChatId ? 'bg-button-hover font-bold' : ''}`}
      onClick={() => handleChatClick(chat.id)}
      onMouseEnter={() => setHoveredChatId(chat.id)}
      onMouseLeave={() => setHoveredChatId("")}
      data-testid={`chat-session-${chat.id}`}
    >
      <span>{chat.title || `Chat ${chat.id}`}</span> 
      {(hoveredChatId === chat.id || selectedChatId === chat.id) && <EditChatButton chatId={chat.id} />}
      {editingChatId == chat.id && <ChatEditMenu chatId={chat.id} />}
    </div>
    
  );

  // Sub List of previous chat sessions by time period
  const PrevChatSubList = ({ period, chatList }: { period: string; chatList: any[] }) => (
    <>
      {chatList.length > 0 && (
        <>
          <h3 className="p-1 text-sm text-light-grey mt-4">{period}</h3>
          {chatList.map((chat) => (
            <ChatSession chat={chat} />
          ))}
        </>
      )}
    </>
  );

  const selectChatSession = (chatId: string) => {
    setSelectedChatId(chatId);
    localStorage.setItem('selectedChatId', chatId);

    setHoveredChatId("");
    setEditingChatId("");
  }

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const handleChatClick = (chatId: string) => {
    if (chatId === selectedChatId) {
      selectChatSession("");
    } else {
      selectChatSession(chatId);
    }

    // Reloading the MainContainer component to refresh the selectedChatId
    navigate('/');
  };

  return (
    <div className="bg-sidebar-bg text-[#B0B1AF] h-screen flex flex-col justify-between w-1/5 min-w-[250px]">
      {/* Logo and program title */}
      <div className="flex items-center justify-between p-4 fixed top-0 left-0 z-10`"> 
        <div className="flex items-center">
          <img src={OwlLogo} alt="logo" className="w-8 h-8" data-testid="logo"/>
          <span className="text-2xl ps-2 text-light-grey font-light" data-testid="program-title">forecastAI</span>
        </div>
      </div>
      
      {/* Chat Sessions */}
      <div className="overflow-y-auto mt-16 px-4 pb-20 pt-3" data-testid="chat-sessions">
        <NewChatSessionButton />
        <PrevChatSubList period="Today" chatList={todayChats} />
        <PrevChatSubList period="Previous 7 days" chatList={last7DaysChats} />
        <PrevChatSubList period="Previous 30 days" chatList={last30DaysChats} />
        <PrevChatSubList period="Earlier" chatList={earlierChats} />
      </div>

      {/* Settings button */}
      <div className="fixed bottom-0 left-0 p-4 flex justify-between items-center z-10">
        <button
          onClick={toggleSettings}
          className="flex items-center hover:bg-button-hover p-2 rounded-md"
          data-testid="settings-button"
        >
          <img src={SettingsLogo} alt="settings" className="w-7 h-7" /> 
          <span className="px-2 text-light-grey">Settings</span>
        </button>
      </div>

      {/* Popup settings panel */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20"
          data-testid="settings-panel"
        >
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
