import os

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request, WebSocket, Depends
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI

from query_to_answer import (
    break_down_query,
    collect_news,
    scrapping_content,
    filtering,
    generate_forecast,
    generate_bias,
)
from utils import convert_to_article
from model.forecast_request import ForecastRequest
from share_chat import share_chat
import asyncio

import firebase_admin
from firebase_admin import credentials, auth as firebase_auth
from firebase_admin.auth import verify_id_token

import time

# [Initialize FastAPI app]
# pip install "uvicorn[standard]"
# uvicorn main:app
app = FastAPI()
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=OPENAI_API_KEY)
LOCAL_OR_PROD = os.getenv("LOCAL_OR_PROD")
DOCKER_OR_LAMBDATEST = os.getenv("DOCKER_OR_LAMBDATEST")
SINGLE_OR_PARALLEL = os.getenv("SINGLE_OR_PARALLEL")
USERNAME = os.getenv("USERNAME")
ACCESS_KEY = os.getenv("ACCESS_KEY")
USE_SELENIUM_TRUE_OR_FALSE = os.getenv("USE_SELENIUM_TRUE_OR_FALSE")

# Initialize Firebase Admin with a service account key
cred = credentials.Certificate(os.getenv("FIREBASE_SERVICE_ACCOUNT_KEY"))
firebase_app = firebase_admin.initialize_app(cred)

from firebase_admin import firestore
import hashlib
from google.cloud.firestore_v1.base_query import FieldFilter

db = firestore.client(firebase_app)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dictionary to store WebSocket connections
active_connections = {}


# dependency function to verify the token
async def verify_token(request: Request):
    """
    Verify the token in the Authorization header of the request.

    Parameters:
    - request: Request object containing the token in the Authorization header

    Returns:
    - None
    """
    auth_header = request.headers.get("Authorization")
    print("Received Authorization header:", auth_header)
    if not auth_header:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    token = auth_header.split(" ")[1]
    try:
        decoded_token = firebase_auth.verify_id_token(token)
        print("Decoded Token:", decoded_token)
        request.state.user = decoded_token  # Store user info in request state
    except Exception as e:
        print("Token verification failed:", str(e))
        raise HTTPException(
            status_code=401, detail="Invalid or expired token: Please login again"
        )


# WebSocket endpoint to send real-time status updates
@app.websocket("/status")
async def websocket_status(websocket: WebSocket, query_id: str):
    """
    WebSocket endpoint to send real-time status updates for the query_id.

    Parameters:
    - websocket: WebSocket object
    - query_id: The unique ID for the query

    Returns:
    - None
    """
    await websocket.accept()
    active_connections[query_id] = websocket
    try:
        while True:
            await websocket.receive_text()  # Keeps connection open
    except:
        del active_connections[query_id]
    finally:
        await websocket.close()


# Function to send status update message to the WebSocket connection
async def send_status_update(query_id: str, message: str):
    """
    Send status update message to the WebSocket connection for the query_id.

    Parameters:
    - query_id: The unique ID for the query
    - message: The status update message to send

    Returns:
    - None
    """
    if query_id in active_connections:
        websocket = active_connections[query_id]
        try:
            await websocket.send_text(
                message
            )  # Using await to ensure it sends immediately
        except:
            del active_connections[query_id]


# API to generate answer to the query
@app.post("/query_to_answer", dependencies=[Depends(verify_token)])
async def query_to_answer(
    check_request: Request, request: ForecastRequest, query_id: str
):
    """
    Generate answer to the query using the Forecast AI model.

    Parameters:
    - check_request: Request object containing the user info
    - request: ForecastRequest object containing the query and other parameters
    - query_id: The unique ID for the query

    Returns:
    - final_response: The final response containing the answer, rationale, forecast, sources, and bias
    """
    state = 0
    print("Start")
    try:
        if not check_request.state.user:
            raise HTTPException(
                status_code=500, detail="User info not set in request state"
            )

        # Log to confirm user info is set before external API calls
        print("Authenticated user info:", check_request.state.user)

        state = 1
        await send_status_update(query_id, "Generating search queries...")
        # Generate search queries
        search_queries = break_down_query.generate_search_queries(client, request)
        if search_queries["success"] is False:
            raise HTTPException(
                status_code=500,
                detail=f"Error generating answer to query. State: {state}",
            )

        state = 2
        await asyncio.sleep(0)
        await send_status_update(query_id, "Collecting news...")
        # Collect news
        # return dict; key as query, value as list of dict with title, description, published date, url, publisher
        news = collect_news.collect_news(search_queries["queries"], request)

        state = 3
        await asyncio.sleep(0)
        await send_status_update(query_id, "Scraping content...")
        # Content added to each news
        # return dict; key as query, value as list of dict with title, description, published date, url, publisher,
        # content: dict with text and media
        # Example:
        # {'query1': [{'title1': '...', 'description': '...', 'published date': '...', 'url': '...', 'publisher': '...',
        # 'content': {'text': '...', 'media': ['...']}}]}
        print(time.time())
        news_with_content = scrapping_content.multiple_scrape_content(
            news,
            LOCAL_OR_PROD,
            DOCKER_OR_LAMBDATEST,
            SINGLE_OR_PARALLEL,
            USERNAME,
            ACCESS_KEY,
            USE_SELENIUM_TRUE_OR_FALSE,
        )
        # print(news_with_content)
        # await send_status_update(query_id, str(news_with_content))

        state = 4
        await asyncio.sleep(0)
        await send_status_update(query_id, "Converting news objects to articles...")
        news_objects = convert_to_article.dict_to_article(news_with_content)

        state = 5
        await asyncio.sleep(0)
        await send_status_update(query_id, "Filtering and scoring relevance...")
        filtering.get_relevance_score(news_objects, request.question, client)

        state = 6
        await asyncio.sleep(0)
        await send_status_update(query_id, "Ranking news articles...")
        ranked_news_with_content = filtering.sort_and_filter(
            news_objects,
            request.after_ranking_num_articles,
            request.perc_of_each_source,
        )

        state = 7
        await asyncio.sleep(0)
        await send_status_update(query_id, "Generating forecast answer...")
        forecast_agent = generate_forecast.ForecastGenerator(
            client=client, model="gpt-4o-mini"
        )
        # answer = {'Question': 'is LLM truely reach AGI?', 'Forecaster ID': 'AI-Forecaster', 'Forecaster Rationale': "Key Facts:\n1. As of my pretraining knowledge cutoff in October 2023, the AI technology referred to as LLM (likely referring to large language models) had not reached AGI (Artificial General Intelligence). AGI refers to highly autonomous systems that outperform humans at most economically valuable work, and as of then, no AI system had demonstrated this level of capability.\n", 'Forecast': '10.0%', 'Sources': {'x.com': [{'title': 'Alex Volkov (Thursd/AI) (@altryne) on X - X', 'content': {}, 'url': 'https://news.google.com/rss/articles/CBMioAFBVV95cUxPNHFZQW0zOUM3ZVhtZy1HVEZmbXBSdlFubi1OYWFjSktBMEdlaks0NU84UmJaSTlyMF9tZkU0dERkdURhTzN2VVd0RkFhem15Q21POEpacUllc3p2cnZpRjdMRzV4ell1WGx0enhHc29IaVdHNE9hWjFoRDczY1l6ckwzLUJ0WFp2aGx1SGJOTkpycVRReVN0YVA5c2ZDMGxT?oc=5&hl=en-CA&gl=CA&ceid=CA:en', 'published_date': 'Mon, 11 Nov 2024 21:57:00 GMT', 'platform': 'automatic'}]}}
        forecast_result = forecast_agent.generate_forecast(
            request, ranked_news_with_content
        )
        # Extract components from forecast result
        answer = forecast_result["answer"]
        raw_response = forecast_result["raw_response"]
        article_summaries = forecast_result["article_summaries"]
        print(forecast_result)

        state = 8
        await asyncio.sleep(0)
        await send_status_update(query_id, "Generating bias...")
        answer_with_bias = generate_bias.generate_bias(answer, client)
        # {'Question': 'is LLM enough to reach AGI?', 'Forecaster ID': 'AI-Forecaster', 'Forecaster Rationale': 'Key Facts:\n1. As of my pretraining knowledge cutoff in October 2023, the AI technology referred to as LLM (likely referring to
        # large language models) had not reached AGI (Artificial General Intelligence). AGI refers to highly autonomous systems that outperform humans at most economically valuable work, and as of then, no AI system had demonstrated this
        # level of capability.\n', 'Forecast': '10.0%', 'Sources': {'x.com': [{'title': 'Alex Volkov (Thursd/AI) (@altryne) on X - X', 'content': {}, 'url': 'https://news.google.com/rss/articles/CBMioAFBVV95cUxPNHFZQW0zOUM3ZVhtZy1HVEZmbXB
        # SdlFubi1OYWFjSktBMEdlaks0NU84UmJaSTlyMF9tZkU0dERkdURhTzN2VVd0RkFhem15Q21POEpacUllc3p2cnZpRjdMRzV4ell1WGx0enhHc29IaVdHNE9hWjFoRDczY1l6ckwzLUJ0WFp2aGx1SGJOTkpycVRReVN0YVA5c2ZDMGxT?oc=5&hl=en-CA&gl=CA&ceid=CA:en', 'published_date':
        #  'Mon, 11 Nov 2024 21:57:00 GMT', 'platform': 'automatic'}]}, 'llm_features': {'statistical_reasoning': {'token_0': 0, 'token_1': 0, 'token_2': 0, 'token_3': 0, 'token_4': 0, 'token_5': 0, 'token_6': 0, 'token_7': 0, 'token_8':
        # 0, 'token_9': 0, 'token_10': 0, 'token_11': 0, 'token_12': 0, 'token_13': 0, 'token_14': 0, 'token_15': 0, 'token_16': 0, 'token_17': 0, 'token_18': 0, 'token_19': 0, 'token_20': 0, 'token_21': 0, 'token_22': 0, 'token_23': 0, '
        # token_24': 0, 'token_25': 0, 'token_26': 0, 'token_27': 0, 'token_28': 0, 'token_29': 0, 'token_30': 0, 'token_31': 0, 'token_32': 0, 'token_33': 0, 'token_34': 0, 'token_35': 0.1, 'token_36': 0, 'token_37': 0.1, 'token_38': 0,
        # 'token_39': 0, 'token_40': 0, 'token_41': 0, 'token_42': 0, 'token_43': 0, 'token_44': 0, 'token_45': 0, 'token_46': 0, 'token_47': 0, 'token_48': 0, 'token_49': 0, 'token_50': 0, 'token_51': 0, 'token_52': 0, 'token_53': 0, 'to
        # ken_54': 0, 'token_55': 0, 'token_56': 0, 'token_57': 0, 'token_58': 0}, 'statistical_refinement': {'token_0': 0, 'token_1': 0, 'token_2': 0, 'token_3': 0, 'token_4': 0, 'token_5': 0, 'token_6': 0, 'token_7': 0, 'token_8': 0, 't
        # oken_9': 0, 'token_10': 0, 'token_11': 0, 'token_12': 0, 'token_13': 0, 'token_14': 0, 'token_15': 0, 'token_16': 0, 'token_17': 0, 'token_18': 0, 'token_19': 0, 'token_20': 0, 'token_21': 0, 'token_22': 0, 'token_23': 0, 'token
        # _24': 0, 'token_25': 0, 'token_26': 0, 'token_27': 0, 'token_28': 0, 'token_29': 0, 'token_30': 0, 'token_31': 0, 'token_32': 0, 'token_33': 0, 'token_34': 0, 'token_35': 0, 'token_36': 0, 'token_37': 0, 'token_38': 0, 'token_39
        # ': 0, 'token_40': 0, 'token_41': 0, 'token_42': 0, 'token_43': 0, 'token_44': 0, 'token_45': 0, 'token_46': 0, 'token_47': 0, 'token_48': 0, 'token_49': 0, 'token_50': 0.1, 'token_51': 0, 'token_52': 0.1, 'token_53': 0, 'token_5
        # 4': 0, 'token_55': 0, 'token_56': 0, 'token_57': 0, 'token_58': 0}, 'causal_reasoning': {'token_0': 0, 'token_1': 0, 'token_2': 0, 'token_3': 0, 'token_4': 0, 'token_5': 0.1, 'token_6': 0, 'token_7': 0, 'token_8': 0, 'token_9':
        # 0, 'token_10': 0, 'token_11': 0, 'token_12': 0, 'token_13': 0, 'token_14': 0.1, 'token_15': 0, 'token_16': 0, 'token_17': 0, 'token_18': 0, 'token_19': 0, 'token_20': 0, 'token_21': 0, 'token_22': 0, 'token_23': 0, 'token_24': 0
        # , 'token_25': 0, 'token_26': 0, 'token_27': 0.1, 'token_28': 0.1, 'token_29': 0, 'token_30': 0.1, 'token_31': 0, 'token_32': 0.1, 'token_33': 0, 'token_34': 0.1, 'token_35': 0, 'token_36': 0, 'token_37': 0.1, 'token_38': 0, 'tok
        # en_39': 0, 'token_40': 0, 'token_41': 0, 'token_42': 0.1, 'token_43': 0, 'token_44': 0, 'token_45': 0, 'token_46': 0, 'token_47': 0, 'token_48': 0, 'token_49': 0, 'token_50': 0, 'token_51': 0, 'token_52': 0, 'token_53': 0, 'toke
        # n_54': 0.1, 'token_55': 0, 'token_56': 0.1, 'token_57': 0, 'token_58': 0.1}, 'statistical_causal_blend': {'token_0': 0, 'token_1': 0, 'token_2': 0, 'token_3': 0, 'token_4': 0, 'token_5': 0.1, 'token_6': 0, 'token_7': 0, 'token_8
        # ': 0, 'token_9': 0, 'token_10': 0, 'token_11': 0, 'token_12': 0, 'token_13': 0, 'token_14': 0.1, 'token_15': 0, 'token_16': 0, 'token_17': 0, 'token_18': 0, 'token_19': 0, 'token_20': 0, 'token_21': 0, 'token_22': 0, 'token_23':
        #  0, 'token_24': 0, 'token_25': 0, 'token_26': 0, 'token_27': 0.1, 'token_28': 0.1, 'token_29': 0, 'token_30': 0.1, 'token_31': 0, 'token_32': 0.1, 'token_33': 0, 'token_34': 0.1, 'token_35': 0.1, 'token_36': 0, 'token_37': 0.1,
        # 'token_38': 0, 'token_39': 0, 'token_40': 0, 'token_41': 0, 'token_42': 0.1, 'token_43': 0, 'token_44': 0, 'token_45': 0, 'token_46': 0, 'token_47': 0, 'token_48': 0, 'token_49': 0, 'token_50': 0.1, 'token_51': 0, 'token_52': 0.
        # 1, 'token_53': 0, 'token_54': 0.1, 'token_55': 0, 'token_56': 0.1, 'token_57': 0, 'token_58': 0.1}}}

        # Add additional data to final response
        final_response = {
            **answer_with_bias,
            "raw_rationale": raw_response,
            "article_summaries": article_summaries,
        }

        state = 9
        await asyncio.sleep(0)
        await send_status_update(query_id, "Process complete.")
        return final_response
    except Exception as e:
        await send_status_update(query_id, f"Error: {str(e)}. State: {state}")
        raise HTTPException(
            status_code=500,
            detail=f"Error generating answer to query: {str(e)}. State: {state}",
        )


@app.get("/")
async def read_root():
    """
    Check if the server is running.

    Returns:
    - status: "Server is running"
    """
    return {"status": "Server is running"}


# The APIs below are for chat sharing functionality
# API to generate chat_ref_hash and store it in the db
@app.post("/share_chat/share", dependencies=[Depends(verify_token)])
async def share_chat_api(request: Request, user_id: str, chat_id: str):
    """
    Generate chat_ref_hash and store it in the db.
    The chat_ref_hash is a unique hash for the shared chat, which is
    to be embedded in the shareable link in the frontend.

    Parameters:
    - request: Request object containing the user info
    - user_id: The user_id of the chat owner
    - chat_id: The chat_id of the chat to be shared

    Returns:
    - chat_ref_hash: The unique hash for the shared chat
    """
    return share_chat.store_and_get_chat_ref_hash(request, user_id, chat_id, db)


# API to generate user_id and chat_id from chat_ref_hash
@app.post("/share_chat/view")
async def view_chat_api(chat_ref_hash: str):
    """
    Retrieve user_id and chat_id from the chat_ref_hash.

    Parameters:
    - chat_ref_hash: The unique hash for the shared chat

    Returns:
    - user_id: The user_id of the chat owner
    - chat_id: The chat_id of the chat to be shared
    """
    return share_chat.get_user_id_and_chat_id_from_chat_ref_hash(chat_ref_hash, db)
