from fastapi import FastAPI, HTTPException
from openai import OpenAI
from gnews import GNews
from pydantic import BaseModel
from typing import List, Optional
from datetime import date
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()
client = OpenAI()

OPENAI_API_KEY = os.getenv('OPENAPI_API_KEY')


class ForecastRequest(BaseModel):
    question: str
    num_articles: Optional[int] = 5
    start_date: Optional[date] = None
    end_date: Optional[date] = None

def generate_search_queries(question: str) -> List[str]:
    prompt = f"Break down the following forecast question into 5 key search queries: {question}"
    response = client.chat.completions.create(
        model="gpt-4o-mini", 
        messages=[{ "role": "user", "content": prompt }]
    )
    return [query.strip() for query in response.choices[0].message.split('\n') if query.strip()]

def get_forecasting_news(queries: List[str], max_results: int = 10, language: str = 'en', country: str = 'US',
                         period: str = '7d', start_date: str = None, end_date: str = None,
                         exclude_websites: List[str] = None,
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

@app.get("/")
def root():
    return {"message": "Welcome to the API"}

@app.post("/forecast")
def forecast(request: ForecastRequest):
    try:
        search_queries = generate_search_queries(request.question)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating search queries: {str(e)}")
    return search_queries

# pip install "uvicorn[standard]"
# uvicorn main:app