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
    [key: string]: { 
      [token: string]: number 
    };
  };
}

// BiasColor is a type that represents the different colors that can be used to represent bias in the forecaster rationale
export type BiasColor = "green" | "yellow" | "purple" | "red" ;
// BiasToBooleanMap is a type that represents a map from BiasColor to a boolean value
// The use of this type is to represent the visibility of each bias color in the forecaster rationale:
  // BiasVisibility = maps each BiasColor to a boolean value that represents whether the bias of that color should be visible or not (user can toggle visibility)
  // BiasIsDetectedMap = maps each BiasColor to a boolean value that represents whether the bias of that color is detected in the forecaster rationale
export type BiasColorToBooleanMap = {
  [key in BiasColor]: boolean;
}
export type BiasColorToBiasNameMap = {
  [key in BiasColor]: string;
}
export type BiasColorToHexCodeMap = {
  [key in BiasColor]: string;
}

export const isBiasColorToBiasNameMap = (content: any): content is BiasColorToBiasNameMap => {
  return (
    typeof content.green === 'string' &&
    typeof content.yellow === 'string' &&
    typeof content.purple === 'string' &&
    typeof content.red === 'string'
  );
}
