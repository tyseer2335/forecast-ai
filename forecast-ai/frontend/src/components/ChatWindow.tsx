// src/components/ChatWindow.tsx
import React, { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";
import SourcesContainer from "./SourcesContainer";
import { Chat } from "./MainContainer";

type ChatWindowProps = {
    chats: Chat[];
}

const ChatWindow: React.FC<ChatWindowProps> = ({ chats }) => {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chats]);

    return (
        <div className="w-full h-[95%] p-4 bg-screen-black text-white space-y-[100px] flex flex-col overflow-y-auto">
            {chats.map(chat => (
                <div className="flex flex-col space-y-4 h-[95%]">
                    <div ref={bottomRef} />
                    <ChatMessage query={chat.query} />
                    <SourcesContainer sources={chat.sources} error={chat.error} loading={chat.loading} />
                </div>
            ))}
        </div>
    )
}

export default ChatWindow;