// components/PromptBar.tsx
import React, { useState } from "react";
import OptionsButton from "../assets/options-button.svg";
import SubmitButton from "../assets/submit-button.svg";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import AdvancedQueryOptionsMenu from "./AdvancedQueryOptionsMenu";
import { Chat, SourceObject } from "../hooks/types";
import axios from "axios";

type PromptBarProps = {
  saveChatToDB: (chat: Chat) => void;
  addQuery: (query: string) => void;
  addSources: (sources: SourceObject[]) => void;
  addError: (error: string) => void;
  toggleLoading: (loading: boolean) => void;
}

export type Request = {
  question?: string;
  num_queries?: number;
  perc_of_each_source?: { [key: string]: number };
  before_ranking_num_articles?: number;
  after_ranking_num_articles?: number;
  start_date?: string;
  end_date?: string;
}

const PromptBar: React.FC<PromptBarProps> = ({ saveChatToDB, addQuery, addSources, addError, toggleLoading }) => {
  const [input, setInput] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [request, setRequest] = useState<Request>({});
  const [submitRequest, setSubmitRequest] = useState(false);

  const navigate = useNavigate();
  const userId = auth.currentUser?.uid;

  if (!userId) {
    navigate("/login");
    return null;
  }

  const convertResponseSourcesIntoSources = (responseSources: any) => {
    const result: SourceObject[] = [];
    Object.values(responseSources).forEach((sources: any) => {
      sources.forEach((source: any) => {
        result.push({
          title: source.title,
          text: source.content.text,
          image: source.content.media.length > 0 ? source.content.media[0] : "https://placehold.co/306x150?text=No+Image+Available",
          link: source.url,
          logo: "https://placehold.co/150x150?text=Logo",
          metrics: { viewsCount: 483, trendingRate: 22, region: 'Atlanta, USA' }
        })
      })
    })
    return result;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (input) {
      const updatedRequest = { ...request, question: input };
      setRequest(updatedRequest);
      setSubmitRequest(true);
      addQuery(input);
      setInput("");
      axios.post(`${process.env.REACT_APP_BACKEND_URL}/query_to_answer`, updatedRequest).then(response => {
        const sources = convertResponseSourcesIntoSources(response.data.sources);
        addSources(sources);
        toggleLoading(false);
        setRequest({});
        setSubmitRequest(false);
        try {
          saveChatToDB({ query: input, sources: sources, loading: false })
          navigate("/");
        } catch(error) {
          console.error("Error handling submit:", error);
        }
      }).catch(error => {
        toggleLoading(false);
        addError("Error generating answer to query");
      });
    }
  };

  const formattedDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-mid-dark-grey px-6 py-3 flex justify-between items-center rounded-full relative h-[64px]">
        <AdvancedQueryOptionsMenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} setRequest={setRequest} submitRequest={submitRequest} />
        <div className="flex justify-start items-center w-[95%] space-x-2">
            <button type="button">
                <img src={OptionsButton} alt="options-btn" onClick={e => setIsMenuOpen(!isMenuOpen)} />
            </button>
            {(request.start_date || request.end_date) && (
              <div className="flex justify-center items-center space-x-2">
                  {request.start_date && (
                      <div className="rounded-md h-[30px] px-3 py-2 text-metrics-text bg-prompt-bar-date-bg cursor-pointer">
                        <p className="text-xs font-semibold">From: {formattedDate(request.start_date)}</p>
                      </div>
                  )}
                  {request.end_date && (
                      <div className="rounded-md h-[30px] px-3 py-2 text-metrics-text bg-prompt-bar-date-bg cursor-pointer">
                        <p className="text-xs font-semibold">To: {formattedDate(request.end_date)}</p>
                      </div>
                  )}
              </div>
            )}
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                autoComplete="off"
                placeholder="Ask query"
                disabled={isMenuOpen}
                className="px-4 p-2 rounded-md bg-mid-dark-grey text-title-light-grey rounded-2xl focus:outline-none flex-1"
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