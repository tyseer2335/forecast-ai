// src/components/HeaderBar.tsx
import React from "react";
import BookmarkButton from "../assets/bookmark-button.svg";
import ShareButton from "../assets/share-button.svg";

type HeaderBarProps = {
    title?: string;
}

const HeaderBar: React.FC<HeaderBarProps> = ({ title }) => {
  return (
    <header className="bg-screen-black text-header-bar-text px-6 py-6 w-full h-[8vh] flex items-center">
        {title && <h3 className="flex-grow font-bold text-center text-sm">{title}</h3>}
        <div className="flex justify-between items-center space-x-5 ml-auto">
            <button>
                <img src={BookmarkButton} alt="bookmark-btn" className="w-5 h-7" />
            </button>
            <button className="ml-auto bg-share-btn-bg py-2.5 px-3 flex space-x-1 justify-center items-center rounded-md hover:bg-share-btn-hover-bg">
                <img src={ShareButton} alt="export-btn" className="w-4 h-4" />
                <p className="text-share-btn-text font-bold text-sm">Share</p>
            </button>
            <button className="w-10 h-10 rounded-full">
                <img src="https://via.placeholder.com/150" alt="profile-pic" className="w-full h-full rounded-full" />
            </button>
        </div>
    </header>
  );
};

export default HeaderBar;