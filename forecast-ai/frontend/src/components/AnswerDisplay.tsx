import React from "react";
import { Answer, BiasColor } from "../hooks/types";
import { biasColorToBiasNameMap, biasColorToHexCodeMap } from "../hooks/constants";

type AnswerDisplayProps = {
  query: string;
  answer: Answer;
  visibleBiasColor: BiasColor | "";
};


const AnswerDisplay: React.FC<AnswerDisplayProps> = ({ query, answer, visibleBiasColor }) => {
  const { forecaster_rationale: rationale, llm_features: llmFeatures } = answer;

  var isBiasNamesReady = false;

  const getTokenColorOpacity = (tokenIndex: number, feature: string) => {
    // Note we can assume that visibleBiasColor is not ""
    return visibleBiasColor && `token_${tokenIndex}` in llmFeatures[feature] ? 
    {
      backgroundColor: biasColorToHexCodeMap[visibleBiasColor],
      opacity: llmFeatures[feature][`token_${tokenIndex}`]
    } : {}
  };

  const renderRationale = () => {
    const tokens = rationale.split(" ");
    var feature = "";
    if (visibleBiasColor) {
      feature = biasColorToBiasNameMap[visibleBiasColor];
    }
    var coloredTokens = tokens.map((token, index) => {
      var highlightStyle = {};
      if (visibleBiasColor) highlightStyle = getTokenColorOpacity(index, feature);
      return (
        <span key={index} className="px-1" style={highlightStyle} >
          {token}
        </span>
      );
    });
    isBiasNamesReady = true;
    return coloredTokens;
  };

  return (
    <div className="p-4 pb-7 bg-sidebar-bg rounded-md flex flex-col space-y-6 flex-grow max-w-[933px] overflow-y-auto" style={{ width: 'calc(85% + 20px)' }}>
      <h3 className="text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg 2xl:text-xl font-bold text-white">Forecast Result</h3>
      <div className="flex flex-col space-y-3 sm:space-y-4 w-full">
        <p className="text-white text-[8px] sm:text-[10px] md:text-xs lg:text-sm"><strong>Question:</strong> {query}</p>
        <p className="text-white text-[8px] sm:text-[10px] md:text-xs lg:text-sm"><strong>Forecast Probability:</strong> {answer.forecast}</p>
        <p className="text-white text-[8px] sm:text-[10px] md:text-xs lg:text-sm"><strong>Forecaster Rationale:</strong></p>
        <p className="text-white text-[8px] sm:text-[10px] md:text-xs lg:text-sm break-all">
          {renderRationale()}
        </p>
      </div>
    </div>
  );
};

export default AnswerDisplay;