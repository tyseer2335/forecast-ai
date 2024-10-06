// components/PromptBar.js
import React, { useState } from "react";
import OptionsButton from "../assets/options-button.svg";
import SubmitButton from "../assets/submit-button.svg";

const PromptBar = () => {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Query submitted: ", input);
    setInput("");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-mid-dark-grey px-6 py-3 flex justify-between items-center rounded-full">
        <div className="flex justify-center items-center w-[95%]">
            <button>
                <img src={OptionsButton} alt="options-btn"/>
            </button>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask query"
                className="px-4 p-2 rounded-md bg-mid-dark-grey text-mid-light-grey rounded-2xl focus:outline-none w-full"
            />
        </div>
        <button
            type="submit"
            className="bg-submit-btn-bg hover:bg-mid-light-grey w-10 h-10 rounded-full flex items-center justify-center"
        >
            <img src={SubmitButton} alt="submit-btn" className="w-7 h-7" />
        </button>
    </form>
  );
};

export default PromptBar;