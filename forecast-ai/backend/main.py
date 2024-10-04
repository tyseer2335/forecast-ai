from fastapi import FastAPI 
from openai import OpenAI
from dotenv import load_dotenv
import os
from query_to_answer import break_down_query, collect_news, generate_forecast
from query_to_answer.break_down_query import ForecastRequest
from pydantic import BaseModel
from typing import Optional
from datetime import date

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
    search_queries = break_down_query.generate_search_queries(request.question)
    news = collect_news.collect_news(search_queries, max_results=request.num_articles, start_date=request.start_date, end_date=request.end_date)
    answer = generate_forecast.generate_forecast(news)
    return answer

# def generate_search_queries(question: str) -> List[str]:
#     prompt = f"Break down the following forecast question into 5 key search queries: {question}"
#     response = client.chat.completions.create(
#         model="gpt-4o-mini", 
#         messages=[{ "role": "user", "content": prompt }]
#     )
#     return [query.strip() for query in response.choices[0].message.split('\n') if query.strip()]


# @app.post("/forecast")
# def forecast(request: ForecastRequest):
#     try:
#         search_queries = generate_search_queries(request.question)
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error generating search queries: {str(e)}")
#     return search_queries
