// src/components/SourcesContainer.tsx
import React, { useState } from "react";
import ScrollLeftButton from "../assets/scroll-left-button.svg";
import ScrollRightButton from "../assets/scroll-right-button.svg";
import SourceSection from "./SourceSection";
import { BiasColor, BiasColorToBiasNameMap, BiasColorToBooleanMap, SourceObject } from "../hooks/types";
import ErrorMessage from "./ErrorMessage";
import LoadingBar from "./LoadingBar";

/**
 * @file SourcesContainer.tsx
 *
 * @description
 * The `SourcesContainer` component is responsible for displaying a list of sources with navigation functionality,
 * enabling users to scroll between different source entries. Each source can include a set of biases,
 * metrics, and other content, and is managed through a `SourceSection` component.
 *
 * @component
 *
 * Features:
 * - **Error Handling**: Displays an error message if there is an issue loading the sources.
 * - **Loading State**: Shows a loading bar with a customizable status while sources are being fetched.
 * - **Source Navigation**: Provides left and right navigation buttons to scroll through the list of sources.
 * - **Bias Management**: Manages bias visibility and displays biases for each source, utilizing the `SourceSection` component.
 * - **Responsive Design**: Adapts layout to various screen sizes using Tailwind CSS utility classes.
 *
 * @param {SourcesContainerProps} props - Props include:
 *   - `sources` (array of `SourceObject`): Array of source objects to display.
 *   - `error` (string | undefined): Error message, if an error occurred while fetching sources.
 *   - `loading` (boolean): Indicates if the sources are still loading.
 *   - `status` (string | undefined): Current loading status message.
 *   - `biasVisibility` (map of `BiasColorToBooleanMap`): Controls visibility for each bias type.
 *   - `setBiasVisibility` (function): State updater function for bias visibility.
 *   - `biasColorToBiasNameMap` (map of `BiasColorToBiasNameMap`): Maps each bias color to a bias name.
 *   - `renderStage` (number): Indicates the current rendering stage for bias names.
 *   - `setRenderStage` (function): State updater function for the render stage.
 *
 * @returns {React.FC}
 * Renders the sources container with either the loading state, error message, or navigable source content.
 * Navigation buttons are conditionally rendered to enable scrolling between sources.
 */


type SourcesContainerProps = {
    sources: SourceObject[];
    error: string | undefined;
    loading: boolean;
    status: string | undefined;
    visibleBiasColor: BiasColor;
    setVisibleBiasColor: React.Dispatch<React.SetStateAction<BiasColor>>;
}

const SourcesContainer: React.FC<SourcesContainerProps> = ({ sources, error, loading, status, visibleBiasColor, setVisibleBiasColor }) => {
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
                        <SourceSection source={sources[currentSource]} visibleBiasColor={visibleBiasColor} setVisibleBiasColor={setVisibleBiasColor} />
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