// src/hooks/useGetChatRef.tsx
import { doc, collection, addDoc, getFirestore } from "firebase/firestore";

const useGetChatRef = (userId: string, chatId: string | null) => {
  const db = getFirestore();

  const getChatRef = async (messageContent: string) => {
    try {
      
      const chatRef = chatId 
        ? doc(db, "Users", userId, "Chats", chatId) 
        : await addDoc(collection(db, "Users", userId, "Chats"), {
            title: messageContent,
            messages: [],
            created_at: new Date(),
            updated_at: new Date(),
          });
      localStorage.setItem("selectedChatId", chatRef.id);
      return chatRef;

    } catch (e) {
      console.error("Error finding chat document: ", e);
    }
  }

  return getChatRef;
};

export default useGetChatRef;
