from fastapi import FastAPI, HTTPException
from openai import OpenAI
from pydantic import BaseModel
from typing import Optional
from datetime import date
from dotenv import load_dotenv
from query_to_answer import break_down_query, collect_news, generate_forecast
import os

# [Initialize FastAPI app]
# pip install "uvicorn[standard]"
# uvicorn main:app
app = FastAPI()
load_dotenv()
OPENAI_API_KEY = os.getenv('OPENAPI_API_KEY')
client = OpenAI(api_key=OPENAI_API_KEY)


class ForecastRequest(BaseModel):
    question: str
    num_articles: Optional[int] = 5
    start_date: Optional[date] = None
    end_date: Optional[date] = None


@app.post("/query_to_answer")
def query_to_answer(request: ForecastRequest):
    try:
        search_queries = break_down_query.generate_search_queries(client, request.question)
        news = collect_news.collect_news(search_queries, max_results=request.num_articles, start_date=request.start_date, end_date=request.end_date)
        answer = generate_forecast.generate_forecast(news)
        return answer
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating answer to query: {str(e)}")
