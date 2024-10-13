// src/components/MainContainer.tsx
import React, { useState } from "react";
import HeaderBar from "./HeaderBar";
import MainContent from "./MainContent";
import Sidebar from "./Sidebar";
import { dummySources, Message } from "../hooks/types";
import { auth } from "./firebase";
import useSaveChat from "../hooks/saveChat/useSaveChat";
import { doc, getDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { DocumentReference, DocumentData } from "@firebase/firestore";
import { useNavigate } from "react-router-dom";

const MainContainer: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const userId = auth.currentUser?.uid;
    const chatId = localStorage.getItem("selectedChatId");
    const saveChat = useSaveChat(userId || "", chatId);
    const db = getFirestore();
    const navigate = useNavigate();
    const [chatTitle, setChatTitle] = useState<string>("New Chat");

    if (!userId) {
        console.error("User not logged in.");
        navigate("/login");
        return null;
    }
    if (chatId) {
        const chatRef : DocumentReference<DocumentData, DocumentData> = doc(db, "Users", userId, "Chats", chatId);
        const fetchChatDoc = async () => {
            const chatDoc = await getDoc(chatRef);
            if (!chatDoc.exists()) {
                console.error("Chat document does not exist.");
                return;
            }
            setChatTitle(chatDoc.data().title);
            setMessages(chatDoc.data().messages);
        }
        fetchChatDoc();
    }

    const addQuery = (query: string) => {
        saveChat(query, dummySources);
    };

    return (
        <div className="h-screen flex flex-col bg-screen-black text-white font-inter">
          <div className="flex flex-grow">
            <Sidebar/>
            <div className="flex flex-col flex-grow">
            <HeaderBar title={chatTitle} />
              <MainContent messages={messages} addQuery={addQuery}  />
            </div>
          </div>
        </div>
      );
      
}

export default MainContainer;