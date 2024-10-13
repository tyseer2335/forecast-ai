// src/components/ChatWindow.tsx
import React, { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";
import SourcesContainer from "./SourcesContainer";
import {Message, isSourceObjectArray } from "../hooks/types";

type ChatWindowProps = {
    messages: Message[];
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages }) => {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="w-full h-[95%] p-4 bg-screen-black text-white space-y-[100px] flex flex-col overflow-y-auto">
            <div className="flex flex-col space-y-4 h-[95%]">
            {
                messages.map((message, index) => {
                    if (typeof message.content === 'string') {
                        return <ChatMessage query={message.content} />;
                    } else if (isSourceObjectArray(message.content)) {
                        return <SourcesContainer sources={message.content} />;
                    }
                })
            }
            <div ref={bottomRef} />
            </div>

        </div>
    )
}

export default ChatWindow;