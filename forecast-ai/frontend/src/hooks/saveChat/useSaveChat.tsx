// src/hooks/useSaveChat.tsx
import { _saveUserMessage } from "./_saveUserMessage";
import { _saveAISourcesMessage } from "./_saveAISourcesMessage";
import { Answer, SourceObject } from "../types";
import { doc, collection, addDoc, getFirestore } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const useSaveChat = () => {
  const db = getFirestore();
  const navigate = useNavigate();
  const saveChat = async (userId: string, chatId: string, messageContent: string, sources: SourceObject[], answer: Answer | undefined) => {
    try {
      // 1. Get the chat reference
      var chatRef = chatId 
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
      _saveAISourcesMessage(chatRef, sources, answer);
      
      navigate("/");
    } catch (e) {
      console.error("Error updating chat document: ", e);
    }
  };

  return saveChat;
};

export default useSaveChat;
