// components/PromptBar.js
import React, { useState } from "react";
import axios from "axios";
import OptionsButton from "../assets/options-button.svg";
import SubmitButton from "../assets/submit-button.svg";
import useSaveQuery from "../hooks/useSaveChat";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase";
type PromptBarProps = {
  addQuery: (query: string) => void;
}

const PromptBar: React.FC<PromptBarProps> = ({ addQuery }) => {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const userId = auth.currentUser?.uid;
  const selectedChatId = localStorage.getItem("selectedChatId");
  const saveQuery = useSaveQuery(userId || "", selectedChatId);

  if (!userId) {
    navigate("/login");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (input) {
      try {
        // === Backend Code ===
        // Send the query to the backend
        // ====================

        // If the backend request succeeds, save the query to Firestore
        await saveQuery(input);

        // Update the UI
        addQuery(input);
        setInput("");
      } catch (error) {
        console.error("Error handling submit:", error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-mid-dark-grey px-6 py-3 flex justify-between items-center rounded-full">
        <div className="flex justify-center items-center w-[95%]">
            <button type="button">
                <img src={OptionsButton} alt="options-btn"/>
            </button>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask query"
                className="px-4 p-2 rounded-md bg-mid-dark-grey text-title-light-grey focus:outline-none w-full"
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