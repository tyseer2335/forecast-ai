// src/components/SourcesContainer.tsx
import React, { useState } from "react";
import ScrollLeftButton from "../assets/scroll-left-button.svg";
import ScrollRightButton from "../assets/scroll-right-button.svg";
import SourceSection from "./SourceSection";
import { BiasVisibility, SourceObject } from "../hooks/types";
import ErrorMessage from "./ErrorMessage";
import LoadingBar from "./LoadingBar";

type SourcesContainerProps = {
    sources: SourceObject[];
    error: string | undefined;
    loading: boolean;
    status: string | undefined;
    biasVisibility: BiasVisibility;
    setbiasVisibility: React.Dispatch<React.SetStateAction<BiasVisibility>>;
}

const SourcesContainer: React.FC<SourcesContainerProps> = ({ sources, error, loading, status, biasVisibility, setbiasVisibility }) => {
    const [currentSource, setCurrentSource] = useState(0);

    const decrementCurrentSource = () => {
        if (currentSource > 0) {
            setCurrentSource(currentSource - 1);
        }
    }

    const incrementCurrentSource = () => {
        if (currentSource < sources.length - 1) {
            setCurrentSource(currentSource + 1);
        }
    }

    return (
        <div className="w-full space-y-4 bg-screen-black flex flex-col h-[65%] min-h-[65%] max-h-[65%] sm:h-[62%] sm:min-h-[62%] sm:max-h-[62%] md:h-[65%] md:min-h-[65%] md:max-h-[65%] lg:h-[52%] lg:min-h-[52%] lg:max-h-[52%]">
            {loading ? (
                <div className="flex justify-center items-center h-full">
                    <LoadingBar status={status} />
                </div>
            ) : (
                error ? (
                    <ErrorMessage error={error || 'Error generating answer to query'} />
                ) : (
                    <div className="w-full space-y-4 bg-screen-black flex flex-col h-full relative">
                        <h1 className="font-bold text-chat-message-text text-sm md:text-base lg:text-lg xl:text-xl">Sources</h1>
                        {/* <SourceSection source={sources[currentSource]} biasVisibility={sources[currentSource].biasVisibility} setBiasVisibility={setbiasVisibility} /> */}
                        <SourceSection source={sources[currentSource]} biasVisibility={biasVisibility} setBiasVisibility={setbiasVisibility} />
                        <button onClick={decrementCurrentSource} className="absolute left-0 top-[38%] lg:top-1/2 cursor-pointer" data-testid="decrement-btn">
                            <img src={ScrollLeftButton} alt="scroll-left-btn" className="w-5 h-5" />
                        </button>
                        <button onClick={incrementCurrentSource} className="absolute right-0 top-[38%] lg:top-1/2 cursor-pointer" data-testid="increment-btn">
                            <img src={ScrollRightButton} alt="scroll-left-btn" className="w-6 h-6" />
                        </button>
                    </div>
                )
            )}
        </div>
    )
}

export default SourcesContainer;