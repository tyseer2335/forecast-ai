// src/components/LoadingBar.tsx
import React from "react";
import "../css/loading-bar-custom-css.css";

/**
 * LoadingBar Component
 *
 * This component displays a loading indicator and a customizable status message.
 * The loader is a circular spinner that provides a visual cue to indicate loading progress, and an optional status message displays below the loader to inform the user about the current operation's state.
 *
 * @component
 * 
 * Props:
 * - `status` (string | undefined): Optional text to display as a status message; defaults to "Loading..." if not provided.
 *
 * Render:
 * - A circular loading spinner that uses custom CSS for animation.
 * - A status message displaying the `status` prop or "Loading..." by default.
 * - An additional message advising the user to keep the page open during loading.
 *
 * @returns {JSX.Element} A loading spinner with a status message.
 */


type LoadingBarProps = {
    status: string | undefined;
}

const LoadingBar: React.FC<LoadingBarProps> = ({ status }) => {
    return (
        <div className="w-full flex flex-col items-center justify-center">
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-mid-light-grey h-7 w-7 md:h-8 md:w-8 lg:h-10 lg:w-10 xl:h-12 xl:w-12 mb-4"></div>
            <h2 className="text-center text-chat-message-text text-sm md:text-sm lg:text-base xl:text-lg font-semibold">{status || 'Loading...'}</h2>
            <p className="w-1/3 text-center text-chat-message-text text-[10px] md:text-xs lg:text-sm xl:text-base">This may take a few minutes, please don't close this page.</p>
        </div>
    )
}

export default LoadingBar;