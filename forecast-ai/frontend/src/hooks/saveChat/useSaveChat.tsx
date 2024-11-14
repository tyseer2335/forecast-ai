// src/hooks/useSaveChat.tsx
import { _saveUserMessage } from "./_saveUserMessage";
import { _saveAISourcesMessage } from "./_saveAISourcesMessage";
import { Answer, SourceObject } from "../types";
import { doc, collection, addDoc, getFirestore } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

/**
 * Custom hook to save a chat message and response in Firestore.
 *
 * This hook returns an asynchronous `saveChat` function to save a user's message and an AI response
 * (including any sources and answers) in a specified or newly created chat document within Firestore.
 * If `chatId` is provided, it references an existing chat. If not, a new chat is created with an
 * initial title and timestamps for `created_at` and `updated_at`.
 *
 * The function then uses helper functions `_saveUserMessage` and `_saveAISourcesMessage` to add
 * the user's message and the AI's response with sources to the chat document.
 *
 * After saving, it redirects the user to the main chat page using React Router's `navigate`.
 *
 * @returns `saveChat` - A function that, when called with `userId`, `chatId`, `messageContent`,
 *          `sources`, and `answer`, saves the chat data to Firestore.
 *
 * @param userId - The ID of the user to whom the chat belongs.
 * @param chatId - An optional ID of an existing chat. If null, a new chat is created.
 * @param messageContent - The content of the user's message.
 * @param sources - An array of sources used for the AI response.
 * @param answer - The AI's response to the user's message.
 *
 * Usage Example:
 * ```typescript
 * const saveChat = useSaveChat();
 * saveChat(userId, chatId, "User's message", sourcesArray, aiAnswer);
 * ```
 */

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
