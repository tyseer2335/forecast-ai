// src/components/HeaderBar.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import BookmarkButton from "../assets/bookmark-button.svg";
import ShareButton from "../assets/share-button.svg";
import { useNavigate } from "react-router-dom";

/**
 * HeaderBar Component
 *
 * This component displays a header bar containing:
 * - An optional title centered in the header.
 * - Buttons for bookmarking, sharing the chat, accessing the user's profile.
 * - The user profile button can also be used for logging out the account.
 * - A server status indicator to show whether the server is up, down, or in a loading state.
 *
 * @component
 *
 * Props:
 * - `title` (optional): A string representing the title to be displayed in the header.
 *
 * State:
 * - `serverStatus`: Indicates the server status, which can be "up", "down", or "loading".
 *
 * Behavior:
 * - Fetches the server status on component mount.
 * - Updates the server status indicator based on the API response.
 * - Shows a loading indicator, a green indicator if the server is up, or a red indicator if the server is down.
 *
 * @returns {JSX.Element} The HeaderBar component with title, buttons, and server status.
 */


type HeaderBarProps = {
    title?: string;
    userId: string;
    chatId: string | null;
}

const HeaderBar: React.FC<HeaderBarProps> = ({ title, userId, chatId }) => {
  const [serverStatus, setServerStatus] = useState<"up" | "down" | "loading">("loading");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // state for dropdown visibility
  const [shareableLink, setShareableLink] = useState(""); // state for shareable link
  const [isShareButtonClicked, setIsShareButtonClicked] = useState(false); // state for share button click
  const navigate = useNavigate();

  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/`);
        if (response.status === 200 && response.data.status === "Server is running") {
          setServerStatus("up");
        } else {
          setServerStatus("down");
        }
      } catch (error) {
        setServerStatus("down");
      }
    };

    checkServerStatus();
  }, []);

  const handleProfileClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    navigate("/logout");
  };

  const handleChatShare = async () => {
    try {
      
      // Retrieve token from local storage
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("User is not authenticated");
      console.log("Auth Token:", token);

      // Send POST request with query ID
      if (!process.env.REACT_APP_BACKEND_URL) {
        throw new Error("REACT_APP_BACKEND_URL is not defined");
      }
      
      // Add the auth token to request
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/share_chat/share?user_id=${userId}&chat_id=${chatId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Response:", response.data);

      if (response.status === 200) {
        // Extract the chat_hash from the response
        const chatRefHash = response.data.chat_ref_hash;
        const shareableLink = `${window.location.origin}/view-only/${chatRefHash}`;
        console.log("Shareable Link:", shareableLink);
        setShareableLink(shareableLink);
      }
    } catch (error) {
      console.error("Error sharing chat:", error);
    }
    
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareableLink);
  }

  return (
    <header className="bg-screen-black text-header-bar-text px-6 py-6 w-full h-[8vh] flex items-center">
        {title && <h3 className="flex-grow font-bold text-center text-[8px] sm:text-[10px] md:text-xs xl:text-sm">{title}</h3>}
        <div className="flex justify-between items-center space-x-5 ml-auto">
            {/* <button>
                <img src={BookmarkButton} alt="bookmark-btn" className="w-4 h-5 lg:w-4 lg:h-6 xl:w-5 xl:h-7" />
            </button> */}
            {/* ShareButton */}
            {/* If chatId is null, the share button is disabled */}
            {!chatId ? (
              <button className="ml-auto bg-share-btn-bg py-2.5 px-3 flex space-x-1 justify-center items-center rounded-md opacity-50 cursor-not-allowed">
                <img src={ShareButton} alt="export-btn" className="w-3 h-3 xl:w-4 xl:h-4" />
                <p className="text-share-btn-text font-bold text-xs xl:text-sm">Share</p>
              </button>
            ) 
            : (
              <button className="ml-auto bg-share-btn-bg py-2.5 px-3 flex space-x-1 justify-center items-center rounded-md hover:bg-share-btn-hover-bg"
              onClick={
                () => {
                  setIsShareButtonClicked(true);
                  handleChatShare();
                }
              }
                >
                <img src={ShareButton} alt="export-btn" className="w-3 h-3 xl:w-4 xl:h-4" />
                <p className="text-share-btn-text font-bold text-xs xl:text-sm">Share</p>
              </button>
            )}
            {/* Profile button */}
            <button
              onClick={handleProfileClick}
              className="w-10 h-10 rounded-full relative"
            >
              <img
                src="https://via.placeholder.com/150"
                alt="profile-pic"
                className="w-full h-full rounded-full"
              />

              {/* Profile dropdown */}
                {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-screen-black border border-gray-700 text-header-bar-text rounded-lg shadow-lg z-20">
                  <button
                    onClick={handleLogout}
                    className="w-full py-2 px-4 text-center hover:bg-gray-700"
                  >
                    Logout
                  </button>
                </div>
                )}
            </button>
            <div className="ml-4">
                {serverStatus === "loading" ? (
                  <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                ) : serverStatus === "up" ? (
                  <div className="w-4 h-4 rounded-full bg-green-500"></div>
                ) : (
                  <div className="w-4 h-4 rounded-full bg-red-500"></div>
                )}
            </div>
        </div>
        {/* Popup if isShareButtonClicked */}
        {isShareButtonClicked && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20"
          data-testid="settings-panel"
        >
          <div className="bg-[#282C2C] p-6 rounded-lg w-[400px] relative">
            <h2 className="text-xl font-bold mb-4">Settings</h2>

            {/* Close Button */}
            <button
              onClick={() => setIsShareButtonClicked(false)}
              className="absolute top-2 right-2 text-light-grey text-lg"
              data-testid="close-settings-button"
            >
              &times; {/* Close icon (×) */}
            </button>

            {/* Display shareable link created and a button next to it when clicked, copy the link */}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={shareableLink}
                readOnly
                className="w-full bg-[#333333] text-light-grey p-2 rounded-md"
              />
              <button
                onClick={
                  () => {
                    copyToClipboard();
                    setIsShareButtonClicked(false);
                  }
                }
                className="bg-[#4CAF50] text-white px-4 py-2 rounded-md"
              >
                Copy
              </button>
            </div>

            
          </div>
        </div>
      )}
    </header>
  );
};


export default HeaderBar;