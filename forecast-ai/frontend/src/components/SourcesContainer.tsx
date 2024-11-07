// src/components/SourcesContainer.tsx
import React, { useState } from "react";
import ScrollLeftButton from "../assets/scroll-left-button.svg";
import ScrollRightButton from "../assets/scroll-right-button.svg";
import SourceSection from "./SourceSection";
import { SourceObject } from "../hooks/types";
import ErrorMessage from "./ErrorMessage";
import LoadingBar from "./LoadingBar";

type SourcesContainerProps = {
    sources: SourceObject[];
    error: string | undefined;
    loading: boolean;
    status: string | undefined;
}

const SourcesContainer: React.FC<SourcesContainerProps> = ({ sources, error, loading, status }) => {
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
        <div className="w-full space-y-4 bg-screen-black flex flex-col h-[52%]">
            {loading ? (
                <LoadingBar status={status} />
            ) : (
                error ? (
                    <ErrorMessage error={error} />
                ) : (
                    <div className="w-full space-y-4 bg-screen-black flex flex-col h-full relative">
                        <h1 className="font-bold text-chat-message-text text-xl">Sources</h1>
                        <SourceSection source={sources[currentSource]} />
                        <button onClick={decrementCurrentSource} className="absolute left-0 top-1/2 cursor-pointer" data-testid="decrement-btn">
                            <img src={ScrollLeftButton} alt="scroll-left-btn" className="w-5 h-5" />
                        </button>
                        <button onClick={incrementCurrentSource} className="absolute right-0 top-1/2 cursor-pointer" data-testid="increment-btn">
                            <img src={ScrollRightButton} alt="scroll-left-btn" className="w-6 h-6" />
                        </button>
                    </div>
                )
            )}
        </div>
    )
}

export default SourcesContainer;