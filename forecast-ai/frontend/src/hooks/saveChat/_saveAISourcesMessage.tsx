// src/hooks/_saveAISourcesMessage.tsx
import { updateDoc, arrayUnion } from "firebase/firestore";
import { DocumentReference, DocumentData } from "@firebase/firestore";
import { Answer, SourceObject} from "../types";

/**
 * Saves AI-generated sources and answer messages to a specified chat document in Firestore.
 *
 * This function updates a given chat document in Firestore by appending a new message
 * from the AI that includes the sources and answer content. The message is stored in the 
 * `messages` array field within the document. Additionally, it updates the `updated_at` 
 * timestamp to reflect the time of the latest update.
 *
 * @param chatRef - A reference to the Firestore document for the chat being updated.
 * @param sources - An array of `SourceObject` items representing the sources provided by the AI.
 * @param answer - An `Answer` object (or undefined) that holds the AI's answer content to the user's query.
 *
 * @throws Logs an error message to the console if the update to Firestore fails.
 *
 * Usage Example:
 * ```typescript
 * const chatRef = doc(firestore, "Users", userId, "Chats", chatId);
 * await _saveAISourcesMessage(chatRef, sourcesArray, aiAnswer);
 * ```
 */

export const _saveAISourcesMessage = async (chatRef: DocumentReference<DocumentData>, sources: SourceObject[], answer: Answer | undefined) => {
  try {
    await updateDoc(chatRef, {
      messages: arrayUnion({
        sender: "ai",
        content: { sources, answer },
        timestamp: new Date(),
      }),
    });
      await updateDoc(chatRef, {
      updated_at: new Date(),
    });
    
  } catch (e) {
    console.error("Error updating chat document with gathered sources: ", e);
  }
};
