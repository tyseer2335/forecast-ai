from fastapi import FastAPI
from gnews import GNews
app = FastAPI()


@app.get("/")
def root():
    return {"message": "Welcome to the API"}


@app.get("/get/forecasting_news/")
def get_forecasting_news(queries: [str], max_results: int = 10, language: str = 'en', country: str = 'US',
                         period: str = '7d', start_date: str = None, end_date: str = None,
                         exclude_websites: [str] or None = None,
                         proxy: str = None):
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

# pip install "uvicorn[standard]"
# uvicorn main:app