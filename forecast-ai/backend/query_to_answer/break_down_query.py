from typing import List
from model.forecast_request import ForecastRequest
from utils.process_date import convert_str_to_datetime
import datetime


def generate_search_queries(client: any, metric_eval_ranking: ForecastRequest) -> List[str]:
    # variables
    question = metric_eval_ranking.question

    num_queries = metric_eval_ranking.num_queries
    # {'automatic': 0.6, 'x.com': 0.2, 'facebook.com': 0.2}
    perc_of_each_source = metric_eval_ranking.perc_of_each_source
    # before_ranking_num_articles = metric_eval_ranking.before_ranking_num_articles
    # after_ranking_num_articles = metric_eval_ranking.after_ranking_num_articles

    # start_date = convert_str_to_datetime(metric_eval_ranking.start_date)
    # end_date = convert_str_to_datetime(metric_eval_ranking.end_date)

    num_of_queries_per_source = {source: int(num_queries * perc) for source, perc in perc_of_each_source.items()}
    num_of_queries_per_automatic = num_of_queries_per_source.pop('automatic')

    prompt = f"""
        You are an AI that is superhuman at forecasting and helps humans make predictions of future world events. 
        You are being monitored for your calibration, scored by the Brier score. I will provide you with a search engine to query 
        related sources to make predictions. Write breadth Google search queries to search online for objective information for 
        the following forecasting question: `{question}`.

        RULES:
        0. Your knowledge cutoff is October 2023. The current date is {datetime.datetime.now().strftime('%B %d, %Y')}.
        1. Please only return a list of exactly {num_queries} search engine queries. No extra descriptions!
        2. Your queries should include both news (prefix with "News") and opinions (prefix with "Opinion") keywords.
        3. Return the search engine queries in a numbered list starting from 1.
        """

    # make dynamic prompt based on sources
    for source, num in num_of_queries_per_source.items():
        prompt += f"\nGenerate {num} queries based on the forecast question, used to search for news from {source}."
    prompt += f"\nGenerate {num_of_queries_per_automatic} queries based on the forecast question used for general news."

    # gpt 4o mini with Structured Outputs
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        tools=[
            {
                "name": "Structured Outputs",
                "inputs": {
                    "structured_data": {
                        "num_queries": num_queries,
                        "perc_of_each_source": perc_of_each_source
                    }
                }
            }
        ]
