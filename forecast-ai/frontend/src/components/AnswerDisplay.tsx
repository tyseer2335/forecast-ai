import React from "react";

type AnswerDisplayProps = {
  query: string;
  answer: {
    forecast: string;
    crowd_forecast: string;
    ground_truth_label: string;
    forecaster_rationale: string;
    llm_features: {
      [key: string]: number[];
    };
  };
};

const AnswerDisplay: React.FC<AnswerDisplayProps> = ({ query, answer }) => {
  const { forecaster_rationale: rationale, llm_features: llmFeatures } = answer;

  const getTokenColor = (tokenIndex: number, feature: string) => {
    const metric = llmFeatures[feature][tokenIndex];
    if (metric > 0.75) return "bg-heatmap-green-bg";
    if (metric > 0.5) return "bg-heatmap-yellow-bg";
    if (metric > 0.25) return "bg-heatmap-purple-bg";
    return "bg-heatmap-red-bg";
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
    <div className="p-4 pb-7 bg-sidebar-bg rounded-md flex flex-col space-y-6 flex-grow max-w-[933px] overflow-y-auto" style={{ width: 'calc(85% + 20px)' }}>
      <h3 className="text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg 2xl:text-xl font-bold text-white">Forecast Result</h3>
      <div className="flex flex-col space-y-3 sm:space-y-4 w-full">
        <p className="text-white text-[8px] sm:text-[10px] md:text-xs lg:text-sm"><strong>Question:</strong> {query}</p>
        <p className="text-white text-[8px] sm:text-[10px] md:text-xs lg:text-sm"><strong>Forecast Probability:</strong> {answer.forecast}</p>
        <p className="text-white text-[8px] sm:text-[10px] md:text-xs lg:text-sm"><strong>Crowd Forecast Probability:</strong> {answer.crowd_forecast}</p>
        <p className="text-white text-[8px] sm:text-[10px] md:text-xs lg:text-sm"><strong>Ground Truth Label:</strong> {answer.ground_truth_label}</p>
        <p className="text-white text-[8px] sm:text-[10px] md:text-xs lg:text-sm"><strong>Forecaster Rationale:</strong></p>
        <p className="text-white text-[8px] sm:text-[10px] md:text-xs lg:text-sm break-all">{renderRationale()}</p>
      </div>
    </div>
  );
};

export default AnswerDisplay;