from gnews import GNews
from model.forecast_request import ForecastRequest
from utils.process_date import convert_str_to_datetime


def _get_forecasting_news(queries: list[str], max_results: int = 10, language: str = 'en', country: str = 'US',
                          period: str = '7d', start_date: str = None, end_date: str = None,
                          exclude_websites: list[str] = None,
                          proxy: str = None) -> dict:
    """
    Fetches news articles based on a list of forecasting-related queries using the GNews API.

    Args:
        queries (list[str]): A list of forecasting-related search queries.
        max_results (int): Maximum number of articles to return per query. Default is 10.
        language (str): Language for the news articles (e.g., 'en' for English). Default is 'en'.
        country (str): Country for the news articles (e.g., 'US' for United States). Default is 'US'.
        period (str): Time period to fetch news (e.g., '7d' for the past week). Default is '7d'.
        start_date (str, optional): Start date for news filtering in YYYY-MM-DD format. Defaults to None.
        end_date (str, optional): End date for news filtering in YYYY-MM-DD format. Defaults to None.
        exclude_websites (list[str], optional): List of websites to exclude from results. Defaults to None.
        proxy (str, optional): Proxy server to use for requests. Defaults to None.

    Returns:
        dict: A dictionary where each key is a query and the value is a list of news articles for that query.
    """
    google_news = GNews(max_results=max_results, language=language, country=country, period=period,
                        start_date=convert_str_to_datetime(start_date), end_date=convert_str_to_datetime(end_date),
                        exclude_websites=exclude_websites, proxy=proxy)
    all_news_per_query = {}
    for query in queries:
        all_news_per_query[query] = google_news.get_news(query)
    return all_news_per_query


def collect_news(queries: list[str], forecastRequest: ForecastRequest) -> dict:
    """
    Collects news articles based on forecast-related queries, with the number of results determined by the forecast request.

    Args:
        queries (list[str]): A list of forecasting-related search queries.
        forecastRequest (ForecastRequest): An instance containing forecast request parameters, such as date range and the number of articles.

    Returns:
        dict: A dictionary with queries as keys and corresponding lists of news articles as values.
    """
    num_news_per_query = forecastRequest.before_ranking_num_articles // forecastRequest.num_queries
    return _get_forecasting_news(queries, max_results=num_news_per_query, start_date=forecastRequest.start_date,
                                 end_date=forecastRequest.end_date)
