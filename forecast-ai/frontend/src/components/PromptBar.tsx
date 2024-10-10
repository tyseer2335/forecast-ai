// components/PromptBar.js
import React, { useState } from "react";
import axios from "axios";
import OptionsButton from "../assets/options-button.svg";
import SubmitButton from "../assets/submit-button.svg";
import AdvancedQueryOptionsMenu from "./AdvancedQueryOptionsMenu";

type PromptBarProps = {
  addQuery: (query: string) => void;
}

const PromptBar: React.FC<PromptBarProps> = ({ addQuery }) => {
  const [input, setInput] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input) {
      axios.post(`${process.env.REACT_APP_BACKEND_URL}/query_to_answer`, { 
        question: input, 
        num_queries: 5, 
        num_articles: 5 
      }).then(response => {
        addQuery(input);
        setInput("");
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-mid-dark-grey px-6 py-3 flex justify-between items-center rounded-full relative">
        {isMenuOpen && <AdvancedQueryOptionsMenu setIsMenuOpen={setIsMenuOpen} />}
        <div className="flex justify-center items-center w-[95%]">
            <button type="button">
                <img src={OptionsButton} alt="options-btn" onClick={e => setIsMenuOpen(!isMenuOpen)} />
            </button>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask query"
                disabled={isMenuOpen}
                className="px-4 p-2 rounded-md bg-mid-dark-grey text-title-light-grey rounded-2xl focus:outline-none w-full"
            />
        </div>
        <button
            type="submit"
            disabled={isMenuOpen}
            className="bg-submit-btn-bg hover:bg-mid-light-grey w-10 h-10 rounded-full flex items-center justify-center"
        >
            <img src={SubmitButton} alt="submit-btn" className="w-7 h-7" />
        </button>
    </form>
  );
};

export default PromptBar;