// src/hooks/saveChat/types.ts

export type Metric = {
  viewsCount: number,
  trendingRate: number,
  region: string
}

export type Chat = {
  query: string;
  sources: SourceObject[];
  answer?: Answer;
  error?: string;
  loading: boolean;
  status?: string;
}

// Example of a SourceObject:
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

export type SourceObject = {
  title: string;
  text: string;
  image: string;
  link: string;
  logo: string;
  metrics: Metric;
};

const isSourceObject = (content: any): content is SourceObject => {
  return (
    typeof content.title === 'string' &&
    typeof content.text === 'string' &&
    typeof content.image === 'string' &&
    typeof content.link === 'string' &&
    typeof content.logo === 'string' &&
    typeof content.metrics === 'object' &&
    typeof content.metrics.viewsCount === 'number' &&
    typeof content.metrics.trendingRate === 'number' &&
    typeof content.metrics.region === 'string'
  );
};

export const isSourceObjectArray = (content: any): content is SourceObject[] => {
  return content.every(isSourceObject);
}

// [DB] Message in the context of a chat message in DB
// E.g.:
// Message from user:
// const message = 
// {
// "sender": "user",
// "content": "Hi AI, can you summarize the project meeting?",
// "timestamp": "2024-10-03T12:30:00Z"
// }
export type Message = {
  sender: string;
  content: string | SourceObject;
  timestamp: Date;
}

export type Answer = {
  forecast: string;
  forecaster_rationale: string;
  llm_features: {
    [key: string]: number[];
  };
}