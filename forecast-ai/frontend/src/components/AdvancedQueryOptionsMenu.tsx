// src/components/AdvancedQueryOptionsMenu.tsx
import React, { ChangeEvent, useState } from "react";
import CloseMenuButton from "../assets/close-menu-button.svg";
import "../css/advanced-query-options-menu-custom-css.css";

type AdvancedQueryOptionsMenuProps = {
    setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const AdvancedQueryOptionsMenu: React.FC<AdvancedQueryOptionsMenuProps> = ({ setIsMenuOpen }) => {
    const [totalSourcesToCollect, setTotalSourcesToCollect] = useState<number>(50);
    const [newsRatio, setNewsRatio] = useState<number>(90);
    const [xRatio, setXRatio] = useState<number>(10);
    const [redditRatio, setRedditRatio] = useState<number>(0);
    const [totalSourcesToDisplay, setTotalSourcesToDisplay] = useState<number>(10);
    const [minNewsSourcesToDisplay, setMinNewsSourcesToDisplay] = useState<number>(0);
    const [maxNewsSourcesToDisplay, setMaxNewsSourcesToDisplay] = useState<number>(0);
    const [minXSourcesToDisplay, setMinXSourcesToDisplay] = useState<number>(0);
    const [maxXSourcesToDisplay, setMaxXSourcesToDisplay] = useState<number>(0);
    const [minRedditSourcesToDisplay, setMinRedditSourcesToDisplay] = useState<number>(0);
    const [maxRedditSourcesToDisplay, setMaxRedditSourcesToDisplay] = useState<number>(0);

    const handleApply = (e: React.MouseEvent<HTMLButtonElement>) => {
        setIsMenuOpen(false);
    }

    return (
        <div className="w-[480px] h-[40vh] bg-query-options-menu-bg py-5 px-4 pb-10 flex flex-col space-y-4 justify-center items-center absolute top-[-41vh] overflow-y-auto">
            <div className="w-full h-[10%] flex justify-between items-center">
                <h1 className="text-sm text-metrics-text font-bold">Advanced Query Options</h1>
                <button onClick={e => setIsMenuOpen(false)}>
                    <img src={CloseMenuButton} alt="close-menu-btn" className="w-[12px] h-[12px]" />
                </button>
            </div>
            <div className="w-full h-[90%] px-2 space-y-8">
                <div className="w-full space-y-4">
                    <h3 className="text-source-text font-bold underline text-xs">Data Source Collect Settings</h3>
                    <div className="w-full px-2 space-y-5">
                        <div className="w-full space-y-2">
                            <h4 className="text-xs text-metrics-text">Total Sources to Collect</h4>
                            <input type="number" className="bg-query-options-input-bg border border-metrics-text rounded-sm w-[100px] h-[40px] p-2 px-3 text-sm" value={totalSourcesToCollect} onChange={e => setTotalSourcesToCollect(Number(e.target.value))} />
                        </div>
                        <div className="w-full space-y-2">
                            <h4 className="text-xs text-metrics-text">Sources Percentage Allocation</h4>
                            <div className="w-full space-y-2">
                                <div className="flex flex-col">
                                    <p className="text-[10px] text-header-bar-text mb-2">News Ratio</p>
                                    <div className="w-full flex justify-start items-center space-x-2">
                                        <input type="range" min='0' max='100' className="w-[50%] cursor-pointer range-slider" style={{background: `linear-gradient(to right, #AEB0FF ${newsRatio}%, #383838 ${newsRatio}%)`}} value={newsRatio} onChange={e => setNewsRatio(Number(e.target.value))} />
                                        <div className="bg-query-options-input-bg p-1 rounded-sm w-[35px]">
                                            <p className="text-[10px]">{newsRatio}%</p>
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
                                <div>
                                    <p className="text-[10px] text-header-bar-text mb-2">X Ratio</p>
                                    <div className="w-full flex justify-start items-center space-x-2">
                                        <input type="range" min='0' max='100' className="w-[50%] cursor-pointer range-slider" style={{background: `linear-gradient(to right, #AEB0FF ${xRatio}%, #383838 ${xRatio}%)`}} value={xRatio} onChange={e => setXRatio(Number(e.target.value))} />
                                        <div className="bg-query-options-input-bg p-1 rounded-sm w-[35px]">
                                            <p className="text-[10px]">{xRatio}%</p>
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
                                <div>
                                    <p className="text-[10px] text-header-bar-text mb-2">Reddit Ratio</p>
                                    <div className="w-full flex justify-start items-center space-x-2">
                                        <input type="range" min='0' max='100' className="w-[50%] cursor-pointer range-slider" style={{background: `linear-gradient(to right, #AEB0FF ${redditRatio}%, #383838 ${redditRatio}%)`}} value={redditRatio} onChange={e => setRedditRatio(Number(e.target.value))} />
                                        <div className="bg-query-options-input-bg p-1 rounded-sm w-[35px]">
                                            <p className="text-[10px]">{redditRatio}%</p>
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
                            </div>
                        </div>
                        <div className="w-full space-y-2">
                            <h4 className="text-xs text-metrics-text">Date Range</h4>
                            <div className="w-full flex justify-between">
                                <div className="w-[45%] space-y-2">
                                    <p className="text-center text-xs text-header-bar-text">From</p>
                                    <button className="w-full rounded-lg h-9 text-query-options-date-picker-color border border-query-options-date-picker-color text-[10px] active:text-query-options-date-picker-active-color active:border-query-options-date-picker-active-color active:bg-query-options-date-picker-bg">Unspecifed</button>
                                </div>
                                <div className="w-[45%] space-y-2">
                                    <p className="text-center text-xs text-header-bar-text">To</p>
                                    <button className="w-full rounded-lg h-9 text-query-options-date-picker-color border border-query-options-date-picker-color text-[10px] active:text-query-options-date-picker-active-color active:border-query-options-date-picker-active-color active:bg-query-options-date-picker-bg">Unspecifed</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full space-y-4">
                    <h3 className="text-source-text font-bold underline text-xs">Display Settings</h3>
                    <div className="w-full px-2 space-y-5">
                        <div className="w-full space-y-2">
                            <h4 className="text-xs text-metrics-text">Total Sources to Display</h4>
                            <input type="number" className="bg-query-options-input-bg border border-metrics-text rounded-sm w-[100px] h-[40px] p-2 px-3 text-sm" value={totalSourcesToDisplay} onChange={e => setTotalSourcesToDisplay(Number(e.target.value))} />
                        </div>
                        <div className="w-full space-y-2">
                            <h4 className="text-xs text-metrics-text">Customize Display for Source Types</h4>
                            <div className="flex justify-between w-full items-center w-full">
                                <div className="flex flex-col space-y-1 w-[30%]">
                                    <div className="flex justify-between items-center space-x-1">
                                        <div className="w-full space-y-1">
                                            <p className="text-[10px] text-metrics-text">Min</p>
                                            <input type="number" className="bg-query-options-input-bg border border-metrics-text rounded-sm w-[60px] h-[40px] p-2 text-sm" value={minNewsSourcesToDisplay} onChange={e => setMinNewsSourcesToDisplay(Number(e.target.value))} />
                                        </div>
                                        <div className="w-full space-y-1">
                                            <p className="text-[10px] text-metrics-text">Max</p>
                                            <input type="number" className="bg-query-options-input-bg border border-metrics-text rounded-sm w-[60px] h-[40px] p-2 text-sm" value={maxNewsSourcesToDisplay} onChange={e => setMaxNewsSourcesToDisplay(Number(e.target.value))} />
                                        </div>
                                    </div>
                                    <p className="text-[9px] text-metrics-text">Number of News Sources to Display</p>
                                </div>
                                <div className="flex flex-col space-y-1 w-[30%]">
                                    <div className="flex justify-between items-center space-x-1">
                                        <div className="w-full space-y-1">
                                            <p className="text-[10px] text-metrics-text">Min</p>
                                            <input type="number" className="bg-query-options-input-bg border border-metrics-text rounded-sm w-[60px] h-[40px] p-2 text-sm" value={minXSourcesToDisplay} onChange={e => setMinXSourcesToDisplay(Number(e.target.value))} />
                                        </div>
                                        <div className="w-full space-y-1">
                                            <p className="text-[10px] text-metrics-text">Max</p>
                                            <input type="number" className="bg-query-options-input-bg border border-metrics-text rounded-sm w-[60px] h-[40px] p-2 text-sm" value={maxXSourcesToDisplay} onChange={e => setMaxXSourcesToDisplay(Number(e.target.value))} />
                                        </div>
                                    </div>
                                    <p className="text-[9px] text-metrics-text">Number of X Sources to Display</p>
                                </div>
                                <div className="flex flex-col space-y-1 w-[30%]">
                                    <div className="flex justify-between items-center space-x-1">
                                        <div className="w-full space-y-1">
                                            <p className="text-[10px] text-metrics-text">Min</p>
                                            <input type="number" className="bg-query-options-input-bg border border-metrics-text rounded-sm w-[60px] h-[40px] p-2 text-sm" value={minRedditSourcesToDisplay} onChange={e => setMinRedditSourcesToDisplay(Number(e.target.value))} />
                                        </div>
                                        <div className="w-full space-y-1">
                                            <p className="text-[10px] text-metrics-text">Max</p>
                                            <input type="number" className="bg-query-options-input-bg border border-metrics-text rounded-sm w-[60px] h-[40px] p-2 text-sm" value={maxRedditSourcesToDisplay} onChange={e => setMaxRedditSourcesToDisplay(Number(e.target.value))} />
                                        </div>
                                    </div>
                                    <p className="text-[9px] text-metrics-text">Number of Reddit Sources to Display</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end items-center">
                    <button className="px-4 py-2 rounded-lg text-source-text border border-source-text text-sm" onClick={handleApply}>Apply</button>
                </div>
            </div>
        </div>
    )
}

export default AdvancedQueryOptionsMenu;