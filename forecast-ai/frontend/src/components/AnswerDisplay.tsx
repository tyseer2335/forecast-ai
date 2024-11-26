// src/components/AnswerDisplay.tsx
import React from "react";
import { useState } from "react";
import { Answer, BiasColor } from "../hooks/types";
import { biasColorToBiasNameMap, biasColorToHexCodeMap, biasColorToRGBAMap } from "../hooks/constants";
import "../css/answer-display-custom-css.css";

/**
 * @file AnswerDisplay.tsx
 * 
 * @description
 * The `AnswerDisplay` component is responsible for rendering the forecast result, including the forecast probability,
 * forecaster rationale, and bias highlighting based on the selected bias color. It displays the user's query,
 * the forecast probability, and the rationale with color-coded bias highlighting.
 * 
 * @component
 * 
 * Features:
 * - **Bias Highlighting**: Highlights bias-related tokens in the forecaster rationale based on the selected bias color.
 * - **Dynamic Opacity**: Adjusts the opacity of bias highlighting based on the degree of bias detected.
 * - **Responsive Design**: Adapts layout and style based on screen size, using Tailwind CSS for flexibility.
 * 
 * @param {AnswerDisplayProps} props - Props include `query` (user query), `answer` (forecast answer object),
 *                                     `visibleBiasColor` (selected bias color for highlighting, or empty string when no bias is selected to be displayed).
 * 
 * @returns {React.FC}
 * Renders the forecast result with the user's query, forecast probability, and rationale, highlighting bias-related tokens.
 * The bias highlighting is based on the selected bias color, with dynamic color codes and bias names for each token.
 */


type AnswerDisplayProps = {
  query: string;
  answer: Answer;
  visibleBiasColor: BiasColor | "";
};


const AnswerDisplay: React.FC<AnswerDisplayProps> = ({ query, answer, visibleBiasColor }) => {
  const { forecaster_rationale: rationale, llm_features: llmFeatures } = answer;
  const [showRawRationale, setShowRawRationale] = useState(false);

  const getTokenColorDegree : (tokenIndex: number, feature: string) => [{}, string] = (tokenIndex: number, feature: string) => {
    // Note we can assume that visibleBiasColor is not ""
    if (!visibleBiasColor) return [{}, ""];
    if (!(`token_${tokenIndex}` in llmFeatures[feature])) return [{}, ""];
    const degree = llmFeatures[feature][`token_${tokenIndex}`];
    return [
      {
        backgroundColor: biasColorToRGBAMap[visibleBiasColor].replace("A", degree.toString()),
      },
      `${(degree * 100).toFixed(1)}%`
    ];
  };

  const renderRationale = () => {
    const tokens = rationale.split(" ");
    var feature = "";
    if (visibleBiasColor) {
      feature = biasColorToBiasNameMap[visibleBiasColor];
    }
    var coloredTokens = tokens.map((token, index) => {
      var [highlightStyle, degree] = [{}, ""];
      if (visibleBiasColor) [highlightStyle, degree] = getTokenColorDegree(index, feature);
      const result = (
        <div key={index} className='relative inline-block px-1'>
        <div className="tooltip" key={index} style={highlightStyle}>
          {token}
          <span className="tooltiptext">{degree}</span>
        </div>
        </div>
      );
      return result;
    });
    return coloredTokens;
  };

  return (
    <div className="p-4 pb-7 bg-sidebar-bg rounded-md flex flex-col space-y-6 flex-grow max-w-[933px] overflow-y-auto" style={{ width: 'calc(85% + 20px)' }}>
      <div className="flex justify-between items-center">
        <h3 className="text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg 2xl:text-xl font-bold text-white">
          Forecast Result
        </h3>
        <button
          onClick={() => setShowRawRationale(!showRawRationale)}
          className="text-[8px] sm:text-[10px] md:text-xs lg:text-sm text-metrics-text font-semibold border border-metrics-text px-2 py-1 rounded-xl hover:bg-metrics-text hover:text-sidebar-bg transition duration-200 hover:transform hover:scale-105 opacity-80"
        >
          {showRawRationale ? "Show Processed" : "Show Raw Response"}
        </button>
      </div>
      
      <div className="flex flex-col space-y-3 sm:space-y-4 w-full overflow-visible">
        <p className="text-white text-[8px] sm:text-[10px] md:text-xs lg:text-sm">
          <strong>Question:</strong> {query}
        </p>
        <p className="text-white text-[8px] sm:text-[10px] md:text-xs lg:text-sm">
          <strong>Forecast Probability:</strong> {answer.forecast}
        </p>
        <p className="text-white text-[8px] sm:text-[10px] md:text-xs lg:text-sm">
          <strong>Forecaster Rationale:</strong>
        </p>
        <p className="text-white text-[8px] sm:text-[10px] md:text-xs lg:text-sm break-all overflow-visible"> 
          {showRawRationale ? answer.raw_rationale : renderRationale()}
        </p>
        
      </div>
    </div>
  );
};

export default AnswerDisplay;