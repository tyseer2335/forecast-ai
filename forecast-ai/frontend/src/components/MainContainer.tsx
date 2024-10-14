// src/components/MainContainer.tsx
import React, { useState } from "react";
import HeaderBar from "./HeaderBar";
import MainContent from "./MainContent";
import Sidebar from "./Sidebar";
import { dummySources, Chat } from "../hooks/types";
import { auth } from "./firebase";
import useSaveChat from "../hooks/saveChat/useSaveChat";
import { doc, getDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { DocumentReference, DocumentData } from "@firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";


const MainContainer: React.FC = () => {
  const db = getFirestore();
  const navigate = useNavigate();
  const saveChat = useSaveChat();
  var [chats, setChats] = useState<Chat[]>([]);
  var userId = auth.currentUser?.uid;
  var chatId = localStorage.getItem("selectedChatId");
    
  const [chatTitle, setChatTitle] = useState<string>("New Chat");

  // Sync User Login
  useEffect(() => {
    if (!auth.currentUser) {
      console.error("User not logged in.");
      navigate("/login");
      return;
    } 
    userId = auth.currentUser.uid;
  }, [auth]);

  // Selected Chat Id
  useEffect(() => {
    if (!localStorage.getItem("selectedChatId")) {
        setChats([]);
        setChatTitle("New Chat");
    } else {
        chatId = localStorage.getItem("selectedChatId");
        if (userId && chatId) {
            const chatRef : DocumentReference<DocumentData, DocumentData> = doc(db, "Users", userId, "Chats", chatId);
            fetchChatDoc(chatRef);
        }
    }
  }, [localStorage["selectedChatId"]]);

  // =============== Helper Functions ===============
  // I. fetchChatDoc: Fetch Doc and Extract Title & Messages
  // II. addQuery(query): Add Query to DB
  // ================================================

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
    var tempChat = { query: "", sources: [] };
    for (let i = 0; i < messages.length; i++) {
        if (messages[i].sender === "user") {
          tempChat.query = messages[i].content;
        } else {
          tempChat.sources = messages[i].content;
          tempChats.push(tempChat);
          tempChat = { query: "", sources: [] };
        }
    }
    setChats(tempChats);
  }

  const addQuery = async (query: string) => {
    userId = auth.currentUser?.uid ?? "";
    chatId = localStorage.getItem("selectedChatId") ?? "";
    saveChat(userId, chatId, query, dummySources);
    chatId = localStorage.getItem("selectedChatId");
    if (userId && chatId) {
      const chatRef : DocumentReference<DocumentData, DocumentData> = doc(db, "Users", userId, "Chats", chatId);
      fetchChatDoc(chatRef);
    }
  };

  return (
      <div className="h-screen flex flex-col bg-screen-black text-white font-inter">
        <div className="flex flex-grow">
          <Sidebar newChatId={chatId} />
          <div className="flex flex-col flex-grow">
          <HeaderBar title={chatTitle} />
            <MainContent chats={chats} addQuery={addQuery}  />
          </div>
        </div>
      </div>
    );
      
}

export default MainContainer;