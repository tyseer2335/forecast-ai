import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";
import OwlLogo from "../assets/owl.svg";
import SettingsLogo from "../assets/settings.svg";
import DeleteIcon from "../assets/close-menu-button.svg";
import CollapseIcon from "../assets/close-menu-button.svg";

/**
 * Sidebar component that displays a list of chat sessions, categorized by time period, with options to start a new chat session, delete existing chats, and access settings.
 *
 * Props:
 * - `newChatId`: (optional) If provided, triggers the selection of a new chat session by its ID.
 *
 * State:
 * - `isSettingsOpen`: Boolean indicating whether the settings panel is open.
 * - `chats`: Array of chat objects fetched from Firestore, organized by time periods (today, last 7 days, etc.).
 * - `selectedChatId`: Currently selected chat session ID.
 * - `hoveredChatId`: ID of the chat currently hovered over, used to display delete options.
 * - `deletingChatId`: ID of the chat being deleted, if any.
 * - `deletingChatTitle`: Title of the chat being deleted, if any.
 *
 * Functionality:
 * - `categorizeChats`: Helper function to group chat sessions by time period for better organization.
 * - `NewChatSessionButton`: Renders a button to start a new chat session.
 * - `ChatSession`: Renders individual chat sessions in the sidebar.
 * - `DeleteChatButton`: Provides an option to delete chat sessions with a confirmation dialog.
 * - `toggleSettings`: Opens/closes the settings panel.
 * - `handleChatClick`: Updates the selected chat session, refreshing the UI.
 *
 * Firebase:
 * - Fetches chat data for the logged-in user, organized by last update timestamp.
 * - Enables real-time updates on chat data via Firestore onSnapshot listener.
 *
 * UI:
 * - The component is styled to fit within a sidebar, supporting responsive design.
 * - Conditional rendering is used to display dialogs for settings and chat deletion.
 * - Uses images and icons for a visually enhanced layout (e.g., settings and delete icons).
 *
 * Note: Redirects to the login page if `userId` is not found in local storage.
 */

type SidebarProps = {
  newChatId: string | null;
};

const Sidebar: React.FC<SidebarProps> = ({ newChatId }) => {
  const db = getFirestore();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [chats, setChats] = useState<any[]>([]);
  const navigate = useNavigate();
  // Add collapsed state
  const [isCollapsed, setIsCollapsed] = useState(false);

  var userId: string = localStorage.getItem("userId") || "";
  if (!userId) {
    window.location.href = "/login";
    return null;
  }
  var [selectedChatId, setSelectedChatId] = useState<string>(
    sessionStorage.getItem("selectedChatId") ?? ""
  );
  var [hoveredChatId, setHoveredChatId] = useState<string>("");
  var [deletingChatId, setDeletingChatId] = useState<string>("");
  var [deletingChatTitle, setDeletingChatTitle] = useState<string>("");

  useEffect(() => {
    if (newChatId) {
      selectChatSession(newChatId);
    }
  }, [newChatId]);

  useEffect(() => {
    const q = query(
      collection(db, "Users", userId, "Chats"),
      orderBy("updated_at", "desc")
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const chatList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setChats(chatList);
    });

    const savedChatId = sessionStorage.getItem("selectedChatId");
    if (savedChatId) {
      selectChatSession(savedChatId);
    }

    return () => {
      if (unsubscribe && typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [userId, navigate, db]);

  // Helper function to categorize chats by time period
  const categorizeChats = (chatList: any[]) => {
    const categories: {
      todayChats: any[];
      last7DaysChats: any[];
      last30DaysChats: any[];
      earlierChats: any[];
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

  const { todayChats, last7DaysChats, last30DaysChats, earlierChats } =
    categorizeChats(chats);

  // A New Chat Session Button
  const NewChatSessionButton = () => (
    <div
      className={`p-2 hover:bg-button-hover rounded-md text-[10px] md:text-xs xl:text-sm cursor-pointer ${
        !selectedChatId ? "bg-button-hover font-bold" : ""
      }`}
      onClick={() => handleChatClick("")}
      data-testid="new-chat-session-button"
    >
      New Chat
    </div>
  );

  const handleChatDelete = async (chatId: string) => {
    if (!userId) {
      return;
    }

    try {
      await deleteDoc(doc(db, "Users", userId, "Chats", chatId));
    } catch (error) {
      alert(
        `Error deleting chat(ref: Users/${userId}/Chats/${chatId}): ${error}`
      );
    }

    // If the chat is selected, then open a new chat session
    if (chatId === selectedChatId) {
      selectChatSession("");
    } else {
      setHoveredChatId("");
    }
    setDeletingChatInfo({ chatId: "", chatTitle: "" });

    navigate("/");
  };

  const setDeletingChatInfo = (chatInfo: any) => {
    setDeletingChatId(chatInfo.chatId);
    setDeletingChatTitle(chatInfo.chatTitle);
  };

  // Note chatId is a struct { chatId: string }
  const DeleteChatButton = (chatId: any) => (
    <div className="flex bg-button-hover rounded-md cursor-pointer">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setDeletingChatInfo(chatId);
        }}
        className="p-2 hover:bg-button-hover rounded-md cursor-pointer"
      >
        <img
          src={DeleteIcon}
          alt="delete"
          className="min-w-[8px] min-h-[8px]"
        />
      </button>
    </div>
  );

  // Individual chat session
  const ChatSession = ({ chat }: { chat: any }) => (
    <div
      key={chat.id}
      className={`p-2 hover:bg-button-hover rounded-md cursor-pointer flex justify-between items-center ${
        chat.id === selectedChatId ? "bg-button-hover font-bold" : ""
      }`}
      onClick={() => handleChatClick(chat.id)}
      onMouseEnter={() => setHoveredChatId(chat.id)}
      onMouseLeave={() => setHoveredChatId("")}
      data-testid={`chat-session-${chat.id}`}
    >
      <span className="text-[10px] md:text-xs xl:text-sm 2xl:text-[14px]">
        {chat.title || `Chat ${chat.id}`}
      </span>
      {(hoveredChatId === chat.id || selectedChatId === chat.id) && (
        <DeleteChatButton
          chatId={chat.id}
          chatTitle={chat.title || `Chat ${chat.id}`}
        />
      )}
    </div>
  );

  // Sub List of previous chat sessions by time period
  const PrevChatSubList = ({
    period,
    chatList,
  }: {
    period: string;
    chatList: any[];
  }) => (
    <>
      {chatList.length > 0 && (
        <>
          <h3 className="p-1 text-[10px] md:text-xs xl:text-sm text-light-grey mt-4 font-bold">
            {period}
          </h3>
          {chatList.map((chat) => (
            <ChatSession chat={chat} />
          ))}
        </>
      )}
    </>
  );

  // A function triggered when the user clicks on a chat session
  const selectChatSession = (chatId: string) => {
    setSelectedChatId(chatId);
    sessionStorage.setItem("selectedChatId", chatId);
    setHoveredChatId("");
  };

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
    navigate("/");
  };

  return (
    <div
      className={`bg-sidebar-bg text-light-grey h-full flex flex-col justify-between transition-all duration-300 ease-in-out
    ${
      isCollapsed
        ? "w-20 min-w-[60px]"
        : "w-full sm:w-1/4 sm:max-w-[300px] sm:min-w-[170px]"
    }`}
    >
      {/* Logo and program title */}
      <div className="flex items-center p-4 fixed top-0 left-0 z-10 w-full">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center hover:bg-button-hover rounded-md p-2 transition-all"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <img
            src={OwlLogo}
            alt="logo"
            className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8"
            data-testid="logo"
          />
          {!isCollapsed && (
            <span
              className="text-base sm:text-xl md:text-2xl pl-2 text-light-grey font-light"
              data-testid="program-title"
            >
              forecastAI
            </span>
          )}
        </button>
      </div>

      {/* Chat Sessions - hide when collapsed */}
      <div
        className={`overflow-y-auto mt-16 px-4 pb-20 pt-3 ${
          isCollapsed ? "hidden" : ""
        }`}
        data-testid="chat-sessions"
      >
        <NewChatSessionButton />
        <PrevChatSubList period="Today" chatList={todayChats} />
        <PrevChatSubList period="Previous 7 days" chatList={last7DaysChats} />
        <PrevChatSubList period="Previous 30 days" chatList={last30DaysChats} />
        <PrevChatSubList period="Earlier" chatList={earlierChats} />
      </div>

      {/* Settings button - hide when collapsed */}
      {!isCollapsed && (
        <div className="fixed bottom-0 left-0 p-4 flex justify-between items-center z-10 w-full">
          <button
            onClick={toggleSettings}
            className="flex items-center hover:bg-button-hover p-2 rounded-md"
            data-testid="settings-button"
          >
            <img
              src={SettingsLogo}
              alt="settings"
              className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7"
            />
            <span className="px-2 text-light-grey text-xs sm:text-sm md:text-base">
              Settings
            </span>
          </button>
        </div>
      )}

      {/* Delete Chat Modal */}
      {deletingChatId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
          <div className="bg-[#282C2C] p-6 rounded-lg w-[90%] max-w-sm">
            <h2 className="text-lg font-bold mb-4">Delete Chat?</h2>
            <p className="text-light-grey">
              Are you sure you want to delete this chat?
            </p>
            <p className="text-light-grey font-bold">{deletingChatTitle}</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={() =>
                  setDeletingChatInfo({ chatId: "", chatTitle: "" })
                }
                className="bg-button-hover p-2 rounded-md mr-2"
              >
                Cancel
              </button>
              <button
                onClick={() => handleChatDelete(deletingChatId)}
                className="bg-red-500 p-2 rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20"
          data-testid="settings-panel"
        >
          <div className="bg-[#282C2C] p-6 rounded-lg w-[90%] max-w-sm relative">
            <h2 className="text-lg font-bold mb-4">Settings</h2>
            <button
              onClick={toggleSettings}
              className="absolute top-2 right-2 text-light-grey text-lg"
              data-testid="close-settings-button"
            >
              &times;
            </button>
            <p
              className="text-right bottom-2 right-2 italic text-[#9A9A9A] text-sm"
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
