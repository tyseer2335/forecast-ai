// src/hooks/getChatMessages.tsx
import { SourceObject, Message } from "./types";
import { doc, collection, addDoc, getFirestore, getDoc } from "firebase/firestore";
  
export const getChatMessages = async (userId: string | undefined, chatId: string | null) => {
  const db = getFirestore();
  const emptyArray : Message[] = [];
  try {
    if (!userId || !chatId) {
      return emptyArray;
    }
    // 1. Get the chat reference
    const chatRef = doc(db, "Users", userId, "Chats", chatId);

    // 2. Get the chat document
    const chatDoc = await getDoc(chatRef);
    // 3. Get the messages array from the chat document
    const chatData = chatDoc.data(); // chatData is of type DocumentData
    // 4. Get the messages array from the chat data
    const messages : Message [] = chatData ? chatData.messages : []; // messages is of type Message[]
    return messages;
  } catch (e) {
    console.error("Error updating chat document: ", e);
  }
  return emptyArray;
};