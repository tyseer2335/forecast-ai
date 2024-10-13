// src/components/MainContent.tsx
import React from "react";
import ChatWindow from "./ChatWindow";
import PromptBar from "./PromptBar";
import { Chat } from "../hooks/types";

type MainContentProps = {
    chats: Chat[];
    addQuery: (query: string) => void;
}

const MainContent: React.FC<MainContentProps> = ({ chats, addQuery }) => {
    return (
        <div className="w-full h-[92vh] bg-screen-black text-white px-60 py-7 space-y-6 flex flex-col justify-between">
            <ChatWindow chats={chats} />
            <PromptBar addQuery={addQuery} />
        </div>
    )
}

export default MainContent;