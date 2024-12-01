// src/components/ViewOnlyMainContainer.tsx
import React, { useState } from "react";
import ViewOnlyHeaderBar from "./ViewOnlyHeaderBar";
import ViewOnlyMainContent from "./ViewOnlyMainContent";
import { Chat } from "../hooks/types";
import { doc, getDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { DocumentReference, DocumentData } from "@firebase/firestore";
import { useEffect } from "react";
import axios from "axios";

/**
 * ViewOnlyMainContainer Component
 * 
 * This component is used when a user wants to view a shared chat by the link with chatRefHash embedded in the URL.
 * We purposefully do not allow the user to interact with the chat, only view the chat messages.
 * 
 * @component
 * 
 * State and Props:
 * - `chats` (Chat[]): Manages chat history and messages.
 * - `chatTitle` (string): Stores the title of the shared chat.
 * 
 * Functions:
 * - `fetchChatRef`: Fetches the chat reference from Firestore using the chatRefHash.
 * - `fetchChatDoc`: Fetches the chat document from Firestore using the chat reference.
 * 
 * Render:
 * - Integrates `ViewOnlyHeaderBar` and `ViewOnlyMainContent` components to structure
 *  the application layout and display chat messages.
 * 
 * @returns {JSX.Element} The rendered ViewOnlyMainContainer component layout.
 */

const ViewOnlyMainContainer: React.FC = () => {
  // Similar to MainContainer, but for viewing shared chat
  // This component is used when a user wants to view a shared chat by the link with chatRefHash

  const db = getFirestore();
  const [chats, setChats] = useState<Chat[]>([]);
  const [chatTitle, setChatTitle] = useState<string>("Shared Chat");

  // Fetch the chat reference from Firestore using the chatRefHash
  const fetchChatRef = async () => {
    
    // 1. Get the chatRefHash from the URL: /view/<chatRefHash>
    const chatRefHash = window.location.pathname.split("/").pop();

    // 2. Use backend API to get the chat document from the chatRefHash 
    try {

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/share_chat/view?chat_ref_hash=${chatRefHash}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Response:", response.data);

      if (response.status === 200) {
        // Assume chatRefStr is in the format: `Users/${userId}/Chats/${chatId}`
        const chatRef = doc(db, "Users", response.data.user_id, "Chats", response.data.chat_id);
        // const chatRef : DocumentReference<DocumentData, DocumentData> = doc(db, "Users", userId, "Chats", chatId);
        fetchChatDoc(chatRef);
      }
    } catch (error) {
      console.error("Error fetching chat reference:", error);
    }
  };

  // Fetch the chat document from Firestore using the chat reference
  const fetchChatDoc = async (chatRef: DocumentReference) => {
    // 1. chatRef --> chatDoc
    const chatDoc = await getDoc(chatRef);
    if (!chatDoc.exists()) {
      console.error("Chat document does not exist.");
      return;
    }

    // 2. Data Extraction (Title, Messages)
    const data = chatDoc.data();
    setChatTitle(data.title);
    const messages = data.messages;

    // 3. Convert the messages array to chats array as discussed
    var tempChats: Chat[] = [];
    var tempChat = { query: "", sources: [], answer: undefined, loading: false };
    for (let i = 0; i < messages.length; i++) {
      if (messages[i].sender === "user") {
        tempChat.query = messages[i].content;
      } else {
        tempChat.sources = messages[i].content.sources;
        tempChat.answer = messages[i].content.answer;
        tempChats.push(tempChat);
        tempChat = { query: "", sources: [], answer: undefined, loading: false };
      }
    }
    setChats(tempChats);
  };

  useEffect(() => {
    fetchChatRef();
  }, []);
    

  return (
    <div className="min-h-screen h-screen w-screen flex bg-screen-black text-white font-inter">
    {/* <Sidebar newChatId={chatId} /> */}
    <div className="flex flex-col flex-grow">
      <ViewOnlyHeaderBar title={chatTitle} />
      <ViewOnlyMainContent chats={chats} />
        </div>
      </div>
    );

}

export default ViewOnlyMainContainer;
