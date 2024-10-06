// src/components/SourceCard.tsx
import React from "react";
import Source from "./Source";
import GreenToggleButton from "../assets/green-toggle-button.svg";
import YellowToggleButton from "../assets/yellow-toggle-button.svg";
import PurpleToggleButton from "../assets/purple-toggle-button.svg";
import RedToggleButton from "../assets/red-toggle-button.svg";
import ViewsCountImage from "../assets/views-count-image.svg";
import TrendingRateImage from "../assets/trending-rate-image.svg";
import RegionImage from "../assets/region-image.svg";

const SourceCard: React.FC = () => {
    return (
        <div className="w-full flex-grow flex space-x-5 justify-center items-center rounded-md h-[95%]">
            <Source />
            <div className="flex flex-col justify-between w-100 h-full items-end w-[216px]">
                <div className="flex flex-col bg-sidebar-bg p-4 pb-7 w-full space-y-3 rounded-md flex flex-col items-start">
                    <h4 className="font-semibold text-metrics-text">Detected Biases</h4>
                    <ul className="mt-2 space-y-3 w-full">
                        <li className="text-mid-light-grey text-xs font-semibold flex justify-between items-center space-x-3">
                            <button>
                                <img src={GreenToggleButton} alt="green-toggle-btn" className="w-7 h-4" />
                            </button>
                            <p>Bias Short Description</p>
                        </li>
                        <li className="text-mid-light-grey text-xs font-semibold flex justify-between items-center space-x-3">
                            <button>
                                <img src={YellowToggleButton} alt="green-toggle-btn" className="w-7 h-4" />
                            </button>
                            <p>Bias Short Description</p>
                        </li>
                        <li className="text-mid-light-grey text-xs font-semibold flex justify-between items-center space-x-3">
                            <button>
                                <img src={PurpleToggleButton} alt="green-toggle-btn" className="w-7 h-4" />
                            </button>
                            <p>Bias Short Description</p>
                        </li>
                        <li className="text-mid-light-grey text-xs font-semibold flex justify-between items-center space-x-3">
                            <button>
                                <img src={RedToggleButton} alt="green-toggle-btn" className="w-7 h-4" />
                            </button>
                            <p>Bias Short Description</p>
                        </li>
                    </ul>
                </div>
                <div className="flex flex-col bg-sidebar-bg p-4 pb-7 w-full space-y-3 rounded-md items-start">
                    <h4 className="font-semibold text-metrics-text">Metrics</h4>
                    <ul className="mt-2 space-y-3 w-full">
                        <li className="text-mid-light-grey text-xs font-semibold flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                                <img src={ViewsCountImage} alt="green-toggle-btn" className="w-6 h-6" />
                                <p>Views Count</p>
                            </div>
                            <p className="text-metrics-text">483</p>
                        </li>
                        <li className="text-mid-light-grey text-xs font-semibold flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                                <img src={TrendingRateImage} alt="green-toggle-btn" className="w-6 h-6" />
                                <p>Trending Rate</p>
                            </div>
                            <p className="text-metrics-text">22%</p>
                        </li>
                        <li className="text-mid-light-grey text-xs font-semibold flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                                <img src={RegionImage} alt="green-toggle-btn" className="w-6 h-6" />
                                <p>Region</p>
                            </div>
                            <p className="text-metrics-text">Atlanta, USA</p>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default SourceCard;