// src/components/SourceSection.tsx
import React from "react";
import { useEffect } from "react";
import SourceCard from "./SourceCard";
import GreenToggleButtonOn from "../assets/green-toggle-button.svg";
import YellowToggleButtonOn from "../assets/yellow-toggle-button.svg";
import PurpleToggleButtonOn from "../assets/purple-toggle-button.svg";
import RedToggleButtonOn from "../assets/red-toggle-button.svg";
import GreenToggleButtonOff from "../assets/green-toggle-button-off.svg";
import YellowToggleButtonOff from "../assets/yellow-toggle-button-off.svg";
import PurpleToggleButtonOff from "../assets/purple-toggle-button-off.svg";
import RedToggleButtonOff from "../assets/red-toggle-button-off.svg";
import ViewsCountImage from "../assets/views-count-image.svg";
import TrendingRateImage from "../assets/trending-rate-image.svg";
import RegionImage from "../assets/region-image.svg";
import { BiasColor, BiasColorToBooleanMap, BiasColorToBiasNameMap, SourceObject, isBiasColorToBiasNameMap } from "../hooks/types";

/**
 * @file SourceSection.tsx
 * 
 * @description
 * The `SourceSection` component displays source-specific data, including detected cognitive biases
 * and various metrics like views, trending rate, and region. It enables users to toggle visibility
 * for each detected bias type (color-coded) and integrates `SourceCard` to display the primary source content.
 * 
 * @component
 *
 * Features:
 * - **Bias Toggle Buttons**: Allows toggling of different bias categories (e.g., green, yellow, purple, red) with distinct icons for each.
 * - **Bias Name Mapping**: Dynamically maps color-coded biases to descriptive names based on `BiasColorToBiasNameMap`.
 * - **Bias Visibility Control**: Controls the visibility of each bias type based on user toggles, and adjusts the detected bias list dynamically.
 * - **Metric Display**: Shows key metrics (Views Count, Trending Rate, Region) associated with the source.
 * - **Responsive Design**: Adjusts layout and style based on screen size, using Tailwind CSS for flexibility.
 *
 * @param {SourceSectionProps} props - Props include `source` (source data), `biasVisibility` (map to control bias visibility),
 *                                      `setBiasVisibility` (state updater for bias visibility), `biasColorToBiasNameMap`
 *                                      (maps bias colors to names), `renderStage` (render stage indicator for bias names),
 *                                      and `setRenderStage` (state updater for render stage).
 *
 * @returns {React.FC}
 * Renders the source information and detected biases with toggle controls and displays metrics related to each source.
 * It utilizes `SourceCard` for displaying the main source data and renders the detected biases as a list of toggleable items.
 */


type SourceSectionProps = {
    source: SourceObject;
    biasVisibility: BiasColorToBooleanMap;
    setBiasVisibility: React.Dispatch<React.SetStateAction<BiasColorToBooleanMap>>;
    biasColorToBiasNameMap: BiasColorToBiasNameMap;
    renderStage: number;
    setRenderStage: React.Dispatch<React.SetStateAction<number>>;
}

const SourceSection: React.FC<SourceSectionProps> = ({ source, biasVisibility, setBiasVisibility, biasColorToBiasNameMap, renderStage, setRenderStage }) => {
    var isToggleMenuReadyWithNames = false;
    var localNames : BiasColorToBiasNameMap = {
        green: "feature1_bias_1",
        yellow: "feature2_bias_2",
        purple: "feature3_bias_3",
        red: "feature4_bias_4"
    }

    const getButtonImg = (color: BiasColor) => {
        switch (color) {
            case "green":
                if (biasVisibility.green) return GreenToggleButtonOn;
                else return GreenToggleButtonOff;
            case "yellow":
                if (biasVisibility.yellow) return YellowToggleButtonOn;
                else return YellowToggleButtonOff;
            case "purple":
                if (biasVisibility.purple) return PurpleToggleButtonOn;
                else return PurpleToggleButtonOff;
            case "red":
                if (biasVisibility.red) return RedToggleButtonOn;
                else return RedToggleButtonOff;
            default:
                return GreenToggleButtonOn;
        }
    }


    const handleToggleVisibility = (color: BiasColor) => {
        setBiasVisibility((prev) => {
            return {
                ...prev,
                [color]: !prev[color]
            }
        })
    }

    const DetectedBiases: React.FC = () => {
        if (renderStage === 0) {
            return null;
        } else if (renderStage >= 1 && !isToggleMenuReadyWithNames) {
            localNames = biasColorToBiasNameMap;
        }
        const listOfBiases = (
            <ul className="mt-2 space-y-3 w-full">
                {Object.keys(localNames).map((color) => {
                    if (!localNames[color as BiasColor]) return null;
                    return <DetectedBias color={color as BiasColor} name={localNames[color as BiasColor]} />
                })}
            </ul>
        )
        if (renderStage === 1) {
            isToggleMenuReadyWithNames = true;
        }
        return listOfBiases;
    }
        
    // Reusable component for individual Detected Bias
    const DetectedBias: React.FC<{ color: BiasColor, name: string }> = ({ color, name }) => {
        var biasName : string = name; // const biasName = biasColorToBiasNameMap[color];
        // biasName is in form of "feature2_overconfidence_bias" initially
        biasName = biasName.split("_").slice(1).map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
        return (
            <li className="text-mid-light-grey text-[8px] md:text-[10px] lg:text-[11px] xl:text-xs font-semibold flex space-x-3">
                <button>
                    <img src={getButtonImg(color)} alt={`${color}-toggle-btn`} className="w-4 h-2 md:w-5 md:h-3 lg:w-6 lg:h-3 xl:w-7 xl:h-4" onClick={() => handleToggleVisibility(color)} />
                </button>
                <p>{biasName}</p>
            </li>
        )
    }

    useEffect(() => {
        if (renderStage === 1 && isToggleMenuReadyWithNames) {
            setRenderStage(2);
        }
    }, [isToggleMenuReadyWithNames]);


    return (
        <div className="w-full flex-grow flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-5 justify-center items-center rounded-md h-[90%]">
            <SourceCard source={source} />
            <div className="flex flex-row lg:flex-col justify-between h-[168px] lg:h-full items-start lg:items-end w-[88%] lg:w-[25%] lg:max-w-[216px]">
                <div className="flex flex-col bg-sidebar-bg p-4 pb-7 w-full space-y-3 h-full lg:h-auto rounded-md items-start max-w-[150px] md:max-w-[192px] lg:max-w-[216px]">
                    <h4 className="font-semibold text-metrics-text text-[10px] md:text-xs lg:text-sm xl:text-base">Detected Biases</h4>
                    {/* List of Detected Biases */}
                    <DetectedBiases />
                </div>
                <div className="flex flex-col bg-sidebar-bg p-4 pb-7 w-full h-full lg:h-auto space-y-4 md:space-y-6 lg:space-y-3 rounded-md items-start max-w-[150px] md:max-w-[192px] lg:max-w-[216px]">
                    <h4 className="font-semibold text-metrics-text text-[10px] md:text-xs lg:text-sm xl:text-base">Metrics</h4>
                    <div className="mt-2 space-y-3 w-full">
                        <div className="text-mid-light-grey text-[8px] md:text-[10px] lg:text-[11px] xl:text-xs font-semibold flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                                <img src={ViewsCountImage} alt="views-count-image" className="w-4 h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6" />
                                <p>Views Count</p>
                            </div>
                            <p className="text-metrics-text">{source.metrics.viewsCount}</p>
                        </div>
                        <div className="text-mid-light-grey text-[8px] md:text-[10px] lg:text-[11px] xl:text-xs font-semibold flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                                <img src={TrendingRateImage} alt="trending-rate-image" className="w-4 h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6" />
                                <p>Trending Rate</p>
                            </div>
                            <p className="text-metrics-text">{source.metrics.trendingRate}%</p>
                        </div>
                        <div className="text-mid-light-grey text-[8px] md:text-[10px] lg:text-[11px] xl:text-xs font-semibold flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                                <img src={RegionImage} alt="region-image" className="w-4 h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6" />
                                <p>Region</p>
                            </div>
                            <p className="text-metrics-text">{source.metrics.region}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SourceSection;