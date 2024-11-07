// src/components/ErrorMessage.tsx
import React from "react";

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