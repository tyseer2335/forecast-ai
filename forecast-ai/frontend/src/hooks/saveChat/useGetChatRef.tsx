// src/hooks/useGetChatRef.tsx
import { doc, collection, addDoc, getFirestore } from "firebase/firestore";

/**
 * Custom hook to get a Firestore reference for a chat.
 *
 * This hook returns a function (`getChatRef`) that retrieves a Firestore reference
 * for a specified chat. If `chatId` is provided, it references an existing chat.
 * Otherwise, it creates a new chat document with an initial message title and
 * timestamps for `created_at` and `updated_at`.
 *
 * The ID of the referenced or created chat is stored in localStorage as `selectedChatId`.
 *
 * @param userId - The ID of the user to whom the chat belongs.
 * @param chatId - An optional ID of an existing chat. If null, a new chat is created.
 * 
 * @returns A function `getChatRef` which, when called with a `messageContent` string, 
 *          returns a Firestore document reference for the chat.
 *
 * Usage Example:
 * ```typescript
 * const getChatRef = useGetChatRef(userId, chatId);
 * const chatRef = await getChatRef("Initial message for the chat");
 * ```
 */

const useGetChatRef = (userId: string, chatId: string | null) => {
  const db = getFirestore();
  const getChatRef = async (messageContent: string) => {
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
  }

  return getChatRef;
};

export default useGetChatRef;
