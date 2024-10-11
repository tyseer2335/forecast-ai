from typing import List
from model.forecast_request import ForecastRequest
from utils.process_date import convert_str_to_datetime


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

    prompt = f"Final goal is to break down the following forecast question: `{question}` into {num_queries} in total."
    # make dynamic prompt based on the variables
    for source, num in num_of_queries_per_source.items():
        prompt += f"\nGenerate {num} queries based on the forecast question " \
                  f"which will be used to search for news from {source}."
    prompt += f"\nGenerate {num_of_queries_per_automatic} queries based on the forecast question " \
              f"which will be used to general news from different sources."

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}]
    )
    return [query.strip() for query in response.choices[0].message.split('\n') if query.strip()]
