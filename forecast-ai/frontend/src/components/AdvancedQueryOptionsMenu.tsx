// src/components/AdvancedQueryOptionsMenu.tsx
import React, { useEffect, useState, useRef } from "react";
import CloseMenuButton from "../assets/close-menu-button.svg";
import { DayPicker } from "react-day-picker";
import { Request } from "./PromptBar";
import "react-day-picker/style.css";
import "../css/advanced-query-options-menu-custom-css.css";

type AdvancedQueryOptionsMenuProps = {
    isMenuOpen: boolean;
    setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setRequest: React.Dispatch<React.SetStateAction<Request>>;
    submitRequest: boolean;
}

const AdvancedQueryOptionsMenu: React.FC<AdvancedQueryOptionsMenuProps> = ({ isMenuOpen, setIsMenuOpen, setRequest, submitRequest }) => {
    const [totalSourcesToCollect, setTotalSourcesToCollect] = useState<number>(5);
    const [newsRatio, setNewsRatio] = useState<number>(60);
    const [xRatio, setXRatio] = useState<number>(20);
    const [facebookRatio, setFacebookRatio] = useState<number>(20);
    const [fromDate, setFromDate] = useState<Date>();
    const [toDate, setToDate] = useState<Date>();
    const [totalSourcesToDisplay, setTotalSourcesToDisplay] = useState<number>(2);
    const [displayTotalRatioUnder100Menu, setDisplayTotalRatioUnder100Menu] = useState<boolean>(false);

    const menuRef = useRef<HTMLDivElement | null>(null);

    const handleClose = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        setIsMenuOpen(false);
    }

    const handleApply = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (newsRatio + xRatio + facebookRatio < 100) {
            setDisplayTotalRatioUnder100Menu(true);
            return;
        }

        setRequest(prevRequest => ({
            ...prevRequest,
            before_ranking_num_articles: totalSourcesToCollect,
            perc_of_each_source: {
                automatic: newsRatio / 100,
                'x.com': xRatio / 100,
                'facebook.com': facebookRatio / 100
            },
            start_date: fromDate? fromDate.toISOString() : fromDate,
            end_date: toDate ? toDate.toISOString() : toDate,
            after_ranking_num_articles: totalSourcesToDisplay
        }))
        setIsMenuOpen(false);
    }

    useEffect(() => {
        if (submitRequest) {
            setTotalSourcesToCollect(5);
            setNewsRatio(60);
            setXRatio(20);
            setFacebookRatio(20);
            setFromDate(undefined);
            setToDate(undefined);
            setTotalSourcesToDisplay(2);
            setIsMenuOpen(false);
        }
    }, [submitRequest])

    useEffect(() => {
        if (totalSourcesToCollect < totalSourcesToDisplay) {
            setTotalSourcesToDisplay(totalSourcesToCollect);
        }
    }, [totalSourcesToCollect]);

    useEffect(() => {
        const total = newsRatio + xRatio + facebookRatio;
        if (total > 100) {
            setNewsRatio(100 - xRatio - facebookRatio);
        }
    }, [newsRatio]);

    useEffect(() => {
        const total = newsRatio + xRatio + facebookRatio;
        if (total > 100) {
            setXRatio(100 - newsRatio - facebookRatio);
        }
    }, [xRatio]);

    useEffect(() => {
        const total = newsRatio + xRatio + facebookRatio;
        if (total > 100) {
            setFacebookRatio(100 - newsRatio - xRatio);
        }
    }, [facebookRatio]);

    useEffect(() => {
        if (fromDate && toDate && fromDate.getTime() > toDate.getTime()) {
            setFromDate(undefined);
        }
    }, [fromDate]);

    useEffect(() => {
        if (fromDate && toDate && toDate.getTime() < fromDate.getTime()) {
            setToDate(undefined);
        }
    }, [toDate]);

    useEffect(() => {
        if (isMenuOpen && menuRef.current) {
            menuRef.current.scrollTop = 0;
        }
    }, [isMenuOpen]);

    return (
        <div ref={menuRef} className={`w-[480px] h-[40vh] bg-query-options-menu-bg py-5 px-4 pb-10 flex flex-col space-y-4 justify-center items-center absolute top-[-41vh] overflow-y-auto ${!isMenuOpen && '-z-50'}`}>
            <div className="w-full h-[10%] flex justify-between items-center">
                <h1 className="text-sm text-metrics-text font-bold">Advanced Query Options</h1>
                <button onClick={handleClose}>
                    <img src={CloseMenuButton} alt="close-menu-btn" className="w-[12px] h-[12px]" />
                </button>
            </div>
            <div className="w-full h-[90%] px-2 space-y-8">
                <div className="w-full space-y-4">
                    <h3 className="text-source-text font-bold underline text-xs">Data Source Collect Settings</h3>
                    <div className="w-full px-2 space-y-5">
                        <div className="w-full space-y-2">
                            <h4 className="text-xs text-metrics-text">Total Sources to Collect</h4>
                            <input type="number" min='1' className="bg-query-options-input-bg border border-metrics-text rounded-sm w-[100px] h-[40px] p-2 px-3 text-sm" value={totalSourcesToCollect} onChange={e => setTotalSourcesToCollect(Number(e.target.value))} data-testid="total-sources-to-collect-input" />
                        </div>
                        <div className="w-full space-y-2">
                            <h4 className="text-xs text-metrics-text">Sources Percentage Allocation</h4>
                            <div className="w-full space-y-2">
                                <div className="flex flex-col">
                                    <p className="text-[10px] text-header-bar-text mb-2">News Ratio</p>
                                    <div className="w-full flex justify-start items-center space-x-2">
                                        <input type="range" min='0' max='100' className="w-[50%] cursor-pointer range-slider" style={{background: `linear-gradient(to right, #AEB0FF ${newsRatio}%, #383838 ${newsRatio}%)`}} value={newsRatio} onChange={e => setNewsRatio(Number(e.target.value))} data-testid="news-ratio-input" />
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
                                        <input type="range" min='0' max='100' className="w-[50%] cursor-pointer range-slider" style={{background: `linear-gradient(to right, #AEB0FF ${xRatio}%, #383838 ${xRatio}%)`}} value={xRatio} onChange={e => setXRatio(Number(e.target.value))} data-testid="x-ratio-input" />
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
                                    <p className="text-[10px] text-header-bar-text mb-2">Facebook Ratio</p>
                                    <div className="w-full flex justify-start items-center space-x-2">
                                        <input type="range" min='0' max='100' className="w-[50%] cursor-pointer range-slider" style={{background: `linear-gradient(to right, #AEB0FF ${facebookRatio}%, #383838 ${facebookRatio}%)`}} value={facebookRatio} onChange={e => setFacebookRatio(Number(e.target.value))} data-testid="facebook-ratio-input" />
                                        <div className="bg-query-options-input-bg p-1 rounded-sm w-[35px]">
                                            <p className="text-[10px]">{facebookRatio}%</p>
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
                                <div className="w-[45%] space-y-3">
                                    <p className="text-center text-xs text-header-bar-text">From</p>
                                    <button className={`w-full rounded-lg h-9 text-[10px] border ${!fromDate? 'text-query-options-date-picker-active-color border-query-options-date-picker-active-color bg-query-options-date-picker-bg' : 'text-query-options-date-picker-color border-query-options-date-picker-color'}`} onClick={e => setFromDate(undefined)}>Unspecifed</button>
                                    <DayPicker mode="single" captionLayout="dropdown" selected={fromDate} onSelect={setFromDate} />
                                </div>
                                <div className="w-[45%] space-y-3">
                                    <p className="text-center text-xs text-header-bar-text">To</p>
                                    <button className={`w-full rounded-lg h-9 text-[10px] border ${!toDate? 'text-query-options-date-picker-active-color border-query-options-date-picker-active-color bg-query-options-date-picker-bg' : 'text-query-options-date-picker-color border-query-options-date-picker-color'}`}  onClick={e => setToDate(undefined)}>Unspecifed</button>
                                    <DayPicker mode="single" captionLayout="dropdown" selected={toDate} onSelect={setToDate} />
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
                            <input type="number" min='1' max={totalSourcesToCollect} className="bg-query-options-input-bg border border-metrics-text rounded-sm w-[100px] h-[40px] p-2 px-3 text-sm" value={totalSourcesToDisplay} onChange={e => setTotalSourcesToDisplay(Number(e.target.value))} data-testid="total-sources-to-display-input" />
                        </div>
                    </div>
                </div>
                <div className="flex justify-end items-center">
                    <button className="px-4 py-2 rounded-lg text-source-text border border-source-text text-sm" onClick={handleApply} data-testid="apply-btn">Apply</button>
                </div>
            </div>
            {displayTotalRatioUnder100Menu && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
                  <div className="bg-[#282C2C] p-6 rounded-lg w-[420px]">
                    <h2 className="text-xl font-bold mb-4">Warning</h2>
                    <p className="text-light-grey">The total platform ratio percentage is under 100.</p>
                    <p className="text-light-grey font-bold">Please adjust the platform ratio percentage to apply the new changes.</p>
                    <div className="flex justify-end mt-4">
                      <button
                        onClick={() => setDisplayTotalRatioUnder100Menu(false)}
                        className="bg-button-hover p-2 rounded-md mr-2"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
            )}
        </div>
    )
}

export default AdvancedQueryOptionsMenu;