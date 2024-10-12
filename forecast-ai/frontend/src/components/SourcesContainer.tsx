// src/components/SourcesContainer.tsx
import React, { useState } from "react";
import ScrollLeftButton from "../assets/scroll-left-button.svg";
import ScrollRightButton from "../assets/scroll-right-button.svg";
import SourceSection from "./SourceSection";
import { Source } from "./MainContainer";

type SourcesContainerProps = {
    sources: Source[];
}

const SourcesContainer: React.FC<SourcesContainerProps> = ({ sources }) => {
    const [currentSource, setCurrentSource] = useState(0);

    const decrementCurrentSource = () => {
        if (currentSource > 0) {
            setCurrentSource(currentSource => currentSource - 1);
        }
    }

    const incrementCurrentSource = () => {
        if (currentSource < sources.length - 1) {
            setCurrentSource(currentSource => currentSource + 1);
        }
    }

    return (
        <div className="w-full flex-grow space-y-4 bg-screen-black flex flex-col h-[90%] relative">
            <h1 className="font-bold text-chat-message-text text-xl">Sources</h1>
            <SourceSection source={sources[currentSource]} />
            <button onClick={decrementCurrentSource} className="absolute left-0 top-1/2">
                <img src={ScrollLeftButton} alt="scroll-left-btn" className="w-5 h-5" />
            </button>
            <button onClick={incrementCurrentSource} className="absolute right-0 top-1/2">
                <img src={ScrollRightButton} alt="scroll-left-btn" className="w-6 h-6" />
            </button>
        </div>
    )
}

export default SourcesContainer;