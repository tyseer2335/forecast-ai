// src/components/MainContent.tsx
import React from "react";
import ChatWindow from "./ChatWindow";
import PromptBar from "./PromptBar";
import { Chat, Source } from "./MainContainer";

type MainContentProps = {
    chats: Chat[];
    addQuery: (query: string) => void;
    addSources: (sources: Source[]) => void;
    addError: (error: string) => void;
    toggleLoading: (loading: boolean) => void;
}

const MainContent: React.FC<MainContentProps> = ({ chats, addQuery, addSources, addError, toggleLoading }) => {
    return (
        <div className="w-full h-[92vh] bg-screen-black text-white px-60 py-7 space-y-6 flex flex-col justify-between">
            <ChatWindow chats={chats} />
            <PromptBar addQuery={addQuery} addSources={addSources} addError={addError} toggleLoading={toggleLoading} />
        </div>
    )
}

export default MainContent;