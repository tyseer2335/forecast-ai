// src/components/SourceCard.tsx
import React from "react";
import { SourceObject } from "../hooks/types";

type SourceCardProps = {
    source: SourceObject;
}

const SourceCard: React.FC<SourceCardProps> = ({ source }) => {
    const renderText = (text: string) => {
        const sentences = text.split('\n');
        return sentences.map((sentence, index) => (
            <span key={index}>
                {sentence}
                <br />
                <br />
            </span>
        ));
    };

    return (
        <div className="bg-sidebar-bg px-4 py-10 rounded-md flex space-x-4 h-full pr-20 w-[65%] max-w-[697px] relative overflow-y-auto">
            <img src={source.logo} alt="source-logo" className="w-12 h-12 rounded-full" data-testid="source-logo" />
            <div className="space-y-6 h-full flex flex-col justify-start w-[95%]">
                <h3 className="font-semibold text-lg text-metrics-text" data-testid="source-title">{source.title}</h3>
                <img src={source.image} alt="source-img" className="w-[80%] max-w-[306px] h-[35%]" data-testid="source-image"/>
                <p className="text-source-text text-sm" data-testid="source-text">{renderText(source.text)}</p>
            </div>
            <a href={source.link} target="_blank" className="absolute top-[10px] right-[8px] text-xs text-mid-light-grey font-semibold z-10">Click here for the actual content</a>
        </div>
    )
}

export default SourceCard;