// src/components/SourceSection.tsx
import React from "react";
import SourceCard from "./SourceCard";
import GreenToggleButtonOn from "../assets/green-toggle-button.svg";
import YellowToggleButtonOn from "../assets/yellow-toggle-button.svg";
import PurpleToggleButtonOn from "../assets/purple-toggle-button.svg";
import RedToggleButtonOn from "../assets/red-toggle-button.svg";
import GreenToggleButtonOff from "../assets/green-toggle-button-off.svg";
import YellowToggleButtonOff from "../assets/yellow-toggle-button-off.svg";
import PurpleToggleButtonOff from "../assets/purple-toggle-button-off.svg";
import RedToggleButtonOff from "../assets/red-toggle-button-off.svg";
import { BiasColor, SourceObject } from "../hooks/types";
import { biasColorToBiasNameMap } from "../hooks/constants";
import PlatformIcon from "../assets/metrics/platform.svg";
import PublishedDateIcon from "../assets/metrics/calendar.svg";
import RelevanceScoreIcon from "../assets/metrics/rating.svg";
import RankingIcon from "../assets/metrics/stats.svg";
import TotalArticlesIcon from "../assets/metrics/total-collected.svg";
import CollapseIcon from "../assets/metrics/collapse.svg";
import ExpandIcon from "../assets/metrics/expand.svg";

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
    visibleBiasColor: BiasColor | "";
    setVisibleBiasColor: React.Dispatch<React.SetStateAction<BiasColor | "">>;
}

const SourceSection: React.FC<SourceSectionProps> = ({ source, visibleBiasColor, setVisibleBiasColor }) => {
    const [isMetricsExpanded, setIsMetricsExpanded] = React.useState(false);
    const getButtonImg = (color: BiasColor) => {
        switch (color) {
            case "green":
                if (visibleBiasColor === "green") return GreenToggleButtonOn;
                else return GreenToggleButtonOff;
            case "yellow":
                if (visibleBiasColor === "yellow") return YellowToggleButtonOn;
                else return YellowToggleButtonOff;
            case "purple":
                if (visibleBiasColor === "purple") return PurpleToggleButtonOn;
                else return PurpleToggleButtonOff;
            case "red":
                if (visibleBiasColor === "red") return RedToggleButtonOn;
                else return RedToggleButtonOff;
            default:
                return GreenToggleButtonOn;
        }
    }


    const handleToggleVisibility = (color: BiasColor) => {
        if (visibleBiasColor === color) {
            setVisibleBiasColor("");
        } else {
            setVisibleBiasColor(color);
        }
    }

    const handleToggleMetrics = () => {
        setIsMetricsExpanded(!isMetricsExpanded);
    }

    // Reusable component for individual Detected Bias
    const DetectedBias: React.FC<{ color: BiasColor }> = ({ color }) => {
        // Get the Bias Name of this color in Title Case
        const biasName = biasColorToBiasNameMap[color as BiasColor].split('_').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        return (
            <li className="text-mid-light-grey text-[8px] md:text-[10px] lg:text-[11px] xl:text-xs font-semibold flex space-x-3">
                <button>
                    <img src={getButtonImg(color)} alt={`${color}-toggle-btn`} className="w-4 h-2 md:w-5 md:h-3 lg:w-6 lg:h-3 xl:w-7 xl:h-4" onClick={() => handleToggleVisibility(color)} />
                </button>
                <p>{biasName}</p>
            </li>
        )
    }

    // Reusable Component for Metric Display that takes img src, title, and value
    const MetricDisplay: React.FC<{ imgSrc: string, title: string, value: string | number }> = ({ imgSrc, title, value }) => {
        return (
            <div className="text-mid-light-grey text-[8px] md:text-[10px] lg:text-[11px] xl:text-xs font-semibold flex justify-between items-center">
                <div className="flex items-center space-x-2 whitespace-pre">
                    <img src={imgSrc} alt={`${title}-image`} className="w-3 h-3 lg:w-4 lg:h-4 xl:w-5 xl:h-5 opacity-60" />
                    <p>{title}</p>
                </div>
                <p className="text-metrics-text">{value}</p>
            </div>
        )
    }

    return (
        <div className="w-full flex-grow flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-5 justify-center items-center rounded-md h-[90%]">
            <SourceCard source={source} />
            <div className="flex flex-row lg:flex-col justify-between h-[168px] lg:h-full items-start lg:items-end w-[88%] lg:w-[25%] lg:max-w-[216px]">  
                {/* To make this block height to be fit the content but not auto otherwise" */}
                <div className={`flex flex-col bg-sidebar-bg p-4 w-full space-y-4 md:space-y-6 lg:space-y-3 rounded-md items-start max-w-[150px] md:max-w-[192px] lg:max-w-[216px] ${isMetricsExpanded ? 'block h-full lg:h-auto' : 'h-fit'}`}>
                    
                    <div className="flex justify-between items-center cursor-pointer w-full"
                        onClick={handleToggleMetrics}>
                        <h4 className="flex font-semibold text-metrics-text text-[10px] md:text-xs lg:text-sm xl:text-base">Metrics</h4>
                        <img src={isMetricsExpanded ? CollapseIcon : ExpandIcon} alt="expand-collapse-icon" className="w-4 h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 cursor-pointer flex justify-end" />
                    </div>
                    <div className={`mt-1 space-y-3 w-full overflow-x-scroll ${isMetricsExpanded ? 'block' : 'hidden'} pb-3`}>
                        <div className="space-y-4 w-full overflow-x-scroll">
                            <MetricDisplay imgSrc={PlatformIcon} title="Platform" value={source.metrics.platform} />
                            <div className="text-mid-light-grey text-[8px] md:text-[10px] lg:text-[11px] xl:text-xs font-semibold flex-col md:flex-row md:justify-between md:items-center space-y-[0.8rem]">
                                <div className="flex items-center space-x-2 justify-start">
                                    <img src={PublishedDateIcon} alt="published-date-icon" className="w-3 h-3 lg:w-4 lg:h-4 xl:w-5 xl:h-5 opacity-60" />
                                    <p>Published Date</p>
                                </div>
                                <p className="text-metrics-text justify-self-end text-right">
                                    {source.metrics.publishedDate}</p>
                            </div>
                            <MetricDisplay imgSrc={RelevanceScoreIcon} title="Relevance Score" value={(source.metrics.relevanceScore).toString()} />
                            <MetricDisplay imgSrc={RankingIcon} title="Ranking (1-6)" value={source.metrics.ranking} />
                            <MetricDisplay imgSrc={TotalArticlesIcon} title={`Total Articles\nfrom ${source.metrics.platform}`} value={source.metrics.totalArticlesOfSource} />                        
                        </div>
                    </div>
                </div>
                <div className="flex flex-col bg-sidebar-bg p-4 pb-7 w-full space-y-3 h-full lg:h-auto rounded-md items-start max-w-[150px] md:max-w-[192px] lg:max-w-[216px]">
                    <h4 className="font-semibold text-metrics-text text-[10px] md:text-xs lg:text-sm xl:text-base">Detected Biases</h4>
                    {/* List of Detected Biases */}
                    <ul className="space-y-2 w-full">
                        <DetectedBias color="green" />
                        <DetectedBias color="yellow" />
                        <DetectedBias color="purple" />
                        <DetectedBias color="red" />
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default SourceSection;