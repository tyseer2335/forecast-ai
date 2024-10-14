// src/components/ChatMessage.tsx
import React from "react";

type ChatMessageProps = {
    query: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ query }) => {
    return (
        <div className="bg-mid-dark-grey text-chat-message-text font-bold px-6 py-5 rounded-full max-w-[60%] ml-auto">
            {query}
        </div>
    )
}

export default ChatMessage;