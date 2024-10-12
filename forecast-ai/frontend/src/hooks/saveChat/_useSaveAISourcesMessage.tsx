// src/hooks/useSaveAISourcesMessage.tsx
import { doc, updateDoc, arrayUnion, getFirestore } from "firebase/firestore";
import { DocumentReference, DocumentData } from "@firebase/firestore";

export type SourceObject = {
  title: string;
  text: string;
  image: string;
  link: string;
  logo: string;
  metrics: {
    viewsCount: number;
    trendingRate: number;
    region: string;
  };
};

// E.g.
// const sources: SourceObject[] = [
//   {
//     title: "Who Is Favored To Win The 2024 US Election?",
//     text: "Much like Democratic presidential candidates in 2016 and 2020, Vice President Kamala Harris has moved the needle in her favor on betting markets and in polling following last week's debate with former President Donald Trump. The shift in the 2024 presidential
//     image: "https://via.placeholder.com/150",
//     link: "-cnn.article.link.goes.here.com",
//     logo: "https://via.placeholder.com/150",
//     metrics: {
//       viewsCount: 483,
//       trendingRate: 22,
//       region: 'Atlanta, USA'
//   }, 
//   { ... },
//   { ... }
// ];

const useSaveAISourcesMessage = (chatRef: DocumentReference<DocumentData> ) => {
  const saveAISourcesMessage = async (sources: SourceObject[]) => {
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

  return saveAISourcesMessage;
};

export default useSaveAISourcesMessage;
