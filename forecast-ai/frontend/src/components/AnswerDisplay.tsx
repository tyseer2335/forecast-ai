import React from "react";

type AnswerDisplayProps = {
  answer: {
    "Question ID": string;
    "Question": string;
    "Forecaster ID": string;
    "Forecaster Rationale": string;
    "Forecast": string;
    "Crowd forecast": string;
    "Ground truth label": string;
    "llm_features": {
      [key: string]: number[];
    };
  };
};

const AnswerDisplay: React.FC<AnswerDisplayProps> = ({ answer }) => {
  const { "Forecaster Rationale": rationale, "llm_features": llmFeatures } = answer;

  const getTokenColor = (tokenIndex: number, feature: string) => {
    const metric = llmFeatures[feature][tokenIndex];
    if (metric > 0.75) return "bg-green-500";
    if (metric > 0.5) return "bg-yellow-500";
    if (metric > 0.25) return "bg-orange-500";
    return "bg-red-500";
  };

  const renderRationale = () => {
    const tokens = rationale.split(" ");
    return tokens.map((token, index) => {
      const feature = Object.keys(llmFeatures).find((key) => llmFeatures[key][index] !== undefined);
      const colorClass = feature ? getTokenColor(index, feature) : "";
      return (
        <span key={index} className={`px-1 ${colorClass}`}>
          {token}
        </span>
      );
    });
  };

  return (
    <div className="p-4 bg-gray-800 rounded-md">
      <h3 className="text-lg font-bold mb-2">THIS IS MOCK UP DESIGN!</h3>
      <p className="text-white mb-4"><strong>Question:</strong> {answer.Question}</p>
      <p className="text-white mb-4"><strong>Forecast:</strong> {answer.Forecast}</p>
      <p className="text-white mb-4"><strong>Crowd Forecast:</strong> {answer["Crowd forecast"]}</p>
      <p className="text-white mb-4"><strong>Ground Truth Label:</strong> {answer["Ground truth label"]}</p>
      <p className="text-white mb-4"><strong>Forecaster Rationale:</strong></p>
      <p className="text-white">{renderRationale()}</p>
    </div>
  );
};

export default AnswerDisplay;