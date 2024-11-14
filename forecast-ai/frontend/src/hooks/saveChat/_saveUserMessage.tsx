// src/hooks/_saveUserMessage.tsx
import { updateDoc, arrayUnion } from "firebase/firestore";
import { DocumentReference, DocumentData } from "@firebase/firestore";


/**
 * Saves a user-generated message to a specified chat document in Firestore.
 *
 * This function appends a new message from the user to the `messages` array of a Firestore 
 * chat document. The message includes the content provided by the user, along with a timestamp.
 * Additionally, it updates the `updated_at` field to record the time of the latest message update.
 *
 * @param chatRef - A reference to the Firestore document for the chat being updated.
 * @param messageContent - A string containing the message content from the user.
 *
 * @throws Logs an error message to the console if the update to Firestore fails.
 *
 * Usage Example:
 * ```typescript
 * const chatRef = doc(firestore, "Users", userId, "Chats", chatId);
 * await _saveUserMessage(chatRef, "Hello, how are you?");
 * ```
 */

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
