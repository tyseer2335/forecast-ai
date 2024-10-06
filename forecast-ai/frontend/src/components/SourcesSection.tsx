// src/components/SourcesSection.tsx
import React from "react";
import ScrollLeftButton from "../assets/scroll-left-button.svg";
import ScrollRightButton from "../assets/scroll-right-button.svg";
import SourceCard from "./SourceCard";

const SourcesSection: React.FC = () => {
    return (
        <div className="w-full flex-grow space-y-4 bg-screen-black flex flex-col h-[90%] relative">
            <h1 className="font-bold text-chat-message-text text-xl">Sources</h1>
            <SourceCard />
            <button className="absolute left-0 top-1/2">
                <img src={ScrollLeftButton} alt="scroll-left-btn" className="w-5 h-5" />
            </button>
            <button className="absolute right-0 top-1/2">
                <img src={ScrollRightButton} alt="scroll-left-btn" className="w-6 h-6" />
            </button>
        </div>
    )
}

export default SourcesSection;