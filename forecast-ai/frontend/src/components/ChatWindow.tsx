// src/components/ChatWindow.tsx
import React, { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";
import SourcesContainer from "./SourcesContainer";
import { Chat, Message, SourceObject, isSourceObjectArray } from "../hooks/types";
import { useState } from "react";

type ChatWindowProps = {
    messages: Message[];
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages }) => {
    const [queries, setQueries] = useState<string[]>([]);
    const [sources, setSources] = useState<SourceObject[][]>([]);
    const [chats, setChats] = useState<Chat[]>([]);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });

        // Divide messages into queries and sources
        const queries: string[] = [];
        var sources: SourceObject[][] = [];
        for (const message of messages) {
            if (typeof message.content === 'string' && message.sender === 'user') {
                queries.push(message.content);
            } else if (message.sender === 'ai' && isSourceObjectArray(message.content)) {
                console.log("source object", message.content);
                sources.push(message.content);
            }
        }
        setQueries(queries);
        setSources(sources);
    }, [messages]);

    return (
        <div className="w-full h-[95%] p-4 bg-screen-black text-white space-y-[100px] flex flex-col overflow-y-auto">
            {
                messages.map((message, index) => {
                    if (typeof message.content === 'string') {
                        return <ChatMessage query={message.content} />;
                    } else if (isSourceObjectArray(message.content)) {
                        return <SourcesContainer sources={message.content} />;
                    }
                })
            }

        </div>
    )
}

export default ChatWindow;