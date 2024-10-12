// src/hooks/useSaveChat.js
import { doc, collection, addDoc, updateDoc, arrayUnion, serverTimestamp, getFirestore, setDoc } from "firebase/firestore";  // Firestore imports


const useSaveChat = (userId: string, chatId: string | null) => {
  const db = getFirestore();
  const saveQuery = async (messageContent: string) => {
    try {

      // 1. Find the chat document
      console.log("Finding chat document...");
      const chatRef = chatId 
        ? doc(db, "Users", userId, "Chats", chatId) 
        : await addDoc(collection(db, "Users", userId, "Chats"), {
            title: messageContent,
            messages: [],
            created_at: new Date(),
            updated_at: new Date(),
          });
      localStorage.setItem("selectedChatId", chatRef.id);

      console.log("Chat document found.");
    
      // 2. Update the 'messages' array with the new message
      await updateDoc(chatRef, {
        messages: arrayUnion({
          sender: "user",
          content: messageContent,
          timestamp: new Date(), // Use a regular timestamp here
        }),
      });
        await updateDoc(chatRef, {
        updated_at: new Date(),
      });
      
      console.log("Chat document updated.");
    } catch (e) {
      console.error("Error updating chat document: ", e);
    }
  };

  return saveQuery;
};

export default useSaveChat;
