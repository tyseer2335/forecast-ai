// src/components/ChatWindow.tsx
import React, { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";
import SourcesContainer from "./SourcesContainer";
import {Chat } from "../hooks/types";

type ChatWindowProps = {
    chats: Chat[];
}

const ChatWindow: React.FC<ChatWindowProps> = ({ chats }) => {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chats]);

    return (
        <div className="w-full h-full px-4 pt-4 bg-screen-black text-white space-y-[100px] flex flex-col overflow-y-auto" data-testid="chat-window">
            {chats.map(chat => (
                <div className="flex flex-col space-y-4 h-full">
                    <div ref={bottomRef} data-testid="bottom-ref"/>
                    <ChatMessage query={chat.query} data-testid="chat-message" />
                    <SourcesContainer sources={chat.sources} data-testid="sources-container" />
                </div>
            ))}
        </div>
    )
}

export default ChatWindow;