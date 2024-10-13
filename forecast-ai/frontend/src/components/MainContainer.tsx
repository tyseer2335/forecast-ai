// src/components/MainContainer.tsx
import React, { useState } from "react";
import HeaderBar from "./HeaderBar";
import MainContent from "./MainContent";
import Sidebar from "./Sidebar";
import { Chat, dummySources, Message } from "../hooks/types";
import { getChatMessages } from "../hooks/getChatMessages";
import { auth } from "./firebase";
import { useEffect } from "react";
import useSaveChat from "../hooks/saveChat/useSaveChat";

const MainContainer: React.FC = () => {
    const [chats, setChats] = useState<Chat[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const userId = auth.currentUser?.uid;
    const chatId = localStorage.getItem("selectedChatId");
    const saveChat = useSaveChat(userId || "", chatId);
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const messagesFromDB: Message[] = await getChatMessages(userId, chatId);
                console.log("Messages from DB:", messagesFromDB);
                setMessages(messagesFromDB);
            } catch (error) {
                console.error("Error fetching chat messages:", error);
            }
        };

        fetchMessages();
    }, [userId, chatId]);

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const tempChats: Chat[] = [];
                let currentChat: Chat = { query: "", sources: [] };
                
                for (let i = 0; i < messages.length; i++) {                    
                    if (i % 2 === 0) {
                        console.log("Adding query:", messages[i].content);
                        currentChat.query = messages[i].content;
                    } else {
                        currentChat.sources = dummySources;
                        
                        console.log("current Chat:", currentChat);
                        tempChats.push(currentChat);
                        currentChat = { query: "", sources: [] };
                    }
                }
                setChats(tempChats);
            } catch (error) {
                console.error("Error fetching chat messages:", error);
            }
        };
        fetchChats();
    }, [messages]);
    
    const addQuery = (query: string) => {
        saveChat(query, dummySources);
    };

    return (
        <div className="h-screen flex flex-col bg-screen-black text-white font-inter">
          <div className="flex flex-grow">
            <Sidebar/>
            <div className="flex flex-col flex-grow">
            <HeaderBar title={chats.length > 0 ? chats[0].query : ''} />
              <MainContent chats={chats} addQuery={addQuery}  />
            </div>
          </div>
        </div>
      );
      
}

export default MainContainer;