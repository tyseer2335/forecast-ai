// src/hooks/useSaveUserMessage.tsx
import { updateDoc, arrayUnion } from "firebase/firestore";
import { DocumentReference, DocumentData } from "@firebase/firestore";

export const _saveUserMessage = async (chatRef: DocumentReference<DocumentData>, messageContent: string) => {
  try {
  
    // 2. Update the 'messages' array with the new message
    await updateDoc(chatRef, {
      messages: arrayUnion({
        sender: "user",
        content: messageContent,
        timestamp: new Date(),
      }),
    });
      await updateDoc(chatRef, {
      updated_at: new Date(),
    });

  } catch (e) {
    console.error("Error updating chat document with user query: ", e);
  }
};
