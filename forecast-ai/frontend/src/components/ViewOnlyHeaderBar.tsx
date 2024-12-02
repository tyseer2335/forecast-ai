// src/components/ViewOnlyHeaderBar.tsx
import React from "react";

/**
 * ViewOnlyHeaderBar Component
 * 
 * This component displays header bar in read-only chat view containing:
 * - An optional title centered in the header.
 *
 * @component
 * 
 * Props:
 * - `title` (optional): A string representing the title to be displayed in the header.
 * 
 * Behavior:
 * - Renders the title in the center of the header bar.
 * 
 * @returns {JSX.Element} The ViewOnlyHeaderBar component with title.
 */
type ViewOnlyHeaderBarProps = {
    title?: string;
    isError: boolean;
}

const ViewOnlyHeaderBar: React.FC<ViewOnlyHeaderBarProps> = ({ title, isError }) => {
    return (
        <header className={`bg-screen-blackpx-6 py-6 w-full h-[8vh] flex items-center text-header-bar-text ${isError ? 'text-error-message-box-border-bg' : ''}`}>
            {title && <h3 className="flex-grow font-bold text-center text-[8px] sm:text-[10px] md:text-xs xl:text-sm">{title}</h3>}
        </header>
    );
};

export default ViewOnlyHeaderBar;