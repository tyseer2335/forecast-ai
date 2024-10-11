import os

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI

from query_to_answer import break_down_query, collect_news, scrapping_content, metric_eval_ranking, generate_forecast
from model.forecast_request import ForecastRequest

# [Initialize FastAPI app]
# pip install "uvicorn[standard]"
# uvicorn main:app
app = FastAPI()
load_dotenv()
OPENAI_API_KEY = os.getenv('OPENAPI_API_KEY')
client = OpenAI(api_key=OPENAI_API_KEY)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.post("/query_to_answer")
def query_to_answer(request: ForecastRequest):
    try:
        # return list[str]
        search_queries = break_down_query.generate_search_queries(client, request)

        # return dict; key as query, value as list of dict with title, description, published date, url, publisher
        news = collect_news.collect_news(search_queries, max_results=request.num_articles,
                                         start_date=request.start_date, end_date=request.end_date)

        # content added to each news

        # return dict; key as query, value as list of dict with title, description, published date, url, publisher,
        # content: dict with text and media

        # Example:
        # {'query1':
        # [{'title1': '...', 'description': '...', 'published date': '...', 'url': '...', 'publisher': '...',
        # 'content': {'text': '...', 'media': ['...']}}]}
        news_with_content = scrapping_content.multiple_scrape_content(news)

        ranked_news_with_content = metric_eval_ranking.metric_eval_ranking(news_with_content)

        answer = generate_forecast.generate_forecast(ranked_news_with_content)
        return answer
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating answer to query: {str(e)}")
