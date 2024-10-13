// src/hooks/_saveAISourcesMessage.tsx
import { updateDoc, arrayUnion } from "firebase/firestore";
import { DocumentReference, DocumentData } from "@firebase/firestore";
import { SourceObject} from "../types";

export const _saveAISourcesMessage = async (chatRef: DocumentReference<DocumentData>, sources: SourceObject[]) => {
  try {
    await updateDoc(chatRef, {
      messages: arrayUnion({
        sender: "ai",
        content: sources,
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
