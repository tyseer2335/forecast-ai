from pydantic import BaseModel
from typing import Optional


class ForecastRequest(BaseModel):
    """
    question: The forecasting question

    num_queries: The number of queries to generate from the forecasting question
    perc_of_each_source: The percentage of each source
    before_ranking_num_articles: The number of articles to collect and rank in total
    after_ranking_num_articles: The number of articles to use

    start_date: The start date to collect articles
    end_date: The end date to collect articles
    """
    question: str

    num_queries: Optional[int] = 5
    perc_of_each_source: dict[str, float] = {'automatic': 0.6, 'x.com': 0.2, 'facebook.com': 0.2}
    before_ranking_num_articles: Optional[int] = 10
    after_ranking_num_articles: Optional[int] = 5

    start_date: Optional[str] = None
    end_date: Optional[str] = None
