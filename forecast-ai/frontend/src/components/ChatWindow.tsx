// src/components/ChatWindow.tsx
import React, { useEffect, useRef, useState } from "react";
import ChatMessage from "./ChatMessage";
import SourcesContainer from "./SourcesContainer";
import AnswerDisplay from "./AnswerDisplay";
import { v4 as uuidv4 } from "uuid";
import { Chat, BiasColor } from "../hooks/types";


type ChatWindowProps = {
  chats: Chat[];
};

const ChatWindow: React.FC<ChatWindowProps> = ({ chats }) => {
    
  const bottomRef = useRef<HTMLDivElement>(null);
  const [visibleBiasColor, setVisibleBiasColor] = useState<BiasColor>("green");

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
            visibleBiasColor={visibleBiasColor}
            setVisibleBiasColor={setVisibleBiasColor}
          />
          {chat.answer && <AnswerDisplay query={chat.query} answer={chat.answer} visibleBiasColor={visibleBiasColor} />}
        </div>
      ))}
    </div>
  );
};

export default ChatWindow;
