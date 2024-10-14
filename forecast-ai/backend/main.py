import os

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI

from query_to_answer import break_down_query, collect_news, scrapping_content, filtering, generate_forecast
from utils import convert_to_article
from model.forecast_request import ForecastRequest

# [Initialize FastAPI app]
# pip install "uvicorn[standard]"
# uvicorn main:app
app = FastAPI()
load_dotenv()
OPENAI_API_KEY = os.getenv('OPENAPI_API_KEY')
client = OpenAI(api_key=OPENAI_API_KEY)
LOCAL_OR_PROD = os.getenv('LOCAL_OR_PROD')

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.post("/query_to_answer")
def query_to_answer(request: ForecastRequest):
    state = 0
    try:
        # Generate search queries
        search_queries = break_down_query.generate_search_queries(client, request)
        if search_queries["success"] is False:
            raise HTTPException(status_code=500, detail=f"Error generating answer to query. State: {state}")
        state = 1

        # Collect news
        # return dict; key as query, value as list of dict with title, description, published date, url, publisher
        news = collect_news.collect_news(search_queries["queries"], request)
        state = 2

        # Content added to each news
        # return dict; key as query, value as list of dict with title, description, published date, url, publisher,
        # content: dict with text and media
        # Example:
        # {'query1': [{'title1': '...', 'description': '...', 'published date': '...', 'url': '...', 'publisher': '...',
        # 'content': {'text': '...', 'media': ['...']}}]}
        news_with_content = scrapping_content.multiple_scrape_content(news, LOCAL_OR_PROD)
        state = 3
        news_objects = convert_to_article.dict_to_article(news_with_content)
        state = 4

        filtering.get_relevance_score(news_objects, request.question, client)
        state = 5
        ranked_news_with_content = filtering.sort_and_filter(news_objects, request.after_ranking_num_articles,
                                                             request.perc_of_each_source)
        state = 6

        answer = generate_forecast.generate_forecast(request, ranked_news_with_content)
        state = 7
        return answer
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating answer to query: {str(e)}. State: {state}")
