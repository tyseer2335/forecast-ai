// src/components/AdvancedQueryOptionsMenu.tsx
import React, { useEffect, useState, useRef } from "react";
import CloseMenuButton from "../assets/close-menu-button.svg";
import { DayPicker } from "react-day-picker";
import { Request } from "./PromptBar";
import SourcePlatformRatioInput from "./SourcePlatformRatioInput";
import "react-day-picker/style.css";
import "../css/advanced-query-options-menu-custom-css.css";

/**
 * Type definition for the props used in the AdvancedQueryOptionsMenu component.
 * 
 * @interface AdvancedQueryOptionsMenuProps
 * @property {boolean} isMenuOpen - Indicates whether the advanced query options menu is open.
 * @property {React.Dispatch<React.SetStateAction<boolean>>} setIsMenuOpen - A function to set the state of `isMenuOpen`.
 * @property {React.Dispatch<React.SetStateAction<Request>>} setRequest - A function to update the request object with new settings.
 * @property {boolean} submitRequest - A boolean indicating if the request should be submitted (resets settings when true).
 */
type AdvancedQueryOptionsMenuProps = {
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setRequest: React.Dispatch<React.SetStateAction<Request>>;
  submitRequest: boolean;
};

/**
 * Initial platform ratios for the default set of platforms.
 * 
 * @constant {Array} initialPlatformRatios - Default platform names and their corresponding ratios.
 */
const initialPlatformRatios = [
  { platformName: "News", platformRatio: 100 },
  { platformName: "X", platformRatio: 0 },
  { platformName: "Facebook", platformRatio: 0 },
];

/**
 * AdvancedQueryOptionsMenu Component
 *
 * This component provides a menu for advanced query options where users can configure the data source collection settings, 
 * platform ratio allocation, and date range filters. It allows adding new source platforms, adjusting platform ratios, 
 * and applying the settings to the request.
 *
 * @component
 * @example
 * ```jsx
 * <AdvancedQueryOptionsMenu
 *   isMenuOpen={isMenuOpen}
 *   setIsMenuOpen={setIsMenuOpen}
 *   setRequest={setRequest}
 *   submitRequest={submitRequest}
 * />
 * ```
 * @param {AdvancedQueryOptionsMenuProps} props - The props passed to the component.
 * @returns {React.Element} The rendered JSX for the advanced query options menu.
 */
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

  /**
   * Closes the menu when the close button is clicked.
   * 
   * @param {React.MouseEvent<HTMLButtonElement, MouseEvent>} e - The mouse click event.
   */
  const handleClose = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setIsMenuOpen(false);
  };

  /**
   * Applies the advanced query options and updates the request object.
   * Checks if the platform ratios sum to 100 before applying changes.
   * 
   * @param {React.MouseEvent<HTMLButtonElement>} e - The mouse click event.
   */
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

  /**
   * Handles the change in the platform ratio for a specific platform.
   * Ensures the total ratio doesn't exceed 100.
   * 
   * @param {number} index - The index of the platform whose ratio is being updated.
   * @param {number} value - The new platform ratio value.
   */
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

  /**
   * Adds a new source platform to the platform ratios list if it's valid.
   * 
   * @param {any} e - The event triggered by the "Add" button click.
   */
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

  /**
   * Handles key press events for the new source platform input field.
   * Triggers the addition of the platform when "Enter" is pressed.
   * 
   * @param {React.KeyboardEvent<HTMLInputElement>} e - The key press event.
   */
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddNewSourcePlatformRatio(e);
    }
  };

  /**
   * Opens the input field to add a new source platform.
   * 
   * @param {React.MouseEvent<HTMLButtonElement>} e - The mouse click event.
   */
  const handleOpenAddNewSourcePlatformInput = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    if (!isNewSourcePlatformInputOpen) {
      setIsNewSourcePlatformInputOpen(true);
    }
  };

  /**
   * Closes the input field to add a new source platform.
   * 
   * @param {React.MouseEvent<HTMLButtonElement>} e - The mouse click event.
   */
  const handleCloseAddNewSourcePlatformInput = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    setNewSourcePlatformName("");
    setIsNewSourcePlatformInputOpen(false);
  };

  /**
   * Resets the menu settings when a new request is submitted.
   */
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

  /**
   * The main component for the advanced query options menu.
   * It contains input fields for source collection settings, percentage allocation, and date range.
   * 
   * @returns {JSX.Element} The rendered AdvancedQueryOptionsMenu component.
   */
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
                                {platformRatios.map(({ platformName, platformRatio }, index) => (
                                    <SourcePlatformRatioInput key={index} index={index} platformName={platformName} platformRatio={platformRatio} setPlatformRatio={handlePlatformRatioChange} />
                ))}
              </div>
                            <div className="w-full flex flex-col items-start space-y-4" style={{ marginTop: '20px' }}>
                {isNewSourcePlatformInputOpen && (
                                    <div className="w-full flex flex-col space-y-2">
                                        <label className="text-xs text-metrics-text">New Source Platform</label>
                                        <div className="flex space-x-7">
                                            <div className="w-[58%] flex items-center space-x-3">
                                                <input type="text" placeholder="domain.domain" className="bg-transparent border-b-2 text-header-bar-text border-header-bar-text text-xs focus:outline-none pr-1 py-1 flex-1" value={newSourcePlatformName} onChange={e => setNewSourcePlatformName(e.target.value)} onKeyDown={handleKeyPress} />
                                                <button onClick={handleAddNewSourcePlatformRatio} className="text-xs text-source-text">Add</button>
                                            </div>
                                            <button onClick={handleCloseAddNewSourcePlatformInput}>
                                                <img src={CloseMenuButton} alt="close-menu-btn" className="w-[8px] h-[8px]" />
                      </button>
                    </div>
                  </div>
                )}
                                <button className="text-source-text text-xs" onClick={handleOpenAddNewSourcePlatformInput}>+ Add Source Platform</button>
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
      {displayWarningMessage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
                  <div className="bg-[#282C2C] p-6 rounded-lg w-[420px]">
                    <h2 className="text-xl font-bold mb-4">Warning</h2>
                    <p className="text-light-grey">{warningMessage}</p>
                    <p className="text-light-grey font-bold">{warningInstruction}</p>
                    <div className="flex justify-end mt-4">
              <button
                onClick={() => setDisplayWarningMessage(false)}
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
