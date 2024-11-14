import React, { useEffect, useRef } from "react";
import { Answer, BiasColor, BiasColorToBiasNameMap, BiasColorToBooleanMap } from "../hooks/types";

type AnswerDisplayProps = {
  query: string;
  answer: Answer;
  biasVisibility: BiasColorToBooleanMap;
  setBiasColorToBiasNameMap: React.Dispatch<React.SetStateAction<BiasColorToBiasNameMap>>;
  renderStage: number;
  setRenderStage: React.Dispatch<React.SetStateAction<number>>;
};


const AnswerDisplay: React.FC<AnswerDisplayProps> = ({ query, answer, biasVisibility, setBiasColorToBiasNameMap, renderStage, setRenderStage }) => {
  const { forecaster_rationale: rationale, llm_features: llmFeatures } = answer;
  console.log("LLM Features: ", llmFeatures);
  var isBiasNamesReady = false;
  var biasColorToBiasNameMap : BiasColorToBiasNameMap = {
    green: "",
    yellow: "",
    purple: "",
    red: ""
  };

  var localVisibility : BiasColorToBooleanMap = biasVisibility;

  const getTokenColorOpacity = (tokenIndex: number, feature: string) => {
    const metric = llmFeatures[feature][`token_${tokenIndex}`];

    if (metric === 0) {
      return "";
    }

    // Find the assignable color
    var assignableColor : BiasColor = "green";
    var color : BiasColor;
    var notFound = true;
    for (color in biasColorToBiasNameMap) {
      if (biasColorToBiasNameMap[color] === "" || biasColorToBiasNameMap[color] === feature) {
        assignableColor = color as BiasColor;
        notFound = false;
        break;
      }
    }
    if (notFound) {
      console.log("No assignable color found for feature: ", feature);
      return "";
    }

    // Assign the assignable color to the feature
    biasColorToBiasNameMap[assignableColor] = feature;

    // Assign the style based on the metric
    return `${assignableColor}-${metric * 100}`;
  };

  const renderRationale = () => {
    const tokens = rationale.split(" ");
    var coloredTokens = tokens.map((token, index) => {
      const feature = Object.keys(llmFeatures).find((key) => llmFeatures[key][`token_${index}`] !== undefined);
      var colorClass = feature ? getTokenColorOpacity(index, feature) : "";

      if (colorClass) {
        const [biasColor, opacity] = colorClass.split("-");
        if (!localVisibility[biasColor as BiasColor]) {
          colorClass = "";
        } else {
          colorClass = `bg-heatmap-${biasColor}-bg/${opacity}`;
        }
      }
      return (
        <span key={index} className={`${colorClass} px-1`}>
          {token}
        </span>
      );
    });
    if (renderStage === 0) {
      isBiasNamesReady = true;
    } 
    return coloredTokens;
  };

  useEffect(() => {
    if (renderStage === 0 && isBiasNamesReady) {
      console.log("Setting BiasColorToBiasNameMap in AnswerDisplay: ", biasColorToBiasNameMap);
      setBiasColorToBiasNameMap(biasColorToBiasNameMap);
      setRenderStage(1);
    } else if (renderStage >= 2) {
      localVisibility = biasVisibility;
    }
  }, [renderStage, isBiasNamesReady, biasVisibility]);


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