// src/components/ErrorMessage.tsx
import React from "react";

/**
 * ErrorMessage Component
 *
 * This component renders a styled error message box to display errors within the application.
 *
 * Props:
 * - `error`: The error message to display, provided as a string.
 *
 * Styling:
 * - Uses Tailwind CSS for styling, including background and border colors to visually
 *   distinguish the error message box from other UI elements.
 *
 * Usage:
 * - Place this component where error messages should appear, passing the relevant error string
 *   as a prop.
 *
 * Example:
 * ```jsx
 * <ErrorMessage error="An unexpected error occurred." />
 * ```
 *
 * @module ErrorMessage
 */


type ErrorMessageProps = {
    error: string;
}

const ErrorMessage:React.FC<ErrorMessageProps> = ({ error }) => {
    return (
        <div className="rounded-md w-[60%] px-4 py-2 border border-error-message-box-border-bg bg-error-message-box-bg ml-auto mt-[25px]">
            <p className="text-chat-message-text text-[10px] md:text-xs lg:text-sm xl:text-base">{error}</p>
        </div>
    )
}

export default ErrorMessage;