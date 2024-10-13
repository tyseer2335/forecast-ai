// src/components/SourceCard.tsx
import React from "react";
import { SourceObject } from "../hooks/types";

type SourceCardProps = {
    source: SourceObject;
}

const SourceCard: React.FC<SourceCardProps> = ({ source }) => {
    return (
        <div className="bg-sidebar-bg px-4 py-6 rounded-md flex space-x-4 h-full pr-20 max-w-[800px] relative overflow-y-auto">
            <img src={source.logo} alt="source-logo" className="w-12 h-12 rounded-full" />
            <div className="space-y-6 h-full flex flex-col justify-start w-[95%]">
                <h3 className="font-semibold text-lg text-metrics-text">{source.title}</h3>
                <img src={source.image} alt="source-img" className="w-[306px] h-[35%]"/>
                <p className="text-source-text">{source.text}</p>
            </div>
            <p className="absolute top-[5px] right-[8px] text-xs text-mid-light-grey font-semibold z-10">{source.link}</p>
        </div>
    )
}

export default SourceCard;