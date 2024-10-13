// src/components/MainContent.tsx
import React from "react";
import ChatWindow from "./ChatWindow";
import PromptBar from "./PromptBar";
import { Message } from "../hooks/types";

type MainContentProps = {
    messages: Message[];
    addQuery: (query: string) => void;
}

const MainContent: React.FC<MainContentProps> = ({ messages, addQuery }) => {
    return (
        <div className="w-full h-[92vh] bg-screen-black text-white px-60 py-7 space-y-6 flex flex-col justify-between">
            <ChatWindow messages={messages} />
            <PromptBar addQuery={addQuery} />
        </div>
    )
}

export default MainContent;