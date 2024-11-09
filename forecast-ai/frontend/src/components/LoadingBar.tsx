// src/components/LoadingBar.tsx
import React from "react";
import "../css/loading-bar-custom-css.css";

type LoadingBarProps = {
    status: string | undefined;
}

const LoadingBar: React.FC<LoadingBarProps> = ({ status }) => {
    return (
        <div className="h-[604px] flex flex-col items-center justify-center">
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-mid-light-grey h-12 w-12 mb-4"></div>
            <h2 className="text-center text-chat-message-text text-lg font-semibold">{status || 'Loading...'}</h2>
            <p className="w-1/3 text-center text-chat-message-text">This may take a few minutes, please don't close this page.</p>
        </div>
    )
}

export default LoadingBar;