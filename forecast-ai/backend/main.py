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
import asyncio

import firebase_admin
from firebase_admin import credentials, auth as firebase_auth
from firebase_admin.auth import verify_id_token

from firebase_admin import firestore
import hashlib
from google.cloud.firestore_v1.base_query import FieldFilter

import time

# [Initialize FastAPI app]
# pip install "uvicorn[standard]"
# uvicorn main:app
app = FastAPI()
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAPI_API_KEY")
client = OpenAI(api_key=OPENAI_API_KEY)
LOCAL_OR_PROD = os.getenv("LOCAL_OR_PROD")
DOCKER_OR_LAMBDATEST = os.getenv("DOCKER_OR_LAMBDATEST")
SINGLE_OR_PARALLEL = os.getenv("SINGLE_OR_PARALLEL")
USERNAME = os.getenv("USERNAME")
ACCESS_KEY = os.getenv("ACCESS_KEY")
# Initialize Firebase Admin with a service account key
cred = credentials.Certificate(os.getenv("FIREBASE_SERVICE_ACCOUNT_KEY"))
firebase_app = firebase_admin.initialize_app(cred)
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
        raise HTTPException(status_code=401, detail="Invalid or expired token: Please login again")


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
    finally:
        await websocket.close()


async def send_status_update(query_id: str, message: str):
    if query_id in active_connections:
        websocket = active_connections[query_id]
        try:
            await websocket.send_text(
                message
            )  # Using await to ensure it sends immediately
        except:
            del active_connections[query_id]


@app.post("/query_to_answer", dependencies=[Depends(verify_token)])
async def query_to_answer(
    check_request: Request, request: ForecastRequest, query_id: str
):
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
            "global_metrics": {
                "min_relevance_score": filtering.MIN_RELEVANCE_SCORE,
                "max_relevance_score": filtering.MAX_RELEVANCE_SCORE,
            },
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
    return {"status": "Server is running"}


# The below APIs are for the chat sharing feature
# API to generate chat_ref_hash from user_id and chat_id
@app.post("/share_chat/share", dependencies=[Depends(verify_token)])
async def share_chat(request: Request, user_id: str, chat_id: str):
    try:
        if not request.state.user:
            raise HTTPException(
                status_code=500, detail="User info not set in request state"
            )

        # Log to confirm user info is set before external API calls
        # print("Authenticated user info:", request.state.user)

        # Encode the chatRef to chat_hash
        user_id_hash = hashlib.sha256(user_id.encode()).hexdigest()
        chat_id_hash = hashlib.sha256(chat_id.encode()).hexdigest()

        # To concatenate the user_id_hash and chat_id_hash, we will use the delimiter "_"
        chat_ref_hash = user_id_hash + "_" + chat_id_hash

        # Store the hash in the db
        user_doc = db.collection("Users").document(user_id)
        chat_doc = user_doc.collection("Chats").document(chat_id)

        user_doc.update({"userIdHash": user_id_hash})
        print("user doc updated:", user_doc.get().to_dict())
        chat_doc.update({"isShared": True, "chatIdHash": chat_id_hash})

        # Update/Create in user doc with the map of chat_id_hash to chat_id
        # Get sharedChatHashToChatId map if exists

        # try:
        #     shared_chat_hash_to_chat_id_map = user_doc.get().get(
        #         "sharedChatHashToChatId"
        #     )
        # except Exception as e:
        #     shared_chat_hash_to_chat_id_map = {}
        #     user_doc.update({"sharedChatHashToChatId": shared_chat_hash_to_chat_id_map})

        # try:
        #     shared_chat_hash_to_chat_id_map["chat_ref_hash"] = chat_id
        #     user_doc.update({"sharedChatHashToChatId": shared_chat_hash_to_chat_id_map})
        #     firestore.DocumentReference.update(chat_doc, {"isShared": True})
        # except Exception as e:
        #     print("Error updating sharedChatHashToChatId map", str(e))
        #     raise HTTPException(status_code=100, detail=f"Error sharing chat: {str(e)}")

        return {"chat_ref_hash": chat_ref_hash}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error sharing chat: {str(e)}")


# API to generate user_id and chat_id from chat_ref_hash
@app.post("/share_chat/view")
async def view_chat(chat_ref_hash: str):
    try:
        # Split the chat_ref_hash to get the user_id_hash and chat_id_hash
        user_id_hash, chat_id_hash = chat_ref_hash.split("_")

        # Find the user_id from the user_id_hash
        user_id = None
        try:
            user_docs = db.collection("Users").get()
            for user_doc in user_docs:
                print("User doc:", user_doc.to_dict())
                try:
                    if user_doc.get("userIdHash") == user_id_hash:
                        user_id = user_doc.id
                        print("User found")
                        break
                except Exception as e:
                    continue

        except Exception as e:
            raise HTTPException(
                status_code=404, detail="Shared chat not found: User no longer exists"
            )
        if user_id is None:
            raise HTTPException(
                status_code=404, detail="Shared chat not found: User no longer exists"
            )

        # Find the chat_id by iterating through the chats of the user, and checking if the chat_id_hash matches
        chat_id = None
        try:
            print("User id:", user_id)
            chat_docs = (
                db.collection("Users").document(user_id).collection("Chats").get()
            )
            print("Iterating through chat docs: ", chat_docs)
            for chat_doc in chat_docs:
                print("Chat doc:", chat_doc)
                if chat_doc.get("chatIdHash") == chat_id_hash:
                    print("Chat found")
                    chat_id = chat_doc.id
                    break
        except Exception as e:
            raise HTTPException(
                status_code=404,
                detail="Shared chat not found: User seems to have revoked access to the chat",
            )

        # user_docs = db.collection("Users").stream()

        # print("Iterating through user docs")
        # for user_doc in user_docs:

        #     try:
        #         uid = user_doc.get().id
        #         print("User doc id:", uid)

        #     if user_doc.uid == user_id_hash:
        #         user_id = user_doc.uid
        #         print("User found")
        #         break
        # if user_id is None:
        #     raise HTTPException(
        #         status_code=404, detail="Shared chat not found: User no longer exists"
        #     )

        # Find the chat_id from the chat_id_hash

        # chat_id = None
        # try:
        #     shared_chat_hash_to_chat_id_map = user_doc.get().get(
        #         "sharedChatHashToChatId"
        #     )
        #     print("Shared chat hash to chat id map:", shared_chat_hash_to_chat_id_map)
        # except Exception as e:
        #     raise HTTPException(
        #         status_code=404,
        #         detail="Shared chat not found: User seems to have revoked access to the chat",
        #     )
        # chat_id = shared_chat_hash_to_chat_id_map.get(chat_id_hash)
        # if chat_id is None:
        #     raise HTTPException(
        #         status_code=404,
        #         detail="Shared chat not found: User seems to have revoked access to the chat",
        #     )

        return {"user_id": user_id, "chat_id": chat_id}

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error viewing shared chat: {str(e)}"
        )
