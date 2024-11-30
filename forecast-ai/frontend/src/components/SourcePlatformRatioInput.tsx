// src/components/SourcePlatformRatioInput.tsx
import React from "react";

type SourcePlatformRatioInputProps = {
    index: number;
    platformName: string;
    platformRatio: number;
    setPlatformRatio: (index: number, value: number) => void;
}

const SourcePlatformRatioInput: React.FC<SourcePlatformRatioInputProps> = ({ index, platformName, platformRatio, setPlatformRatio }) => {
    return (
        <div className="flex flex-col">
            <p className="text-[10px] text-header-bar-text mb-2">{platformName} Ratio</p>
            <div className="w-full flex justify-start items-center space-x-2">
                <input type="range" min='0' max='100' className="w-[50%] cursor-pointer range-slider" style={{background: `linear-gradient(to right, #AEB0FF ${platformRatio}%, #383838 ${platformRatio}%)`}} value={platformRatio} onChange={e => setPlatformRatio(index, Number(e.target.value))} data-testid={`${platformName.toLowerCase()}-ratio-input`} />
                <div className="bg-query-options-input-bg p-1 rounded-sm w-[35px]">
                    <p className="text-[10px]">{platformRatio}%</p>
                </div>
            </div>
            <div className="w-[50%] grid grid-cols-11 gap-4">
                <span className="text-[8px] text-header-bar-text col-start-1">0</span>
                <span className="text-[8px] text-header-bar-text col-start-2">10</span>
                <span className="text-[8px] text-header-bar-text col-start-3">20</span>
                <span className="text-[8px] text-header-bar-text col-start-4">30</span>
                <span className="text-[8px] text-header-bar-text col-start-5">40</span>
                <span className="text-[8px] text-header-bar-text col-start-6">50</span>
                <span className="text-[8px] text-header-bar-text col-start-7">60</span>
                <span className="text-[8px] text-header-bar-text col-start-8">70</span>
                <span className="text-[8px] text-header-bar-text col-start-9">80</span>
                <span className="text-[8px] text-header-bar-text col-start-10">90</span>
                <span className="text-[8px] text-header-bar-text col-start-11">100</span>
            </div>
        </div>
    );
};

export default SourcePlatformRatioInput;