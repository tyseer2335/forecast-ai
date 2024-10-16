// src/components/__tests__/PromptBar.text.tsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import PromptBar from "../PromptBar";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe(PromptBar, () => {
  const addQuery = jest.fn();
  const addSources = jest.fn();
  const addError = jest.fn();
  const toggleLoading = jest.fn();

  const setup = () => {
    const { getByTestId } = render(
      <PromptBar
        addQuery={addQuery}
        addSources={addSources}
        addError={addError}
        toggleLoading={toggleLoading}
      />
    );
    return getByTestId;
  };

  beforeEach(() => {
    mockedAxios.post.mockClear();
    addQuery.mockClear();
    addSources.mockClear();
    addError.mockClear();
    toggleLoading.mockClear();
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

    const input = getByTestId('query-input');
    const submitButton = getByTestId('query-submit-btn');

    fireEvent.change(input, { target: { value: "Sample query" } });
    fireEvent.click(submitButton);

    expect(addQuery).toHaveBeenCalledWith("Sample query");

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${process.env.REACT_APP_BACKEND_URL}/query_to_answer`,
        { question: "Sample query" }
      );

      expect(addSources).toHaveBeenCalledWith([
        {
          title: "Example Title",
          text: "Example text",
          image: "https://placehold.co/306x150?text=No+Image+Available",
          link: "https://example.com",
          logo: "https://placehold.co/150x150?text=Logo",
          metrics: { viewsCount: 483, trendingRate: 22, region: "Atlanta, USA" },
        },
      ]);

      expect(toggleLoading).toHaveBeenCalledWith(false);
    });
  });

  it("should handle errors when API request fails", async () => {
    const getByTestId = setup();

    mockedAxios.post.mockRejectedValueOnce({
      response: { data: { detail: "Error generating answer to query" } },
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
});