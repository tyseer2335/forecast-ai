// src/components/ChatWindow.tsx
import React from "react";
import ChatMessage from "./ChatMessage";
import SourcesSection from "./SourcesSection";

const ChatWindow: React.FC = () => {
    return (
        <div className="w-full h-[95%] p-4 bg-screen-black text-white space-y-[100px] flex flex-col overflow-y-scroll">
            <div className="flex flex-col space-y-4 h-[95%]">
                <ChatMessage />
                <SourcesSection />
            </div>
            <div className="flex flex-col space-y-4 h-[95%]">
                <ChatMessage />
                <SourcesSection />
            </div>
        </div>
    )
}

export default ChatWindow;