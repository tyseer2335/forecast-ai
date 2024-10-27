// src/components/ChatWindow.tsx
import React, { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";
import SourcesContainer from "./SourcesContainer";
import AnswerDisplay from "./AnswerDisplay";
import { Chat } from "../hooks/types";

type ChatWindowProps = {
  chats: Chat[];
};

const ChatWindow: React.FC<ChatWindowProps> = ({ chats }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  // Mock data for the answer
  const mockAnswer = {
    "Question ID": "IFP-1459",
    Question:
      "Will Goodluck Jonathan vacate the office of President of Nigeria before 10 June 2015?",
    "Forecaster ID": "007",
    "Forecaster Rationale":
      "By default, I assume that the incumbent will stay in power. Sifting through news for Nigeria is tough - there is sooo much coverage and I don't know the biases of each outlet.\n\nThis paper - the 6th most read, according to their banner - is very confident that he'll be re-elected.\n\nI will start aggressive and walk back if polls start to appear indicating that he has real competition.\n\nRight now, I'd put irreducible uncertainty at 8% (illness, scandal), but I don't have a very scientific rationale for that number.",
    Forecast: "8%",
    "Crowd forecast": "29%",
    "Ground truth label": "Yes",
    llm_features: {
      feature1_status_quo_bias: [
        0.95, 0.95, 0.95, 0.95, 0.95, 0.95, 0.95, 0.95, 0.95, 0.95, 0.95, 0.95,
        0.95, 0.95, 0.95, 0.95, 0.95, 0.95, 0.95, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      feature2_overconfidence_bias: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
    },
  };

  return (
    <div
      className="w-full h-full px-4 pt-4 bg-screen-black text-white space-y-[100px] flex flex-col overflow-y-auto"
      data-testid="chat-window"
    >
      {chats.map((chat) => (
        <div className="flex flex-col space-y-4 h-full" key={chat.query}>
          <div ref={bottomRef} data-testid="bottom-ref" />
          <ChatMessage query={chat.query} data-testid="chat-message" />
          <SourcesContainer
            sources={chat.sources}
            error={chat.error}
            loading={chat.loading}
            status={chat.status}
            data-testid="sources-container"
          />
          <AnswerDisplay answer={mockAnswer} />
        </div>
      ))}
    </div>
  );
};

export default ChatWindow;
