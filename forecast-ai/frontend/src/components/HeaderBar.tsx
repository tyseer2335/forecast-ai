// src/components/HeaderBar.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import BookmarkButton from "../assets/bookmark-button.svg";
import ShareButton from "../assets/share-button.svg";

type HeaderBarProps = {
    title?: string;
}

const HeaderBar: React.FC<HeaderBarProps> = ({ title }) => {
  const [serverStatus, setServerStatus] = useState<"up" | "down" | "loading">("loading");

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

  return (
    <header className="bg-screen-black text-header-bar-text px-6 py-6 w-full h-[8vh] flex items-center">
        {title && <h3 className="flex-grow font-bold text-center text-[8px] sm:text-[10px] md:text-xs xl:text-sm">{title}</h3>}
        <div className="flex justify-between items-center space-x-5 ml-auto">
            <button>
                <img src={BookmarkButton} alt="bookmark-btn" className="w-4 h-5 lg:w-4 lg:h-6 xl:w-5 xl:h-7" />
            </button>
            <button className="ml-auto bg-share-btn-bg py-2.5 px-3 flex space-x-1 justify-center items-center rounded-md hover:bg-share-btn-hover-bg">
                <img src={ShareButton} alt="export-btn" className="w-3 h-3 xl:w-4 xl:h-4" />
                <p className="text-share-btn-text font-bold text-xs xl:text-sm">Share</p>
            </button>
            <button className="w-8 h-8 lg:w-9 lg:h-9 xl:w-10 xl:h-10 rounded-full">
                <img src="https://via.placeholder.com/150" alt="profile-pic" className="w-full h-full rounded-full" />
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
    </header>
  );
};

export default HeaderBar;