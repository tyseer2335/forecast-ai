// src/components/MainContainer.tsx
import React, { useState } from "react";
import HeaderBar from "./HeaderBar";
import MainContent from "./MainContent";
import Sidebar from "./Sidebar";
import { Answer, Chat, SourceObject } from "../hooks/types";
import useSaveChat from "../hooks/saveChat/useSaveChat";
import { doc, getDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { DocumentReference, DocumentData } from "@firebase/firestore";
import { useEffect } from "react";

/**
 * MainContainer Component
 * 
 * This component serves as the main controller for the application, managing chat sessions,
 * interactions, and data flow between the Sidebar, HeaderBar, and MainContent components.
 * 
 * @component
 * 
 * State and Props:
 * - `chats` (Chat[]): Manages chat history and messages.
 * - `chatTitle` (string): Stores the title of the current chat.
 * - `userId` (string): Retrieved from local storage; redirects to login if not found.
 * - `chatId` (string | null): Retrieved from session storage to manage the selected chat.
 * 
 * Functions:
 * - `fetchChatDoc`: Fetches the chat document from Firestore to display chat messages.
 * - `saveChatToDB`: Saves the current chat to Firestore.
 * - `addQuery`, `addSources`, `addAnswer`, `addError`, `toggleLoading`, `addStatus`, `addGlobalMetrics`:
 *   Helper functions to update the state of the chat session, including queries, sources,
 *   answers, errors, status updates, and global metrics.
 * 
 * Render:
 * - Integrates `Sidebar`, `HeaderBar`, and `MainContent` components to structure
 *   the application layout and display chat interactions.
 * 
 * @returns {JSX.Element} The rendered MainContainer component layout.
 */


// Make the MainContainer to take userId(string) as a prop
const MainContainer: React.FC = () => {
  const db = getFirestore();
  const saveChat = useSaveChat();
  var [chats, setChats] = useState<Chat[]>([]);
  var userId : string = localStorage.getItem('userId') || "";
  if (!userId) {
    window.location.href = '/login';
    return null;
  }
  var chatId = sessionStorage.getItem("selectedChatId");
  const [chatTitle, setChatTitle] = useState<string>("New Chat");

  // Selected Chat Id
  useEffect(() => {
    if (!sessionStorage.getItem("selectedChatId")) {
        setChats([]);
        setChatTitle("New Chat");
    } else {
        chatId = sessionStorage.getItem("selectedChatId");
        if (userId && chatId) {
            const chatRef : DocumentReference<DocumentData, DocumentData> = doc(db, "Users", userId, "Chats", chatId);
            fetchChatDoc(chatRef);
        }
    }
  }, [sessionStorage["selectedChatId"]]);

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
  }

  const saveChatToDB = async (chat: Chat) => {
    chatId = sessionStorage.getItem("selectedChatId") ?? "";
    saveChat(userId, chatId, chat.query, chat.sources, chat.answer);
    chatId = sessionStorage.getItem("selectedChatId");
    if (userId && chatId) {
      const chatRef : DocumentReference<DocumentData, DocumentData> = doc(db, "Users", userId, "Chats", chatId);
      fetchChatDoc(chatRef);
    }
  };

  const addQuery = (query: string) => {
      setChats((prevChats): Chat[] => {
          return [...prevChats, { query: query, sources: [], loading: true }];
      })
  };

  const addSources = (sources: SourceObject[]) => {
      setChats((prevChats): Chat[] => {
          const newChats = [...prevChats];
          newChats[newChats.length - 1] = { ...newChats[newChats.length - 1], sources: sources };
          return newChats;
      })
  }

  const addAnswer = (answer: Answer) => {
      setChats((prevChats): Chat[] => {
        const newChats = [...prevChats];
        newChats[newChats.length - 1] = { ...newChats[newChats.length - 1], answer: answer };
        return newChats;
      })
  }

  const addError = (error: string) => {
      setChats((prevChats): Chat[] => {
          const newChats = [...prevChats];
          newChats[newChats.length - 1] = { ...newChats[newChats.length - 1], error: error };
          return newChats;
      })
  }

  const toggleLoading = (loading: boolean) => {
      setChats((prevChats): Chat[] => {
          const newChats = [...prevChats];
          newChats[newChats.length - 1] = { ...newChats[newChats.length - 1], loading: loading };
          return newChats;
      })
  }

  const addStatus = (status: string) => {
      setChats((prevChats): Chat[] => {
        const newChats = [...prevChats];
        newChats[newChats.length - 1] = { ...newChats[newChats.length - 1], status: status };
        return newChats;
      })
  }

  return (
    <div className="min-h-screen h-screen w-screen flex bg-screen-black text-white font-inter">
    <Sidebar newChatId={chatId} />
    <div className="flex flex-col flex-grow">
      <HeaderBar title={chatTitle} userId={userId} chatId={chatId} />
      <MainContent chats={chats} setChatTitle={setChatTitle} saveChatToDB={saveChatToDB} addQuery={addQuery} addSources={addSources} addAnswer={addAnswer} addError={addError} toggleLoading={toggleLoading} addStatus={addStatus} />
        </div>
      </div>
    );
      
}

export default MainContainer;