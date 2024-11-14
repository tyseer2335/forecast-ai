import React, { useEffect, useRef } from "react";
import { BiasColor, BiasColorToBiasNameMap, BiasColorToBooleanMap } from "../hooks/types";
import { set } from "date-fns";
import { render } from "@testing-library/react";

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
  setBiasColorToBiasNameMap: React.Dispatch<React.SetStateAction<BiasColorToBiasNameMap>>;
  renderStage: number;
  setRenderStage: React.Dispatch<React.SetStateAction<number>>;
};


const AnswerDisplay: React.FC<AnswerDisplayProps> = ({ query, answer, biasVisibility, setBiasColorToBiasNameMap, renderStage, setRenderStage }) => {
  const { forecaster_rationale: rationale, llm_features: llmFeatures } = answer;
  var isBiasNamesReady = false;
  var biasColorToBiasNameMap : BiasColorToBiasNameMap = {
    // all colors are initially unassigned
    green: "",
    yellow: "",
    purple: "",
    red: ""
  };

  // var localVisibility : BiasColorToBooleanMap = {
  //   green: true,
  //   yellow: true,
  //   purple: true,
  //   red: true
  // }
  var localVisibility : BiasColorToBooleanMap = biasVisibility;

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
      console.log("No assignable color found for feature: ", feature);
      return "";
    }

    // Assign the assignable color to the feature
    biasColorToBiasNameMap[assignableColor] = feature;

    // Assign the style based on the metric
    // return `bg-rgba(83, 168, 102, 0.7)`;
    return `bg-heatmap-${assignableColor}-bg bg-opacity-${metric * 100}`;
  };

  // React Element Version
  const Rationale : React.FC = () => {
    const tokens = rationale.split(" ");
    var coloredTokens = tokens.map((token, index) => {
      const feature = Object.keys(llmFeatures).find((key) => llmFeatures[key][index] !== undefined);
      var colorClass = feature ? getTokenColor(index, feature) : "";
      if (colorClass) {
        const biasColor = colorClass.split("-")[2];
        if (!localVisibility[biasColor as BiasColor]) {
          colorClass = "";
        }
      }
      return (
        <span key={index} className={`px-1 ${colorClass}`}>
          {token}
        </span>
      );
    });
    if (renderStage === 0) { 
      isBiasNamesReady = true;} 
    return <>{coloredTokens}</>;
  }

  
  
  // JSX version
  const renderRationale = () => {
    const tokens = rationale.split(" ");
    var coloredTokens = tokens.map((token, index) => {
      const feature = Object.keys(llmFeatures).find((key) => llmFeatures[key][index] !== undefined);
      var colorClass = feature ? getTokenColor(index, feature) : "";
      if (colorClass) {
        const biasColor = colorClass.split("-")[2];
        if (!localVisibility[biasColor as BiasColor]) {
          colorClass = "";
        }
      }
      return (
        <span key={index} className={`px-1 ${colorClass}`}>
          {token}
        </span>
      );
    });
    if (renderStage === 0) { 
      isBiasNamesReady = true;} 
    return coloredTokens;
  };

  useEffect(() => {
    if (renderStage === 0 && isBiasNamesReady) {
      setBiasColorToBiasNameMap(biasColorToBiasNameMap);
      setRenderStage(1);
    } else if (renderStage >= 2) {
      // Because the above code is printing object Object, we need to use JSON.stringify
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
        {/* <p className="text-white text-[8px] sm:text-[10px] md:text-xs lg:text-sm break-all">{renderRationale()}</p> */}
        <p className="text-white text-[8px] sm:text-[10px] md:text-xs lg:text-sm break-all">
          <Rationale />
        </p>
      </div>
    </div>
  );
};

export default AnswerDisplay;