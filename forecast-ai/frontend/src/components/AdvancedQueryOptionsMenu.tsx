// src/components/AdvancedQueryOptionsMenu.tsx
import React, { useEffect, useState, useRef } from "react";
import CloseMenuButton from "../assets/close-menu-button.svg";
import { DayPicker } from "react-day-picker";
import { Request } from "./PromptBar";
import SourcePlatformRatioInput from "./SourcePlatformRatioInput";
import "react-day-picker/style.css";
import "../css/advanced-query-options-menu-custom-css.css";

type AdvancedQueryOptionsMenuProps = {
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setRequest: React.Dispatch<React.SetStateAction<Request>>;
  submitRequest: boolean;
};

const initialPlatformRatios = [
  { platformName: "News", platformRatio: 100 },
  { platformName: "X", platformRatio: 0 },
  { platformName: "Facebook", platformRatio: 0 },
];

const AdvancedQueryOptionsMenu: React.FC<AdvancedQueryOptionsMenuProps> = ({
  isMenuOpen,
  setIsMenuOpen,
  setRequest,
  submitRequest,
}) => {
  const [totalSourcesToCollect, setTotalSourcesToCollect] = useState<number>(5);
  const [platformRatios, setPlatformRatios] = useState(initialPlatformRatios);
  const [newSourcePlatformName, setNewSourcePlatformName] =
    useState<string>("");
  const [isNewSourcePlatformInputOpen, setIsNewSourcePlatformInputOpen] =
    useState<boolean>(false);
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [totalSourcesToDisplay, setTotalSourcesToDisplay] = useState<number>(2);
  const [displayWarningMessage, setDisplayWarningMessage] =
    useState<boolean>(false);
  const [warningMessage, setWarningMessage] = useState<string>("");
  const [warningInstruction, setWarningInstruction] = useState<string>("");

  const menuRef = useRef<HTMLDivElement | null>(null);

  const handleClose = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setIsMenuOpen(false);
  };

  const handleApply = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const totalRatio = platformRatios.reduce(
      (sum, platform) => sum + platform.platformRatio,
      0
    );
    if (totalRatio < 100) {
      setWarningMessage("The total platform ratio percentage is under 100.");
      setWarningInstruction(
        "Please adjust the platform ratio percentage to apply the new changes."
      );
      setDisplayWarningMessage(true);
      return;
    }

    setRequest((prevRequest) => ({
      ...prevRequest,
      before_ranking_num_articles: totalSourcesToCollect,
      perc_of_each_source: {
        automatic: platformRatios[0].platformRatio / 100,
        "x.com": platformRatios[1].platformRatio / 100,
        "facebook.com": platformRatios[2].platformRatio / 100,
        ...platformRatios
          .slice(3)
          .reduce<Record<string, number>>(
            (acc, { platformName, platformRatio }) => {
              acc[platformName.toLowerCase()] = platformRatio / 100;
              return acc;
            },
            {}
          ),
      },
      start_date: fromDate ? fromDate.toISOString() : fromDate,
      end_date: toDate ? toDate.toISOString() : toDate,
      after_ranking_num_articles: totalSourcesToDisplay,
    }));
    setIsMenuOpen(false);
  };

  const handlePlatformRatioChange = (index: number, value: number) => {
    const newPlaformRatios = [...platformRatios];
    newPlaformRatios[index] = {
      ...newPlaformRatios[index],
      platformRatio: value,
    };
    const totalRatio = newPlaformRatios.reduce(
      (sum, platform) => sum + platform.platformRatio,
      0
    );
    if (totalRatio <= 100) {
      setPlatformRatios(newPlaformRatios);
    } else {
      newPlaformRatios[index] = {
        ...newPlaformRatios[index],
        platformRatio: 100 - (totalRatio - value),
      };
      setPlatformRatios(newPlaformRatios);
    }
  };

  const handleAddNewSourcePlatformRatio = (e: any) => {
    e.preventDefault();

    if (!newSourcePlatformName) {
      return;
    }

    if (!/^[a-zA-Z0-9]+\.[a-zA-Z]+$/.test(newSourcePlatformName)) {
      setWarningMessage("The new source platform is invalid.");
      setWarningInstruction("Please type in domain.domain extension format...");
      setDisplayWarningMessage(true);
      return;
    }

    if (
      platformRatios.some(
        (platform) => platform.platformName == newSourcePlatformName
      )
    ) {
      setWarningMessage("The new source platform already exists.");
      setWarningInstruction("Please add a different source platform...");
      setDisplayWarningMessage(true);
      return;
    }

    const newPlaformRatios = [...platformRatios];
    newPlaformRatios.push({
      platformName: newSourcePlatformName,
      platformRatio: 0,
    });
    setPlatformRatios(newPlaformRatios);
    setNewSourcePlatformName("");
    setIsNewSourcePlatformInputOpen(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddNewSourcePlatformRatio(e);
    }
  };

  const handleOpenAddNewSourcePlatformInput = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    if (!isNewSourcePlatformInputOpen) {
      setIsNewSourcePlatformInputOpen(true);
    }
  };

  const handleCloseAddNewSourcePlatformInput = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    setNewSourcePlatformName("");
    setIsNewSourcePlatformInputOpen(false);
  };

  useEffect(() => {
    if (submitRequest) {
      setTotalSourcesToCollect(5);
      setPlatformRatios(initialPlatformRatios);
      setFromDate(undefined);
      setToDate(undefined);
      setTotalSourcesToDisplay(2);
      setIsMenuOpen(false);
    }
  }, [submitRequest]);

  useEffect(() => {
    if (totalSourcesToCollect < totalSourcesToDisplay) {
      setTotalSourcesToDisplay(totalSourcesToCollect);
    }
  }, [totalSourcesToCollect]);

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
    <div
      ref={menuRef}
      className={`
      w-[520px] h-[45vh] bg-query-options-menu-bg 
      rounded-xl shadow-lg
      transform transition-all duration-300 ease-in-out
      ${
        isMenuOpen
          ? "translate-y-0 opacity-100"
          : "translate-y-[-100%] opacity-0 -z-50"
      }
      absolute top-[-46vh] p-6
      overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent
    `}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-lg text-metrics-text font-semibold">
          Advanced Query Options
        </h1>
        <button
          onClick={handleClose}
          className="p-2 hover:bg-gray-700 rounded-full transition-colors"
        >
          <img src={CloseMenuButton} alt="close" className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-8">
        {/* Data Source Section */}
        <section>
          <h3 className="text-source-text font-semibold text-sm border-b border-gray-700 pb-2 mb-4">
            Data Source Collection Settings
          </h3>

          <div className="space-y-6 px-2">
            {/* Sources Input */}
            <div className="w-full space-y-2">
              <label className="text-sm text-metrics-text font-medium">
                Total Sources to Collect
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  min="1"
                  className="bg-query-options-input-bg border border-metrics-text rounded-sm w-[100px] h-[40px] p-2 px-3 text-sm"
                  value={totalSourcesToCollect}
                  onChange={(e) =>
                    setTotalSourcesToCollect(Number(e.target.value))
                  }
                  data-testid="total-sources-to-collect-input"
                />
              </div>
            </div>

            {/* Platform Ratios */}
            <div className="space-y-3">
              <label className="text-sm text-metrics-text font-medium">
                Sources Percentage Allocation
              </label>
              <div className="space-y-3">
                {platformRatios.map((ratio, index) => (
                  <SourcePlatformRatioInput
                    key={index}
                    {...ratio}
                    index={index}
                    setPlatformRatio={handlePlatformRatioChange}
                  />
                ))}
              </div>

              {/* Add New Platform */}
              <div className="mt-4">
                {isNewSourcePlatformInputOpen && (
                  <div className="bg-gray-800 rounded-lg p-4 mb-3 animate-fadeIn">
                    <label className="text-sm text-metrics-text mb-2 block">
                      New Source Platform
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="text"
                        placeholder="domain.domain"
                        className="
                        flex-1 bg-transparent border-b-2 
                        text-header-bar-text border-header-bar-text
                        text-sm focus:outline-none focus:border-source-text
                        transition-all py-1
                      "
                        value={newSourcePlatformName}
                        onChange={(e) =>
                          setNewSourcePlatformName(e.target.value)
                        }
                        onKeyDown={handleKeyPress}
                      />
                      <button
                        onClick={handleAddNewSourcePlatformRatio}
                        className="text-sm text-source-text hover:text-source-text-hover transition-colors"
                      >
                        Add
                      </button>
                      <button
                        onClick={handleCloseAddNewSourcePlatformInput}
                        className="p-1.5 hover:bg-gray-700 rounded-full transition-colors"
                      >
                        <img
                          src={CloseMenuButton}
                          alt="close"
                          className="w-2.5 h-2.5"
                        />
                      </button>
                    </div>
                  </div>
                )}

                <button
                  className="text-source-text text-sm hover:text-source-text-hover transition-colors"
                  onClick={handleOpenAddNewSourcePlatformInput}
                >
                  + Add Source Platform
                </button>
              </div>
            </div>

            {/* Date Range */}
            <div className="space-y-3">
              <label className="text-sm text-metrics-text font-medium">
                Date Range
              </label>
              <div className="flex gap-6">
                {["From", "To"].map((label, i) => (
                  <div key={label} className="flex-1 space-y-3">
                    <p className="text-center text-sm text-header-bar-text">
                      {label}
                    </p>
                    <button
                      className={`
                      w-full rounded-lg py-2.5 text-xs border transition-all
                      ${
                        !fromDate
                          ? "text-query-options-date-picker-active-color border-query-options-date-picker-active-color bg-query-options-date-picker-bg"
                          : "text-query-options-date-picker-color border-query-options-date-picker-color hover:bg-gray-700"
                      }
                    `}
                      onClick={() =>
                        i === 0 ? setFromDate(undefined) : setToDate(undefined)
                      }
                    >
                      Unspecified
                    </button>
                    <DayPicker
                      mode="single"
                      captionLayout="dropdown"
                      selected={i === 0 ? fromDate : toDate}
                      onSelect={i === 0 ? setFromDate : setToDate}
                      className="bg-gray-800 rounded-lg p-3"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Display Settings */}
        <section>
          <h3 className="text-source-text font-semibold text-sm border-b border-gray-700 pb-2 mb-4">
            Display Settings
          </h3>

          <div className="w-full space-y-2">
            <label className="text-sm text-metrics-text font-medium">
              Total Sources to Display
            </label>
            <div className="mt-2">
              <input
                type="number"
                min="1"
                max={totalSourcesToCollect}
                className="bg-query-options-input-bg border border-metrics-text rounded-sm w-[100px] h-[40px] p-2 px-3 text-sm"
                value={totalSourcesToDisplay}
                onChange={(e) =>
                  setTotalSourcesToDisplay(Number(e.target.value))
                }
                data-testid="total-sources-to-display-input"
              />
            </div>
          </div>
        </section>

        {/* Apply Button */}
        <div className="flex justify-end pt-4">
          <button
            className="
            px-6 py-2.5 rounded-lg text-source-text 
            border border-source-text text-sm
            hover:bg-source-text hover:text-black
            transition-all duration-200
          "
            onClick={handleApply}
            data-testid="apply-btn"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Warning Modal */}
      {displayWarningMessage && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-20 animate-fadeIn">
          <div
            className="
          bg-[#282C2C] p-8 rounded-xl w-[440px]
          shadow-xl transform transition-all
          animate-slideIn
        "
          >
            <h2 className="text-xl font-semibold mb-4 text-source-text">
              Warning
            </h2>
            <p className="text-light-grey mb-2">{warningMessage}</p>
            <p className="text-light-grey font-semibold">
              {warningInstruction}
            </p>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setDisplayWarningMessage(false)}
                className="
                bg-button-hover px-5 py-2.5 rounded-lg
                text-sm font-medium
                hover:bg-button-hover/80 transition-colors
              "
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedQueryOptionsMenu;
