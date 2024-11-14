from pydantic import BaseModel
from typing import Optional


class ForecastRequest(BaseModel):
    """
    Model representing the parameters required for generating forecast-related search queries and collecting news articles.

    Attributes:
        question (str): The main forecasting question to address with the generated queries.
        
        num_queries (Optional[int]): The number of queries to generate from the forecasting question. 
            Defaults to 5.
        
        perc_of_each_source (dict[str, float]): A dictionary specifying the distribution of queries among sources. 
            Keys represent source names (e.g., 'x.com', 'facebook.com'), and values represent the percentage of queries 
            for each source. Default is {'automatic': 0.6, 'x.com': 0.2, 'facebook.com': 0.2}.
        
        before_ranking_num_articles (Optional[int]): The total number of articles to retrieve and rank based on relevance 
            before selecting the final set. Defaults to 10.
        
        after_ranking_num_articles (Optional[int]): The number of top-ranked articles to use after filtering. 
            Defaults to 5.
        
        start_date (Optional[str]): The start date for collecting articles, in YYYY-MM-DD format. 
            Defaults to None, indicating no specific start date.
        
        end_date (Optional[str]): The end date for collecting articles, in YYYY-MM-DD format. 
            Defaults to None, indicating no specific end date.
    """
    question: str

    num_queries: Optional[int] = 5
    perc_of_each_source: dict[str, float] = {'automatic': 0.6, 'x.com': 0.2, 'facebook.com': 0.2}
    before_ranking_num_articles: Optional[int] = 10
    after_ranking_num_articles: Optional[int] = 5

    start_date: Optional[str] = None
    end_date: Optional[str] = None
