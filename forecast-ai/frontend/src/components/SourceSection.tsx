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
import { set } from "date-fns";


type SourceSectionProps = {
    source: SourceObject;
    biasVisibility: BiasColorToBooleanMap;
    setBiasVisibility: React.Dispatch<React.SetStateAction<BiasColorToBooleanMap>>;
    biasColorToBiasNameMap: BiasColorToBiasNameMap | {};
    renderStage: number;
    setRenderStage: React.Dispatch<React.SetStateAction<number>>;
}

const SourceSection: React.FC<SourceSectionProps> = ({ source, biasVisibility, setBiasVisibility, biasColorToBiasNameMap, renderStage, setRenderStage }) => {
    // var localBiasColorToBiasNameMap: BiasColorToBiasNameMap = biasColorToBiasNameMap;
    // console.log("biasColorToBiasNameMap", biasColorToBiasNameMap);
    // const biasColorToBiasNameMap:  BiasColorToBiasNameMap = localStorage.getItem('biasColorToBiasNameMap') ? JSON.parse(localStorage.getItem('biasColorToBiasNameMap') || '{}') : {};

    // useEffect(() => {
    //     localBiasColorToBiasNameMap = biasColorToBiasNameMap;
    // }, [biasColorToBiasNameMap]);

    // useEffect(() => {
    //     if (biasColorToBiasNameMap) {  // Ensure dict-color-to-names is defined before setting visibility
    //       setDictColorToVisibility(...); // Update dict-color-to-visibility based on dict-color-to-names
    //     }
    //   }, [biasColorToBiasNameMap]);  // Run this effect when dict-color-to-names changes

    const handleToggleVisibility = (color: BiasColor) => {
        setBiasVisibility((prev) => {
            return {
                ...prev,
                [color]: !prev[color]
            }
        })
    }

    var handleToggleVisibilityWrapper = (color: BiasColor) => {
        return;
    }

    var DetectedBiasWrapper : React.FC<{ color: BiasColor }> = ({ color }) => {
        return <></>;
    }

    var biasColorToBiasNameMapRef = React.useRef(biasColorToBiasNameMap);

    // the below useEffect thinks biasColorToBiasNameMap is changing everytime, but it is not
    // found that they are all the same dictionaries. To prevent the change, how do we handle this?
    useEffect(() => {
        if (biasColorToBiasNameMapRef.current === biasColorToBiasNameMap) {
            return;
        }
        console.log(`Before: ${biasColorToBiasNameMapRef.current} After: ${biasColorToBiasNameMap}`);
        biasColorToBiasNameMapRef.current = biasColorToBiasNameMap;
            
        if (biasColorToBiasNameMap) {
            handleToggleVisibilityWrapper = (color: BiasColor) => {
                return handleToggleVisibility(color);
            }
            DetectedBiasWrapper = ({ color }) => {
                return DetectedBias({ color });
            }
        } else {
            console.log("biasColorToBiasNameMap is not defined");
            handleToggleVisibilityWrapper = (color: BiasColor) => {
                return;
            }
            DetectedBiasWrapper = ({ color }) => {
                return <></>;
            }
        }
    
    }, [biasColorToBiasNameMap]);

    
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


        
    // Reusable component for individual Detected Bias
    const DetectedBias: React.FC<{ color: BiasColor }> = ({ color }) => {
        var localBiasColorToBiasNameMap: BiasColorToBiasNameMap = {
            green: "",
            yellow: "",
            purple: "",
            red: "",
            blue: "",
            orange: "",
            pink: "",
            brown: "",
            white: "",
        }
        if (isBiasColorToBiasNameMap(biasColorToBiasNameMap)) {
            localBiasColorToBiasNameMap = biasColorToBiasNameMap;
        }
        if (!localBiasColorToBiasNameMap[color]) return null; // if (!biasIsDetectedMap[color]) return null;
        var biasName : string = localBiasColorToBiasNameMap[color]; // const biasName = biasColorToBiasNameMap[color];
        // biasName is in form of "feature2_overconfidence_bias" initially
        biasName = biasName.split("_").slice(1).map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
        return (
            <li className="text-mid-light-grey text-[8px] md:text-[10px] lg:text-[11px] xl:text-xs font-semibold flex justify-between items-center space-x-3">
                <button>
                    <img src={getButtonImg(color)} alt={`${color}-toggle-btn`} className="w-4 h-2 md:w-5 md:h-3 lg:w-6 lg:h-3 xl:w-7 xl:h-4" onClick={() => handleToggleVisibilityWrapper(color)} />
                </button>
                <p style={{textAlign: "left"}}>{biasName}</p>
            </li>
        )
    }

    return (
        <div className="w-full flex-grow flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-5 justify-center items-center rounded-md h-[90%]">
            <SourceCard source={source} />
            <div className="flex flex-row lg:flex-col justify-between h-[168px] lg:h-full items-start lg:items-end w-[88%] lg:w-[25%] lg:max-w-[216px]">
                <div className="flex flex-col bg-sidebar-bg p-4 pb-7 w-full space-y-3 h-full lg:h-auto rounded-md items-start max-w-[150px] md:max-w-[192px] lg:max-w-[216px]">
                    <h4 className="font-semibold text-metrics-text text-[10px] md:text-xs lg:text-sm xl:text-base">Detected Biases</h4>
                    {/* List of Detected Biases */}
                    <ul className="mt-2 space-y-3 w-full">
                        <DetectedBiasWrapper color="green" />
                        <DetectedBiasWrapper color="yellow" />
                        <DetectedBiasWrapper color="purple" />
                        <DetectedBiasWrapper color="red" />
                    </ul>
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