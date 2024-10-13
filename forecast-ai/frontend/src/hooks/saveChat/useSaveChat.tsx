// src/hooks/useSaveChat.js
import { _saveUserMessage } from "./_saveUserMessage";
import { _saveAISourcesMessage } from "./_saveAISourcesMessage";
import { SourceObject } from "../types";
import { doc, collection, addDoc, getFirestore } from "firebase/firestore";


const useSaveChat = (userId: string, chatId: string | null) => {
  const db = getFirestore();
  const saveChat = async (messageContent: string, dummySources: SourceObject[]) => {
    try {
      // 1. Get the chat reference
      const chatRef = chatId 
        ? doc(db, "Users", userId, "Chats", chatId) 
        : await addDoc(collection(db, "Users", userId, "Chats"), {
            title: messageContent,
            messages: [],
            created_at: new Date(),
            updated_at: new Date(),
          });
     localStorage.setItem("selectedChatId", chatRef.id);

      // 2. Update the 'messages' array with the new message
      _saveUserMessage(chatRef, messageContent);

      // 3. Save the AI source message
      _saveAISourcesMessage(chatRef, dummySources);
      
      console.log("Chat document updated.");
    } catch (e) {
      console.error("Error updating chat document: ", e);
    }
  };

  return saveChat;
};

export default useSaveChat;
