// src/components/PromptBar.js
import React, { useState, useEffect, useRef } from "react";
import OptionsButton from "../assets/options-button.svg";
import SubmitButton from "../assets/submit-button.svg";
import { useNavigate } from "react-router-dom";
import AdvancedQueryOptionsMenu from "./AdvancedQueryOptionsMenu";
import { Answer, Chat, SourceObject } from "../hooks/types";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

type PromptBarProps = {
  chats: Chat[];
  setChatTitle: React.Dispatch<React.SetStateAction<string>>;
  saveChatToDB: (chat: Chat) => void;
  addQuery: (query: string) => void;
  addSources: (sources: SourceObject[]) => void;
  addAnswer: (answer: Answer) => void;
  addError: (error: string) => void;
  toggleLoading: (loading: boolean) => void;
  addStatus: (status: string) => void;
};

export type Request = {
  question?: string;
  num_queries?: number;
  perc_of_each_source?: { [key: string]: number };
  before_ranking_num_articles?: number;
  after_ranking_num_articles?: number;
  start_date?: string;
  end_date?: string;
};

const PromptBar: React.FC<PromptBarProps> = ({
  chats,
  setChatTitle,
  saveChatToDB,
  addQuery,
  addSources,
  addAnswer,
  addError,
  toggleLoading,
  addStatus
}) => {
  const [input, setInput] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [request, setRequest] = useState<Request>({});
  const [submitRequest, setSubmitRequest] = useState(false);
  const socketRef = useRef<WebSocket | null>(null); // WebSocket reference
  const navigate = useNavigate();
  // const reconnectInterval = useRef<NodeJS.Timeout | null>(null); // Reconnection interval reference

  const convertResponseSourcesIntoSources = (responseSources: any) => {
    const result: SourceObject[] = [];
    Object.values(responseSources).forEach((sources: any) => {
      sources.forEach((source: any) => {
        result.push({
          title: source.title,
          text: source.content.text,
          image:
            source.content.media.length > 0
              ? source.content.media[0]
              : "https://placehold.co/306x150?text=No+Image+Available",
          link: source.url,
          logo: `http://www.google.com/s2/favicons?domain=${source.url}&sz=64`,
          metrics: {
            viewsCount: 483,
            trendingRate: 22,
            region: "Atlanta, USA",
          },
        });
      });
    });
    return result;
  };

  const convertResponseAnswerIntoAnswer = (responseAnswer: any) => {
    return { 
      forecast: responseAnswer['Forecast'], 
      forecaster_rationale: responseAnswer['Forecaster Rationale'],
      llm_features: responseAnswer['llm_features']
    }
  }

  // Function to handle WebSocket connection
  const connectWebSocket = (queryId: string) => {
    if (!process.env.REACT_APP_BACKEND_URL) {
      throw new Error("REACT_APP_BACKEND_URL is not defined");
    }
    const socket = new WebSocket(
      `${process.env.REACT_APP_BACKEND_URL.replace("https://", "wss://")
        .replace("http://localhost", "ws://localhost")
        .replace(
          "https://localhost",
          "ws://localhost"
        )}/status?query_id=${queryId}`
    );

    socket.onopen = () => {
      console.log("WebSocket connection established");
      // if (reconnectInterval.current) {
      //   clearInterval(reconnectInterval.current); // Clear reconnection interval on successful connection
      // }
    };

    socket.onmessage = (event) => {
      addStatus(event.data); // Update status in real-time
    };

    socket.onerror = (error) => {
      console.error("WebSocket error: ", error);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
      // if (!reconnectInterval.current) {
      //   reconnectInterval.current = setInterval(() => {
      //     console.log("Attempting to reconnect WebSocket...");
      //     connectWebSocket(queryId); // Attempt to reconnect
      //   }, 5000); // Reconnect every 5 seconds
      // }
    };

    socketRef.current = socket; // Save WebSocket instance to ref
  };

  // Function to close WebSocket connection on unmount
  const closeWebSocket = () => {
    if (socketRef.current) {
      socketRef.current.close();
    }
    // if (reconnectInterval.current) {
    //   clearInterval(reconnectInterval.current); // Clear reconnection interval on component unmount
    // }
  };

  useEffect(() => {
    return () => {
      closeWebSocket(); // Close WebSocket connection on component unmount
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const queryId = uuidv4(); // Generate a unique ID for WebSocket connection

    if (input) {
      try {
        const updatedRequest = { ...request, question: input };
        setRequest(updatedRequest);
        setSubmitRequest(true);
        if (chats.length == 0) {
          setChatTitle(input);
        }
        addQuery(input);
        setInput("");

        // Open WebSocket connection to receive real-time status
        connectWebSocket(queryId);

        // Send POST request with query ID
        if (!process.env.REACT_APP_BACKEND_URL) {
          throw new Error("REACT_APP_BACKEND_URL is not defined");
        }
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/query_to_answer?query_id=${queryId}`,
          updatedRequest
        );
        const sources = convertResponseSourcesIntoSources(
          response.data['Sources']
        );
        addSources(sources);
        const answer = convertResponseAnswerIntoAnswer(response.data);
        addAnswer(answer);
        toggleLoading(false);
        setRequest({});
        setSubmitRequest(false);
        try {
          saveChatToDB({ query: input, sources: sources, answer: answer, loading: false });
          navigate("/");
        } catch (error) {
          console.error("Error handling submit:", error);
        }
      } catch (error) {
        let serverDown = false;
        try {
          if (!process.env.REACT_APP_BACKEND_URL) {
            throw new Error("REACT_APP_BACKEND_URL is not defined");
          }
          // Check server status
          const serverStatusResponse = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/`
          );
          if (
            serverStatusResponse.status !== 200 ||
            serverStatusResponse.data.status !== "Server is running"
          ) {
            serverDown = true;
          }
        } catch (error) {
          serverDown = true;
        }

        toggleLoading(false);
        let errorMessage =
          (error as any).response?.data?.detail ||
          "Error generating answer to query";
        if (serverDown) {
          errorMessage =
            "Server is down. Please wait for the server to load up in 1 minute.";
        }
        addError(errorMessage);
      }
    }
  };

  const formattedDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-mid-dark-grey px-6 py-3 flex justify-between items-center rounded-full relative h-[50px] lg:h-[57px] xl:h-[64px] w-[80%] max-w-[1300px]"
    >
      <AdvancedQueryOptionsMenu
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        setRequest={setRequest}
        submitRequest={submitRequest}
      />
      <div className="flex justify-start items-center w-[95%] space-x-2">
        <button type="button">
          <img
            src={OptionsButton}
            alt="options-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          />
        </button>
        {(request.start_date || request.end_date) && (
          <div className="flex justify-center items-center space-x-2">
            {request.start_date && (
              <div className="rounded-md h-[30px] px-3 py-2 text-metrics-text bg-prompt-bar-date-bg cursor-pointer">
                <p className="text-xs font-semibold">
                  From: {formattedDate(request.start_date)}
                </p>
              </div>
            )}
            {request.end_date && (
              <div className="rounded-md h-[30px] px-3 py-2 text-metrics-text bg-prompt-bar-date-bg cursor-pointer">
                <p className="text-xs font-semibold">
                  To: {formattedDate(request.end_date)}
                </p>
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
          className="px-4 p-2 bg-mid-dark-grey text-title-light-grey text-xs lg:text-sm xl:text-base rounded-2xl focus:outline-none flex-1"
          data-testid="query-input"
        />
      </div>
      <button
        type="submit"
        disabled={isMenuOpen}
        className="bg-submit-btn-bg hover:bg-mid-light-grey w-8 h-8 lg:w-9 lg:h-9 xl:w-10 xl:h-10 rounded-full flex items-center justify-center"
        data-testid="query-submit-btn"
      >
        <img src={SubmitButton} alt="submit-btn" className="w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7" />
      </button>
    </form>
  );
};

export default PromptBar;
