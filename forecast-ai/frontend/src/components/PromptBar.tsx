// src/components/PromptBar.js
import React, { useState, useEffect, useRef } from "react";
import OptionsButton from "../assets/options-button.svg";
import SubmitButton from "../assets/submit-button.svg";
import { useNavigate } from "react-router-dom";
import AdvancedQueryOptionsMenu from "./AdvancedQueryOptionsMenu";
import { Answer, Chat, SourceObject } from "../hooks/types";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

/**
 * PromptBar Component
 * 
 * This component provides an input bar for users to submit queries in a chat interface.
 * Users can input a query, open advanced query options, and submit the query to receive
 * responses from the server. The component also utilizes WebSockets for real-time status
 * updates.
 * 
 * Props:
 * - `chats`: Array of previous chat data.
 * - `setChatTitle`: Function to set the chat title.
 * - `saveChatToDB`: Function to save chat data to the database.
 * - `addQuery`: Function to add the user's query to the chat.
 * - `addSources`: Function to add source data retrieved from the server.
 * - `addAnswer`: Function to add the server's answer to the chat.
 * - `addError`: Function to handle and display error messages.
 * - `toggleLoading`: Function to toggle loading state during API requests.
 * - `addStatus`: Function to add real-time status updates from the server.
 * 
 * State:
 * - `input`: Current user input for the query.
 * - `isMenuOpen`: Controls the visibility of the Advanced Query Options Menu.
 * - `request`: Stores advanced query options, such as date ranges and sources percentages.
 * - `submitRequest`: Boolean to handle form submission state.
 * - `socketRef`: Reference to the WebSocket instance for managing real-time status updates.
 * 
 * Functions:
 * - `connectWebSocket`: Opens a WebSocket connection to the backend to receive real-time status updates.
 * - `closeWebSocket`: Closes the WebSocket connection when the component unmounts.
 * - `handleSubmit`: Submits the user's query to the server, manages loading and error states, and saves the chat.
 * - `formattedDate`: Formats dates into a readable string for display in the date range.
 * - `convertResponseSourcesIntoSources`: Transforms server response data into a format suitable for displaying sources.
 * - `convertResponseAnswerIntoAnswer`: Transforms server response data into a suitable answer format.
 * 
 * UI:
 * - Renders an input field for the user's query, an options button for advanced query settings, 
 *   and a submit button.
 * - Displays optional date range and source configurations above the input field.
 * - Uses AdvancedQueryOptionsMenu to allow users to configure additional settings for their query.
 * - Renders loading and error states based on API responses and WebSocket connectivity.
 */


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
  addStatus,
}) => {
  const [input, setInput] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [request, setRequest] = useState<Request>({});
  const [submitRequest, setSubmitRequest] = useState(false);
  const socketRef = useRef<WebSocket | null>(null); // WebSocket reference
  const navigate = useNavigate();
  // const reconnectInterval = useRef<NodeJS.Timeout | null>(null); // Reconnection interval reference

const convertResponseSourcesIntoSources = (responseSources: any, articleSummaries: any) => {
    const result: SourceObject[] = [];
    Object.values(responseSources).forEach((sources: any) => {
    sources.forEach((source: any, index: number) => {
      // Find matching summary using article ID
      const articleId = (index + 1).toString();
      const summaryData = articleSummaries[articleId] || {};
      
        result.push({
          title: source.title,
          text: source.content.text,
        image: source.content.media?.length > 0
              ? source.content.media[0]
              : "https://placehold.co/306x150?text=No+Image+Available",
          link: source.url,
          logo: `http://www.google.com/s2/favicons?domain=${source.url}&sz=64`,
          metrics: {
            viewsCount: 483,
            trendingRate: 22,
            region: "Atlanta, USA",
          },
        // Use the article summaries from backend
        summary: summaryData.summary || "",
        fullText: summaryData.full_text || "",
        id: articleId
        });
      });
    });
    return result;
  };

  const convertResponseAnswerIntoAnswer = (responseAnswer: any) => {
    return { 
      forecast: responseAnswer['Forecast'], 
      forecaster_rationale: responseAnswer['Forecaster Rationale'],
      llm_features: responseAnswer['llm_features'],
      raw_rationale: responseAnswer['raw_rationale'],
      article_summaries: responseAnswer['article_summaries']
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

    socket.onclose = (event) => {
      console.log("WebSocket connection closed");
      // if (!reconnectInterval.current) {
      //   reconnectInterval.current = setInterval(() => {
      //     console.log("Attempting to reconnect WebSocket...");
      //     connectWebSocket(queryId); // Attempt to reconnect
      //   }, 5000); // Reconnect every 5 seconds
      // }
      if (event.code !== 1000) {
        // Abnormal closure
        setTimeout(() => connectWebSocket(queryId), 5000); // Try to reconnect after 5 seconds
      }
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

        // Retrieve token from local storage
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("User is not authenticated");
        console.log("Auth Token:", token);

        // Send POST request with query ID
        if (!process.env.REACT_APP_BACKEND_URL) {
          throw new Error("REACT_APP_BACKEND_URL is not defined");
        }
        
        // Add the auth token to request
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/query_to_answer?query_id=${queryId}`,
          updatedRequest,
          {
            headers: {
              Authorization: `Bearer ${token}`, 
            },
          }
        );
        const answer = convertResponseAnswerIntoAnswer(response.data);
        addAnswer(answer);
          const sources = convertResponseSourcesIntoSources(
          response.data["Sources"],
          answer.article_summaries
        );
        addSources(sources);

        toggleLoading(false);
        setRequest({});
        setSubmitRequest(false);
        try {
          saveChatToDB({
            query: input,
            sources: sources,
            answer: answer,
            loading: false,
          });
          navigate("/");
        } catch (error) {
          console.error("Error handling submit:", error);
        }
      } catch (error) {
        console.error("Detailed Error:", error);
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
        console.error("Final Error Message:", errorMessage);
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
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          handleSubmit(e);
        }
      }
      }
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
        <img
          src={SubmitButton}
          alt="submit-btn"
          className="w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7"
        />
      </button>
    </form>
  );
};

export default PromptBar;
