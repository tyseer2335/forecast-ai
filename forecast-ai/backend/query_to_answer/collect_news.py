from gnews import GNews
from typing import List
from model.forecast_request import ForecastRequest
from utils.process_date import convert_str_to_datetime


def _get_forecasting_news(queries: List[str], max_results: int = 10, language: str = 'en', country: str = 'US',
                          period: str = '7d', start_date: str = None, end_date: str = None,
                          exclude_websites: List[str] = None,
                          proxy: str = None) -> dict:
    """
    Assumption:
    User typed forecasting question.
    Other function break down the question into multiple forecasting related queries.

    This function get multiple forecasting related queries.
    Use the queries to get news, articles, and X/Twitter posts.

    By default, we return 10 results for each query.
    User can specify the number of results to return.
    """
    google_news = GNews(language=language, country=country, period=period, start_date=convert_str_to_datetime(start_date), end_date=convert_str_to_datetime(end_date),
                        exclude_websites=exclude_websites, proxy=proxy, max_results=max_results)
    all_news_per_query = {}
    for query in queries:
        all_news_per_query[query] = google_news.get_news(query)
    return all_news_per_query


def collect_news(queries: List[str], forecastRequest: ForecastRequest) -> dict:
    return _get_forecasting_news(queries, max_results=forecastRequest.before_ranking_num_articles,
                                 start_date=forecastRequest.start_date, end_date=forecastRequest.end_date)
