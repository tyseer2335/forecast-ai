// src/components/LoadingBar.tsx
import React from "react";
import "../css/loading-bar-custom-css.css";

type LoadingBarProps = {
    status: string | undefined;
}

const LoadingBar: React.FC<LoadingBarProps> = ({ status }) => {
    return (
        <div className="w-full flex flex-col items-center justify-center">
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-mid-light-grey h-7 w-7 md:h-8 md:w-8 lg:h-10 lg:w-10 xl:h-12 xl:w-12 mb-4"></div>
            <h2 className="text-center text-chat-message-text text-sm md:text-sm lg:text-base xl:text-lg font-semibold">{status || 'Loading...'}</h2>
            <p className="w-1/3 text-center text-chat-message-text text-[10px] md:text-xs lg:text-sm xl:text-base">This may take a few seconds, please don't close this page.</p>
        </div>
    )
}

export default LoadingBar;