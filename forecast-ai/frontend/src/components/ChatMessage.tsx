// src/components/ChatMessage.tsx
import React from "react";

/**
 * ChatMessage Component
 *
 * This component renders a single chat message from the user within a styled message bubble.
 *
 * Props:
 * - `query`: The user's query string, displayed as the main content of the chat message.
 *
 * Styling:
 * - The component uses responsive text and padding classes to adjust for different screen sizes.
 * - The message bubble has a rounded and bold style, positioned to the right to signify user messages.
 *
 * Example:
 * ```jsx
 * <ChatMessage query="What is the weather today?" />
 * ```
 *
 * @module ChatMessage
 */


/**
 * Type definition for the props used in the ChatMessage component.
 * 
 * @interface ChatMessageProps
 * @property {string} query - The user's query string to be displayed in the message bubble.
 */
type ChatMessageProps = {
    query: string;
}

/**
 * ChatMessage Component
 *
 * This component renders a single chat message from the user within a styled message bubble.
 *
 * @component
 * @example
 * ```jsx
 * <ChatMessage query="What is the weather today?" />
 * ```
 * @param {ChatMessageProps} props - The props for the component, including the user's query string.
 * @returns {React.Element} A div element containing the formatted chat message.
 * 
 * Styling:
 * - The component uses responsive text and padding classes to adjust for different screen sizes.
 * - The message bubble has a rounded and bold style, positioned to the right to signify user messages.
 */
const ChatMessage: React.FC<ChatMessageProps> = ({ query }) => {
    return (
        <div className="bg-mid-dark-grey text-chat-message-text text-[8px] sm:text-[10px] md:text-xs xl:text-sm font-bold px-4 sm:px-6 py-2 sm:py-3 md:py-4 xl:py-5 rounded-full max-w-[60%] ml-auto">
            {query}
        </div>
    )
}

export default ChatMessage;