import React, { useEffect, useRef } from "react";
import { BiasColor, BiasColorToBiasNameMap, BiasColorToBooleanMap } from "../hooks/types";
import { set } from "date-fns";

type AnswerDisplayProps = {
  query: string;
  answer: {
    forecast: string;
    forecaster_rationale: string;
    llm_features: {
      [key: string]: number[];
    };
  };
  biasVisibility: BiasColorToBooleanMap;
  setBiasColorToBiasNameMap: React.Dispatch<React.SetStateAction<BiasColorToBiasNameMap | {}>>;
};


const AnswerDisplay: React.FC<AnswerDisplayProps> = ({ query, answer, biasVisibility, setBiasColorToBiasNameMap }) => {
  const { forecaster_rationale: rationale, llm_features: llmFeatures } = answer;
  var biasColorToBiasNameMap : BiasColorToBiasNameMap = {
    // all colors are initially unassigned
    green: "",
    yellow: "",
    purple: "",
    red: "",
    blue: "",
    orange: "",
    pink: "",
    brown: "",
    white: "",
  };
  var copyBiasVisibility : BiasColorToBooleanMap = {
    green: true,
    yellow: true,
    purple: true,
    red: true,
    blue: true,
    orange: true,
    pink: true,
    brown: true,
    white: true
  }

  const getTokenColor = (tokenIndex: number, feature: string) => {
    const metric = llmFeatures[feature][tokenIndex];

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
      // TODO: Check what is the maximum number of distinct bias types that can be outputted
      console.log("No assignable color found for feature: ", feature);
      return "";
    }

    // Assign the assignable color to the feature
    biasColorToBiasNameMap[assignableColor] = feature;

    // Assign the style based on the metric
    return `bg-heatmap-${assignableColor}-bg bg-opacity-${metric * 100}`;
  };

  useEffect(() => {
    if (JSON.stringify(copyBiasVisibility) === JSON.stringify(biasVisibility)) {
      return;
    } 
    copyBiasVisibility = biasVisibility;
    setBiasColorToBiasNameMap(biasColorToBiasNameMap);
  }, [biasVisibility]);
  

  const renderRationale = () => {
    const tokens = rationale.split(" ");
    var coloredTokens = tokens.map((token, index) => {
      const feature = Object.keys(llmFeatures).find((key) => llmFeatures[key][index] !== undefined);
      var colorClass = feature ? getTokenColor(index, feature) : "";
      if (colorClass) {
        // extract biascolor to see if it should be visible
        const biasColor = colorClass.split("-")[2];
        if (!copyBiasVisibility[biasColor as BiasColor]) {
          colorClass = "";
        }
      }
      // setBiasColorToBiasNameMap(biasColorToBiasNameMap);
      return (
        <span key={index} className={`px-1 ${colorClass}`}>
          {token}
        </span>
      );
    });
    
    // localStorage.setItem("biasColorToBiasNameMap", JSON.stringify(biasColorToBiasNameMap));
    // setBiasColorToBiasNameMap(biasColorToBiasNameMap);
    return coloredTokens;
  };

  return (
    <div className="p-4 pb-7 bg-sidebar-bg rounded-md flex flex-col space-y-6 flex-grow max-w-[933px] overflow-y-auto" style={{ width: 'calc(85% + 20px)' }}>
      <h3 className="text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg 2xl:text-xl font-bold text-white">Forecast Result</h3>
      <div className="flex flex-col space-y-3 sm:space-y-4 w-full">
        <p className="text-white text-[8px] sm:text-[10px] md:text-xs lg:text-sm"><strong>Question:</strong> {query}</p>
        <p className="text-white text-[8px] sm:text-[10px] md:text-xs lg:text-sm"><strong>Forecast Probability:</strong> {answer.forecast}</p>
        <p className="text-white text-[8px] sm:text-[10px] md:text-xs lg:text-sm"><strong>Forecaster Rationale:</strong></p>
        <p className="text-white text-[8px] sm:text-[10px] md:text-xs lg:text-sm break-all">{renderRationale()}</p>
      </div>
    </div>
  );
};

export default AnswerDisplay;