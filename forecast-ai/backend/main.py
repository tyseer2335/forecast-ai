import os

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI

from query_to_answer import break_down_query, collect_news, scrapping_content, filtering, generate_forecast
from utils import convert_to_article
from model.forecast_request import ForecastRequest

from fastapi import WebSocket
import asyncio

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


# Dictionary to store WebSocket connections
active_connections = {}


# WebSocket endpoint to send real-time status updates
@app.websocket("/status")
async def websocket_status(websocket: WebSocket, query_id: str):
    await websocket.accept()
    active_connections[query_id] = websocket
    try:
        while True:
            await websocket.receive_text()  # Keeps connection open
    except:
        del active_connections[query_id]
        await websocket.close()


async def send_status_update(query_id: str, message: str):
    if query_id in active_connections:
        websocket = active_connections[query_id]
        try:
            await websocket.send_text(message)  # Using await to ensure it sends immediately
        except:
            del active_connections[query_id]


@app.post("/query_to_answer")
async def query_to_answer(request: ForecastRequest, query_id: str):
    state = 0
    try:
        await send_status_update(query_id, "Generating search queries...")
        # Generate search queries
        search_queries = break_down_query.generate_search_queries(client, request)
        if search_queries["success"] is False:
            raise HTTPException(status_code=500, detail=f"Error generating answer to query. State: {state}")
        state = 1

        await send_status_update(query_id, "Collecting news...")
        # Collect news
        # return dict; key as query, value as list of dict with title, description, published date, url, publisher
        news = collect_news.collect_news(search_queries["queries"], request)
        state = 2

        await send_status_update(query_id, "Scraping content...")
        # Content added to each news
        # return dict; key as query, value as list of dict with title, description, published date, url, publisher,
        # content: dict with text and media
        # Example:
        # {'query1': [{'title1': '...', 'description': '...', 'published date': '...', 'url': '...', 'publisher': '...',
        # 'content': {'text': '...', 'media': ['...']}}]}
        news_with_content = scrapping_content.multiple_scrape_content(news, LOCAL_OR_PROD)
        state = 3

        await send_status_update(query_id, "Converting news objects to articles...")
        news_objects = convert_to_article.dict_to_article(news_with_content)
        state = 4

        await send_status_update(query_id, "Filtering and scoring relevance...")
        filtering.get_relevance_score(news_objects, request.question, client)
        state = 5

        await send_status_update(query_id, "Ranking news articles...")
        ranked_news_with_content = filtering.sort_and_filter(news_objects, request.after_ranking_num_articles,
                                                             request.perc_of_each_source)
        state = 6
        await send_status_update(query_id, "Generating forecast answer...")
        answer = generate_forecast.generate_forecast(request, ranked_news_with_content)

        state = 7
        await send_status_update(query_id, "Process complete.")
        return answer
    except Exception as e:
        await send_status_update(query_id, f"Error: {str(e)}. State: {state}")
        raise HTTPException(status_code=500, detail=f"Error generating answer to query: {str(e)}. State: {state}")


@app.get("/")
async def read_root():
    return {"status": "Server is running"}
