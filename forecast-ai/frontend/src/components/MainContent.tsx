// src/components/MainContent.tsx
import React from "react";
import ChatWindow from "./ChatWindow";
import PromptBar from "./PromptBar";
import { Answer, Chat, SourceObject, GlobalMetrics } from "../hooks/types";

/**
 * MainContent Component
 * 
 * The MainContent component serves as the primary layout for the chat interface,
 * encompassing the ChatWindow (for displaying conversation history) and PromptBar
 * (for inputting new queries). It orchestrates interactions between the user and 
 * backend data by handling queries, responses, and displaying messages within 
 * the chat UI.
 * 
 * Props:
 * - `chats`: Array of chat data, representing past user queries and responses.
 * - `setChatTitle`: Function to set the title of the chat session.
 * - `saveChatToDB`: Function to save the chat session data to the database.
 * - `addQuery`: Function to add the user's query to the chat data.
 * - `addSources`: Function to add source data returned from the backend.
 * - `addAnswer`: Function to store the answer or response from the backend.
 * - `addError`: Function to handle and display error messages within the chat.
 * - `toggleLoading`: Function to manage loading states during API requests.
 * - `addStatus`: Function to display real-time status updates from the backend.
 * 
 * UI:
 * - Displays a `ChatWindow` component to show the history of user and system messages.
 * - Contains a `PromptBar` component for user input and managing advanced query options.
 * - Adjusts layout to fit most screen sizes, providing a consistent user experience.
 */


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
    addGlobalMetrics: (globalMetrics: GlobalMetrics) => void;
};

const MainContent: React.FC<MainContentProps> = ({ chats, setChatTitle, saveChatToDB, addQuery, addSources, addAnswer, addError, toggleLoading, addStatus, addGlobalMetrics }) => {
    return (
        <div className="w-full h-[92vh] bg-screen-black text-white pb-7 space-y-6 flex flex-col justify-between items-center">
            <ChatWindow chats={chats} />
            <PromptBar chats={chats} setChatTitle={setChatTitle} saveChatToDB={saveChatToDB} addQuery={addQuery} addSources={addSources} addAnswer={addAnswer} addError={addError} toggleLoading={toggleLoading} addStatus={addStatus} addGlobalMetrics={addGlobalMetrics} />
        </div>
    )
}

export default MainContent;