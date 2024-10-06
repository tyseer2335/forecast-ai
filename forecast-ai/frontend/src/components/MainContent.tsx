// src/components/MainContent.tsx
import React from "react";
import ChatWindow from "./ChatWindow";
import PromptBar from "./PromptBar";

const MainContent: React.FC = () => {
    return (
        <div className="w-full h-[92vh] bg-screen-black text-white px-60 py-7 space-y-6 flex flex-col justify-between">
            <ChatWindow />
            <PromptBar />
        </div>
    )
}

export default MainContent;