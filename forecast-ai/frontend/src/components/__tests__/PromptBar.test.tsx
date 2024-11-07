// src/components/__tests__/PromptBar.text.tsx
import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import PromptBar from "../PromptBar";
import { auth } from "../firebase";
import { v4 as uuidv4 } from "uuid";

jest.mock("axios");
jest.mock("../firebase");
jest.mock("uuid");

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockUsedNavigate,
}));

describe(PromptBar, () => {
  const setChatTitle = jest.fn();
  const saveChatToDB = jest.fn();
  const addQuery = jest.fn();
  const addSources = jest.fn();
  const addError = jest.fn();
  const toggleLoading = jest.fn();
  const addStatus = jest.fn();

  const setup = () => {
    const { getByTestId } = render(
      <PromptBar
        chats={[]}
        setChatTitle={setChatTitle}
        saveChatToDB={saveChatToDB}
        addQuery={addQuery}
        addSources={addSources}
        addError={addError}
        toggleLoading={toggleLoading}
        addStatus={addStatus}
      />
    );
    return getByTestId;
  };

  beforeEach(() => {
    mockedAxios.post.mockClear();
    setChatTitle.mockClear();
    saveChatToDB.mockClear();
    addQuery.mockClear();
    addSources.mockClear();
    addError.mockClear();
    toggleLoading.mockClear();
    addStatus.mockClear();
    (auth.currentUser as unknown) = { uid: "testUserId" };
    (uuidv4 as jest.Mock).mockReturnValue("8bb49e94-3854-4f72-a32b-ab37577e1071");
  });

  it("should send correct request when calling API", async () => {
    const getByTestId = setup();

    const mockResponseData = {
      answer: "Forecast question answer",
      sources: {
        automatic: [{
          title: "Example Title",
          content: { text: "Example text", media: ["https://placehold.co/306x150?text=No+Image+Available"] },
          url: "https://example.com",
        }]
      },
    };

    mockedAxios.post.mockResolvedValueOnce({
      data: mockResponseData,
    });

    const totalSourcesToCollectInput = getByTestId("total-sources-to-collect-input");
    const totalSourcesToDisplayInput = getByTestId("total-sources-to-display-input");
    const newsRatioInput = getByTestId("news-ratio-input");
    const xRatioInput = getByTestId("x-ratio-input");
    const facebookRatioInput = getByTestId("facebook-ratio-input");
    const applyButton = getByTestId("apply-btn");
    const queryInput = getByTestId('query-input');
    const submitButton = getByTestId('query-submit-btn');

    fireEvent.change(totalSourcesToCollectInput, { target: { value: "15" } });
    fireEvent.change(totalSourcesToDisplayInput, { target: { value: "10" } });
    fireEvent.change(facebookRatioInput, { target: { value: "0" } });
    fireEvent.change(newsRatioInput, { target: { value: "80" } });
    fireEvent.change(xRatioInput, { target: { value: "20" } });
    fireEvent.click(applyButton);
    fireEvent.change(queryInput, { target: { value: "Sample query" } });
    fireEvent.click(submitButton);

    expect(addQuery).toHaveBeenCalledWith("Sample query");

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${process.env.REACT_APP_BACKEND_URL}/query_to_answer?query_id=8bb49e94-3854-4f72-a32b-ab37577e1071`,
        { 
          question: "Sample query",
          before_ranking_num_articles: 15,
          after_ranking_num_articles: 10,
          perc_of_each_source: {
            automatic: 0.8,
            'x.com': 0.2,
            'facebook.com': 0.0
          }
        }
      );

      expect(addSources).toHaveBeenCalledWith([
        {
          title: "Example Title",
          text: "Example text",
          image: "https://placehold.co/306x150?text=No+Image+Available",
          link: "https://example.com",
          logo: "http://www.google.com/s2/favicons?domain=https://example.com&sz=64",
          metrics: { viewsCount: 483, trendingRate: 22, region: "Atlanta, USA" },
        },
      ]);

      expect(toggleLoading).toHaveBeenCalledWith(false);
    });
  });

  it("should handle errors when API request fails", async () => {
    const getByTestId = setup();

    mockedAxios.post.mockRejectedValueOnce({
      response: { data: { detail: "Error generating answer to query" } }
    });

    mockedAxios.get.mockResolvedValueOnce({
      status: 200,
      data: { status: "Server is running" }
    });

    const input = getByTestId('query-input');
    const submitButton = getByTestId('query-submit-btn');

    fireEvent.change(input, { target: { value: "Sample query" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(addError).toHaveBeenCalledWith("Error generating answer to query");
      expect(toggleLoading).toHaveBeenCalledWith(false);
    });
  });

  it("should display server down error if server status check fails", async () => {
    const getByTestId = setup();

    mockedAxios.post.mockRejectedValueOnce({
      response: { data: { detail: "Error generating answer to query" } }
    });

    mockedAxios.get.mockRejectedValueOnce({
      response: { data: { detail: "Server is down" } }
    });

    const input = getByTestId("query-input");
    const submitButton = getByTestId("query-submit-btn");

    fireEvent.change(input, { target: { value: "Sample query" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(addError).toHaveBeenCalledWith("Server is down. Please wait for the server to load up in 1 minute.");
      expect(toggleLoading).toHaveBeenCalledWith(false);
    });
  });
});