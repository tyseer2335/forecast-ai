from gnews import GNews
from datetime import date
from typing import List
from main import ForecastRequest


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
    google_news = GNews(language=language, country=country, period=period, start_date=start_date, end_date=end_date,
                        exclude_websites=exclude_websites, proxy=proxy, max_results=max_results)
    all_news_per_query = {}
    for query in queries:
        all_news_per_query[query] = google_news.get_news(query)
    return all_news_per_query


def collect_news(queries: List[str], ForecastRequest) -> dict:

    return _get_forecasting_news(...)
