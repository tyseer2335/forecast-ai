// src/components/ChatWindow.tsx
import React, { useEffect, useRef, useState } from "react";
import ChatMessage from "./ChatMessage";
import SourcesContainer from "./SourcesContainer";
import AnswerDisplay from "./AnswerDisplay";
import { BiasColorToBiasNameMap, Chat } from "../hooks/types";
import { v4 as uuidv4 } from "uuid";
import { BiasColorToBooleanMap } from "../hooks/types";

/**
 * ChatWindow Component
 *
 * This component displays a scrollable chat window with chat messages, answer displays,
 * and a container for sources related to each chat message.
 *
 * Props:
 * - `chats`: An array of `Chat` objects representing individual chat entries. Each chat includes:
 *   - `query`: The user's query string.
 *   - `sources`: An array of sources linked to the chat response.
 *   - `answer`: The response to the user's query, if available.
 *   - `error`: Any error message related to the chat response.
 *   - `loading`: A boolean indicating whether the response is currently loading.
 *   - `status`: A status message associated with the chat processing state.
 *
 * Internal State:
 * - `biasVisibility`: A map defining visibility of bias color categories, used for filtering chat display elements by bias types.
 * - `biasColorToBiasNameMap`: A map to store bias names corresponding to specific colors, updating dynamically as components render.
 * - `renderStage`: Tracks stages in the rendering process, allowing components to use updated `biasColorToBiasNameMap` values at the appropriate time.
 *
 * Rendering Logic:
 * - Each `Chat` renders a `ChatMessage`, a `SourcesContainer`, and optionally an `AnswerDisplay` if an answer is available.
 * - Uses a scroll ref (`bottomRef`) to auto-scroll to the latest chat message.
 *
 * Usage:
 * Place `ChatWindow` within a parent container to display a live chat interface, passing an array of `Chat` objects as `chats`.
 *
 * Example:
 * ```jsx
 * <ChatWindow chats={chatData} />
 * ```
 *
 * @module ChatWindow
 */


type ChatWindowProps = {
  chats: Chat[];
};

const ChatWindow: React.FC<ChatWindowProps> = ({ chats }) => {
    
  const bottomRef = useRef<HTMLDivElement>(null);
  const [biasVisibility, setbiasVisibility] = useState<BiasColorToBooleanMap>({
    green: true,
    yellow: true,
    purple: true,
    red: true,
  });
  // make another state of type BiasColorToBiasNameMap
  var [biasColorToBiasNameMap, setBiasColorToBiasNameMap] = useState<BiasColorToBiasNameMap>({
    green: "",
    yellow: "",
    purple: "",
    red: "",
  });
  const [renderStage, setRenderStage] = useState(0);
  // Time Line of renderStage
  // 0: initial stage
  // 0 --> 1(exclusive): AnswerDisplay can be rendered with dummy biasColorVisiility
  // 1: AnswerDisplay rendered and biasColorToBiasNameMap updated
  // 1 --> 2(exclusive): SourceSection can use biasColorToBiasNameMap now(update local NamesDict )
  // 2: SourceSection is rendered with Visibility map ready to use.
  // 2 --> ...: AnswerDisplay listen to changes in biasVisibility continuously,
  //            SourceSection can stop listening to changes in biasVisibility

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  return (
    <div
      className="w-[80%] max-w-[1300px] h-full px-4 pt-4 bg-screen-black text-white space-y-[100px] flex flex-col overflow-y-auto"
      data-testid="chat-window"
    >
      {chats.map((chat) => (
        <div className="flex flex-col items-center space-y-4 max-h-[110%] sm:max-h-[125%] md:max-h-[150%]" key={uuidv4()}>
          <div ref={bottomRef} data-testid="bottom-ref" />
          <ChatMessage query={chat.query} data-testid="chat-message" />
          <SourcesContainer
            sources={chat.sources}
            error={chat.error}
            loading={chat.loading}
            status={chat.status}
            data-testid="sources-container"
            biasVisibility={biasVisibility}
            setbiasVisibility={setbiasVisibility}
            biasColorToBiasNameMap={biasColorToBiasNameMap}
            renderStage={renderStage}
            setRenderStage={setRenderStage}
          />
          {chat.answer && <AnswerDisplay query={chat.query} answer={chat.answer} biasVisibility={biasVisibility} setBiasColorToBiasNameMap={setBiasColorToBiasNameMap} renderStage={renderStage} setRenderStage={setRenderStage} />}
        </div>
      ))}
    </div>
  );
};

export default ChatWindow;
