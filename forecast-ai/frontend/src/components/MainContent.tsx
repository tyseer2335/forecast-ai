// src/components/MainContent.tsx
import React from "react";
import ChatWindow from "./ChatWindow";
import PromptBar from "./PromptBar";
import { Answer, Chat, SourceObject } from "../hooks/types";

type MainContentProps = {
    chats: Chat[];
    setChatTitle: React.Dispatch<React.SetStateAction<string>>
    saveChatToDB: (chat: Chat) => void;
    addQuery: (query: string) => void;
    addSources: (sources: SourceObject[]) => void;
    addAnswer: (answer: Answer) => void;
    addError: (error: string) => void;
    toggleLoading: (loading: boolean) => void;
    addStatus: (status: string) => void;
}

const MainContent: React.FC<MainContentProps> = ({ chats, setChatTitle, saveChatToDB, addQuery, addSources, addAnswer, addError, toggleLoading, addStatus }) => {
    return (
        <div className="w-full h-[92vh] bg-screen-black text-white pb-7 space-y-6 flex flex-col justify-between items-center">
            <ChatWindow chats={chats} />
            <PromptBar chats={chats} setChatTitle={setChatTitle} saveChatToDB={saveChatToDB} addQuery={addQuery} addSources={addSources} addAnswer={addAnswer} addError={addError} toggleLoading={toggleLoading} addStatus={addStatus} />
        </div>
    )
}

export default MainContent;