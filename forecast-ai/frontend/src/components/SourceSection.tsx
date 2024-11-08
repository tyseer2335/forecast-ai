// src/components/SourceSection.tsx
import React from "react";
import SourceCard from "./SourceCard";
import GreenToggleButton from "../assets/green-toggle-button.svg";
import YellowToggleButton from "../assets/yellow-toggle-button.svg";
import PurpleToggleButton from "../assets/purple-toggle-button.svg";
import RedToggleButton from "../assets/red-toggle-button.svg";
import ViewsCountImage from "../assets/views-count-image.svg";
import TrendingRateImage from "../assets/trending-rate-image.svg";
import RegionImage from "../assets/region-image.svg";
import { SourceObject } from "../hooks/types";

type SourceSectionProps = {
    source: SourceObject;
}

const SourceSection: React.FC<SourceSectionProps> = ({ source }) => {
    return (
        <div className="w-full flex-grow flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-5 justify-center items-center rounded-md h-[90%]">
            <SourceCard source={source} />
            <div className="flex flex-row lg:flex-col justify-between h-[168px] lg:h-full items-start lg:items-end w-[88%] lg:w-[25%] lg:max-w-[216px]">
                <div className="flex flex-col bg-sidebar-bg p-4 pb-7 w-full space-y-3 h-full lg:h-auto rounded-md items-start max-w-[192px] lg:max-w-[216px]">
                    <h4 className="font-semibold text-metrics-text text-xs lg:text-sm xl:text-base">Detected Biases</h4>
                    <ul className="mt-2 space-y-3 w-full">
                        <li className="text-mid-light-grey text-[10px] lg:text-[11px] xl:text-xs font-semibold flex justify-between items-center space-x-3">
                            <button>
                                <img src={GreenToggleButton} alt="green-toggle-btn" className="w-4 h-2 md:w-5 md:h-3 lg:w-6 lg:h-3 xl:w-7 xl:h-4" />
                            </button>
                            <p>Bias Description</p>
                        </li>
                        <li className="text-mid-light-grey text-[10px] lg:text-[11px] xl:text-xs font-semibold flex justify-between items-center space-x-3">
                            <button>
                                <img src={YellowToggleButton} alt="green-toggle-btn" className="w-4 h-2 md:w-5 md:h-3 lg:w-6 lg:h-3 xl:w-7 xl:h-4" />
                            </button>
                            <p>Bias Description</p>
                        </li>
                        <li className="text-mid-light-grey text-[10px] lg:text-[11px] xl:text-xs font-semibold flex justify-between items-center space-x-3">
                            <button>
                                <img src={PurpleToggleButton} alt="green-toggle-btn" className="w-4 h-2 md:w-5 md:h-3 lg:w-6 lg:h-3 xl:w-7 xl:h-4" />
                            </button>
                            <p>Bias Description</p>
                        </li>
                        <li className="text-mid-light-grey text-[10px] lg:text-[11px] xl:text-xs font-semibold flex justify-between items-center space-x-3">
                            <button>
                                <img src={RedToggleButton} alt="green-toggle-btn" className="w-4 h-2 md:w-5 md:h-3 lg:w-6 lg:h-3 xl:w-7 xl:h-4" />
                            </button>
                            <p>Bias Description</p>
                        </li>
                    </ul>
                </div>
                <div className="flex flex-col bg-sidebar-bg p-4 pb-7 w-full h-full lg:h-auto space-y-6 lg:space-y-3 rounded-md items-start max-w-[192px] lg:max-w-[216px]">
                    <h4 className="font-semibold text-metrics-text text-xs lg:text-sm xl:text-base">Metrics</h4>
                    <div className="mt-2 space-y-3 w-full">
                        <div className="text-mid-light-grey text-[10px] lg:text-[11px] xl:text-xs font-semibold flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                                <img src={ViewsCountImage} alt="views-count-image" className="w-4 h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6" />
                                <p>Views Count</p>
                            </div>
                            <p className="text-metrics-text">{source.metrics.viewsCount}</p>
                        </div>
                        <div className="text-mid-light-grey text-[10px] lg:text-[11px] xl:text-xs font-semibold flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                                <img src={TrendingRateImage} alt="trending-rate-image" className="w-4 h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6" />
                                <p>Trending Rate</p>
                            </div>
                            <p className="text-metrics-text">{source.metrics.trendingRate}%</p>
                        </div>
                        <div className="text-mid-light-grey text-[10px] lg:text-[11px] xl:text-xs font-semibold flex justify-between items-center">
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