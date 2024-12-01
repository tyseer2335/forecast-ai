// src/components/ViewOnlyMainContent.tsx
import React from "react";
import ChatWindow from "./ChatWindow";
import { Chat } from "../hooks/types";


/**
 * ViewOnlyMainContent Component
 * 
 * The ViewOnlyMainContent component displays the main content of the chat interface
 * in a read-only mode, allowing users to view shared chat sessions without the ability
 * to interact or send messages. It includes the ChatWindow component to display chat
 * history and messages, providing a seamless viewing experience for shared chat links.
 * 
 * Props:
 * - `chats`: Array of chat data, representing past user queries and responses.
 * 
 * UI:
 * - Displays a `ChatWindow` component to show the history of user and system messages.
 * - Adjusts layout to fit most screen sizes, providing a consistent user experience.
 * - Disables user input and interaction, allowing only read-only access to chat content.
 */

type ViewOnlyMainContentProps = {
    chats: Chat[];
};

const ViewOnlyMainContent: React.FC<ViewOnlyMainContentProps> = ({ chats }) => {
    return (
        <div className="w-full h-[92vh] bg-screen-black text-white pb-7 space-y-6 flex flex-col justify-between items-center">
            <ChatWindow chats={chats} />
        </div>
    )
}

export default ViewOnlyMainContent;