// src/hooks/useSaveChat.js
import { doc, collection, addDoc, updateDoc, arrayUnion, serverTimestamp, getFirestore, setDoc } from "firebase/firestore";  // Firestore imports


const useSaveChat = (userId: string, chatId?: string) => {
  const db = getFirestore();
  const saveQuery = async (messageContent: string) => {
    try {

      // 1. Find the chat document
      console.log("Finding chat document...");
      const chatRef = chatId 
        ? doc(db, "Users", userId, "Chats", chatId) 
        : await addDoc(collection(db, "Users", userId, "Chats"), {
            messages: [],
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });

      console.log("Chat document found.");
    
      // 2. Update the 'messages' array with the new message
      await updateDoc(chatRef, {
        messages: arrayUnion({
          sender: "user",
          content: messageContent,
          timestamp: new Date(), // Use a regular timestamp here
        }),
      });
  
      // Then update the 'updated_at' field with serverTimestamp
      await updateDoc(chatRef, {
        updated_at: serverTimestamp(),
      });
      console.log("Chat document updated.");
    } catch (e) {
      console.error("Error updating chat document: ", e);
    }
  };

  return saveQuery;
};

export default useSaveChat;
