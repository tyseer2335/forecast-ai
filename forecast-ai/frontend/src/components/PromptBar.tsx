// components/PromptBar.js
import React, { useState } from "react";
import axios from "axios";
import OptionsButton from "../assets/options-button.svg";
import SubmitButton from "../assets/submit-button.svg";
import AdvancedQueryOptionsMenu from "./AdvancedQueryOptionsMenu";
import { Source } from "./MainContainer";

type PromptBarProps = {
  addQuery: (query: string) => void;
  addSources: (sources: Source[]) => void;
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

const PromptBar: React.FC<PromptBarProps> = ({ addQuery, addSources, addError, toggleLoading }) => {
  const [input, setInput] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [request, setRequest] = useState<Request>({});
  const [submitRequest, setSubmitRequest] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input) {
      const updatedRequest = { ...request, question: input };
      setRequest(updatedRequest);
      setSubmitRequest(true);
      addQuery(input);
      setInput("");
      axios.post(`${process.env.REACT_APP_BACKEND_URL}/query_to_answer`, updatedRequest).then(response => {
        addSources([
          { 
              title: "Who Is Favored To Win The 2024 US Election?",
              text: "Much like Democratic presidential candidates in 2016 and 2020, Vice President Kamala Harris has moved the needle in her favor on betting markets and in polling following last week's debate with former President Donald Trump. The shift in the 2024 presidential race offshore-betting odds is more muted than Trump's other opening debates. Still, in the few percentage points he's ceded, bettors now say Harris is more likely to win, according to Polymarket, a crypto-trading platform. The presidential election betting can't be done legally in the U.S. Trump's and Harris' likelihood of winning were knotted at 49% as the debate ended. After moving slightly in Trump's favor the following morning, Polymarket bettors have given Harris a better chance of winning. Her probability stood at 52% to Trump's 47% as of 10:30 a.m. EDT Thursday. Much like Democratic presidential candidates in 2016 and 2020, Vice President Kamala Harris has moved the needle in her favor on betting markets and in polling following last week's debate with former President Donald Trump. The shift in the 2024 presidential race offshore-betting odds is more muted than Trump's other opening debates. Still, in the few percentage points he's ceded, bettors now say Harris is more likely to win, according to Polymarket, a crypto-trading platform. The presidential election betting can't be done legally in the U.S. Trump's and Harris' likelihood of winning were knotted at 49% as the debate ended. After moving slightly in Trump's favor the following morning, Polymarket bettors have given Harris a better chance of winning. Her probability stood at 52% to Trump's 47% as of 10:30 a.m. EDT Thursday. Much like Democratic presidential candidates in 2016 and 2020, Vice President Kamala Harris has moved the needle in her favor on betting markets and in polling following last week's debate with former President Donald Trump. The shift in the 2024 presidential race offshore-betting odds is more muted than Trump's other opening debates. Still, in the few percentage points he's ceded, bettors now say Harris is more likely to win, according to Polymarket, a crypto-trading platform. The presidential election betting can't be done legally in the U.S. Trump's and Harris' likelihood of winning were knotted at 49% as the debate ended. After moving slightly in Trump's favor the following morning, Polymarket bettors have given Harris a better chance of winning. Her probability stood at 52% to Trump's 47% as of 10:30 a.m. EDT Thursday.",
              image: "https://via.placeholder.com/150",
              link: "-cnn.article.link.goes.here.com",
              logo: "https://via.placeholder.com/150",
              metrics: { viewsCount: 483, trendingRate: 22, region: 'Atlanta, USA' }
          }, 
          {
              title: "Who will become the next US President?",
              text: "Voters in the US go to the polls on 5 November to elect their next president. The election was initially a rematch of 2020 but it was upended in July when President Joe Biden ended his campaign and endorsed Vice-President Kamala Harris. The big question now is - will America get its first woman president or a second Donald Trump term? As election day approaches, we'll be keeping track of the polls and seeing what effect the campaign has on the race for the White House. The two candidates went head to head in a televised debate in Pennsylvania on 10 September that just over 67 million people tuned in to watch. A majority of national polls carried out in the week after suggested Harris's performance had helped her make some small gains, with her lead increasing from 2.5 percentage points on the day of the debate to 3.3 points just over a week later. That marginal boost was mostly down to Trump’s numbers though. His average had been rising ahead of the debate, but it fell by half a percentage point in the week afterwards. You can see those small changes in the poll tracker chart below, with the trend lines showing how the averages have changed and the dots showing the individual poll results for each candidate.",
              image: "https://via.placeholder.com/150",
              link: "-cnn.article.link.goes.here.com",
              logo: "https://via.placeholder.com/150",
              metrics: { viewsCount: 762, trendingRate: 43, region: 'New York, USA' }
          }
        ])
        toggleLoading(false);
        setRequest({});
        setSubmitRequest(false);
      }).catch(error => {
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