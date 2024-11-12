// src/components/ChatWindow.tsx
import React, { useEffect, useRef, useState } from "react";
import ChatMessage from "./ChatMessage";
import SourcesContainer from "./SourcesContainer";
import AnswerDisplay from "./AnswerDisplay";
import { Chat } from "../hooks/types";
import { v4 as uuidv4 } from "uuid";
import { BiasToBooleanMap } from "../hooks/types";

type ChatWindowProps = {
  chats: Chat[];
};

const ChatWindow: React.FC<ChatWindowProps> = ({ chats }) => {
    
  const bottomRef = useRef<HTMLDivElement>(null);
  const [biasVisibility, setbiasVisibility] = useState<BiasToBooleanMap>({
    green: true,
    yellow: true,
    purple: true,
    red: true,
  });

  const [biasIsDetectedMap, setBiasIsDetectedMap] = useState<BiasToBooleanMap>({
    // green: false,
  //   yellow: false,
  //   purple: false,
  //   red: false,
  // });
    green: true,
    yellow: true,
    purple: true,
    red: true,
  });

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
            biasIsDetectedMap={biasIsDetectedMap}
          />
          {chat.answer && <AnswerDisplay query={chat.query} answer={chat.answer} biasVisibility={biasVisibility} setBiasIsDetectedMap={setBiasIsDetectedMap} />}
        </div>
      ))}
    </div>
  );
};

export default ChatWindow;
