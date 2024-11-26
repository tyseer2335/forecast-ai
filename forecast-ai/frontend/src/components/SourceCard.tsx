// src/components/SourceCard.tsx
import React, { useState } from "react";
import { SourceObject } from "../hooks/types";

/**
 * `SourceCard` component displays detailed information about a news or data source,
 * including its logo, title, main image, content text, and a link to view the full content.
 *
 * Props:
 * - `source`: an object of type `SourceObject` representing the source data to display.
 *
 * Features:
 * - **Dynamic Text Rendering**: Splits the provided text content by newline characters 
 *   and renders each segment with line breaks for improved readability.
 * - **Responsive Design**: Adapts to various screen sizes using Tailwind CSS, ensuring 
 *   a consistent look on mobile, tablet, and desktop views.
 * - **Interactive Link**: Provides a clickable link in the top-right corner of the card 
 *   to open the full source content in a new tab.
 * - **Accessible for Testing**: `data-testid` attributes are included for the source logo, 
 *   title, main image, and text, making it straightforward to target specific elements 
 *   during testing.
 *
 * @param {SourceCardProps} props - The props for the component, which includes a `source` object.
 * @returns {JSX.Element} JSX element that renders the source card component.
 */


type SourceCardProps = {
    source: SourceObject;
}

const SourceCard: React.FC<SourceCardProps> = ({ source }) => {
    const [showFullContent, setShowFullContent] = useState(false);

    const renderText = (showFullContent: boolean, text: string) => {
        const sentences = text.split('\n');
        return sentences.map((sentence, index) => (
            <span key={index}>
                {sentence}
                <br />
                {showFullContent && <br />}
            </span>
        ));
    };

    return (
        <div className="bg-sidebar-bg px-4 py-10 rounded-md flex space-x-4 h-full w-[88%] lg:w-[60%] max-w-[697px] relative overflow-y-auto pl-4 pr-1">
            <img src={source.logo} alt="source-logo" className="w-5 h-5 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full" data-testid="source-logo" />
            <div className="space-y-6 h-full flex flex-col justify-start w-full">
                <div className="flex justify-between items-center w-full pr-1">
                    <h3 className="font-semibold text-xs sm:text-sm lg:text-base xl:text-lg text-metrics-text w-[75%]" data-testid="source-title">
                        {source.title}
                    </h3>
                    <button
                        onClick={() => setShowFullContent(!showFullContent)}
                        className="
                        flex items-center justify-self-end
                        text-[8px] md:text-[10px] lg:text-xs text-metrics-text font-semibold border border-metrics-text px-[0.5rem] py-1 rounded-xl hover:bg-metrics-text hover:text-sidebar-bg transition duration-200 hover:transform hover:scale-105 opacity-70 whitespace-normal md:whitespace-nowrap"

                    >
                        {showFullContent ? "Show Summary" : "Show Full Content"}
                    </button>
                </div>
                <img src={source.image} alt="source-img" className="w-[80%] max-w-[306px] h-[35%]" data-testid="source-image"/>
                <p className="text-source-text text-[8px] sm:text-[10px] md:text-xs xl:text-sm pr-6" data-testid="source-text">
                    {renderText(showFullContent, showFullContent ? source.fullText : source.summary)}
                </p>
            </div>
            <a href={source.link} target="_blank" className="absolute top-[10px] right-[8px] text-[8px] md:text-[10px] lg:text-xs text-mid-light-grey font-semibold z-10">
                Click here for the actual content
            </a>
        </div>
    );
};

export default SourceCard;