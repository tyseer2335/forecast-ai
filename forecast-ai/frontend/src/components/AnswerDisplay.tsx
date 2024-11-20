// src/components/AnswerDisplay.tsx
import React from "react";
import { Answer, BiasColor } from "../hooks/types";
import { biasColorToBiasNameMap, biasColorToHexCodeMap, biasColorToRGBAMap } from "../hooks/constants";
// import custom css from ../css/answer-display-custom-css.css
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
  var [hoveredIndex, setHoveredIndex] = React.useState(-1);
  var isBiasNamesReady = false;

  const getTokenColorOpacity : (tokenIndex: number, feature: string) => [{}, string] = (tokenIndex: number, feature: string) => {
    // Note we can assume that visibleBiasColor is not ""
    if (!visibleBiasColor) return [{}, ""];
    if (!(`token_${tokenIndex}` in llmFeatures[feature])) return [{}, ""];
    const degree = llmFeatures[feature][`token_${tokenIndex}`];
    return [
      {
        // backgroundColor: biasColorToHexCodeMap[visibleBiasColor],
        backgroundColor: biasColorToRGBAMap[visibleBiasColor].replace("A", degree.toString()),
        // backgroundOpacity: degree,
        // opacity: degree,

      },
      `${(degree * 100).toFixed(2)}%`
    ];
  };

  const renderRationale = () => {
    const tokens = rationale.split(" ");
    var feature = "";
    if (visibleBiasColor) {
      feature = biasColorToBiasNameMap[visibleBiasColor];
    }
    var coloredTokens = tokens.map((token, index) => {
      var [highlightStyle, tooltip] = [{}, ""];
      if (visibleBiasColor) [highlightStyle, tooltip] = getTokenColorOpacity(index, feature);
      
      // const result = (
        // <span key={index} className="px-1" style={highlightStyle} title={tooltip}>
        //   {token}
        // </span>
        // <div key={index} title={tooltip} className="inline-block px-1">
        // <span style={highlightStyle}>{token}</span>
        // </div>
      //   <div key={index} className="relative inline-block px-1">
      //   <label
      //     className="relative cursor-pointer"
      //     style={highlightStyle}
      //   >
      //     {token}
      //   </label>
      //   <style>{`
      //     label::after {
      //       content: "${tooltip}";
      //       display: none;
      //       position: absolute;
      //       top: -20px;
      //       left: 50%;
      //       transform: translateX(-50%);
      //       background-color: #fef4c5;
      //       border: 1px solid #d4b943;
      //       border-radius: 2px;
      //       padding: 2px 4px;
      //       text-align: center;
      //       white-space: nowrap;
      //       font-size: 0.8rem;
      //       z-index: 10;
      //     }

      //     label:hover::after {
      //       display: block;
      //     }
      //   `}</style>
      // </div>
      //   );
      // example:
            // style = {{
            //   backgroundColor: biasColorToHexCodeMap[visibleBiasColor],
            //   opacity: degree,
            // }}

      const classNames = `relative inline-block px-1 ${hoveredIndex===index ? 'label-container-hover' : 'label-container'}`;
      const result = (
        // `relative inline-block px-1 ${isHovered ? 'label-container-hover' : 'label-container'}`}
        <div key={index} className="relative inline-block px-1
                    hover:before:content-['TESTING FRONT'] 
                    before:text-4xl before:text-red-300
                    hover:after:content-['BACK'] 
                    after:text-5xl after:text-yellow-300
                    "
        // onMouseEnter={() => setHoveredIndex(index)}
        // onMouseLeave={() => setHoveredIndex(-1)}
        >
          <label
            className="relative cursor-pointer"
            style={highlightStyle} 
            data-tooltip={tooltip}
          >
            {token}
          </label>
        </div>
      );
      // const result = (
      //   <div>
      //     <span key={index} className="px-1 testing-label" style={highlightStyle} data-title={tooltip}>
      //       {token}
      //     </span>
      //   </div>
      // );
      // console.log(result);
      return result;
    });
    isBiasNamesReady = true;
    return coloredTokens;
  };

  return (
    <div className="p-4 pb-7 bg-sidebar-bg rounded-md flex flex-col space-y-6 flex-grow max-w-[933px] overflow-y-auto" style={{ width: 'calc(85% + 20px)' }}>
      <h3 className="text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg 2xl:text-xl font-bold text-white"
      title="hi">Forecast Result</h3>
      <div className="flex flex-col space-y-3 sm:space-y-4 w-full">
        <p className="text-white text-[8px] sm:text-[10px] md:text-xs lg:text-sm"><strong>Question:</strong> {query}</p>
        <p className="text-white text-[8px] sm:text-[10px] md:text-xs lg:text-sm"><strong>Forecast Probability:</strong> {answer.forecast}</p>
        <p className="text-white text-[8px] sm:text-[10px] md:text-xs lg:text-sm"><strong>Forecaster Rationale:</strong></p>
        <p className="text-white text-[8px] sm:text-[10px] md:text-xs lg:text-sm break-all overflow-visible">
          {renderRationale()}
        </p>
        {/* Test tooltip label */}
        {/* <div className="relative inline-block px-1 test-label-container">
        <label className="relative" data-tooltip="50%">Test why not cursor</label>
        </div> */}
        {/* To include attribute, use the following code */}

        <label data-tooltip="messahe"
        >test</label>


      </div>
    </div>
  );
};

export default AnswerDisplay;