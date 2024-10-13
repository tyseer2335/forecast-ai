// src/components/ChatWindow.tsx
import React, { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";
import SourcesContainer from "./SourcesContainer";
import { Chat, Message, SourceObject, dummySources, isSourceObjectArray } from "../hooks/types";
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
        for (const message of messages) { // (Irene) Want to refactor this
            if (typeof message.content === 'string' && message.sender === 'user') {
                queries.push(message.content);
            } else if (message.sender === 'ai' && isSourceObjectArray(message.content)) {
                console.log("source object", message.content);
                // Type is = [ [Source1, Source2], [Source3, Source4], [Source5, Source6] ]
                // message.content = [Source1, Source2]
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
                        return <ChatMessage key={index} query={message.content} />;
                    } else if (isSourceObjectArray(message.content)) {
                        return <SourcesContainer key={index} sources={dummySources} />;
                    }
                })
            }

        </div>
    )
}

export default ChatWindow;