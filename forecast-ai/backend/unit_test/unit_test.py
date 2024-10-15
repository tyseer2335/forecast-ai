import os
from dotenv import load_dotenv
from openai import OpenAI
from query_to_answer import break_down_query, collect_news, scrapping_content, filtering, generate_forecast
from utils import convert_to_article
from model.forecast_request import ForecastRequest
from model.article import Article
# unit test lib
import unittest
# import log lib
import logging


def unit_test_all():
    client, LOCAL_OR_PROD = test_env_var()
    request = test_create_request()
    search_queries = test_generate_search_queries(client, request)


def test_env_var() -> tuple[OpenAI, str]:
    load_dotenv(dotenv_path='../.env')
    OPENAI_API_KEY = os.getenv('OPENAPI_API_KEY')
    client = OpenAI(api_key=OPENAI_API_KEY)
    LOCAL_OR_PROD = os.getenv('LOCAL_OR_PROD')  # set to `local` or `prod`. use `local` for testing selenium
    assert isinstance(OPENAI_API_KEY, str)
    assert isinstance(client, OpenAI)
    assert isinstance(LOCAL_OR_PROD, str) and (LOCAL_OR_PROD == 'local' or LOCAL_OR_PROD == 'prod')
    logging.info(f"[test_env_var] client: {client}, LOCAL_OR_PROD: {LOCAL_OR_PROD}")
    return client, LOCAL_OR_PROD


def test_create_request() -> ForecastRequest:
    request = ForecastRequest(question="Who will win the US 2024 election?",
                              num_queries=5,
                              perc_of_each_source={'automatic': 0.6, 'x.com': 0.2, 'facebook.com': 0.2},
                              before_ranking_num_articles=10,
                              after_ranking_num_articles=5,
                              start_date=None,
                              end_date=None)
    assert isinstance(request, ForecastRequest)
    assert request.question == "Who will win the US 2024 election?"
    assert request.num_queries == 5
    assert request.perc_of_each_source == {'automatic': 0.6, 'x.com': 0.2, 'facebook.com': 0.2}
    assert request.before_ranking_num_articles == 10
    assert request.after_ranking_num_articles == 5
    assert request.start_date is None
    assert request.end_date is None
    logging.info(f"[test_create_request] request: {request}")
    return request


def test_generate_search_queries(client, request: ForecastRequest) -> dict:
    search_queries = break_down_query.generate_search_queries(client, request)
    # {'formatted_queries': {'automatic': ['News: predictions for the US 2024 presidential election',
    #                                      'Opinion: analysis on the US 2024 election candidates',
    #                                      'News: latest polls for the US 2024 election'],
    #                        'x.com': ['Who will win the US 2024 election'],
    #                        'facebook.com': ['Who will win the US 2024 election']},
    #  'success': True,
    #  'queries': ['Who will win the US 2024 election site:x.com',
    #              'Who will win the US 2024 election site:facebook.com',
    #              'News: predictions for the US 2024 presidential election',
    #              'Opinion: analysis on the US 2024 election candidates',
    #              'News: latest polls for the US 2024 election']}
    assert isinstance(search_queries, dict)
    assert 'formatted_queries' in search_queries
    assert 'success' in search_queries
    assert 'queries' in search_queries
    assert search_queries['success'] is True
    assert isinstance(search_queries['formatted_queries'], dict)
    assert isinstance(search_queries['queries'], list)
    assert len(search_queries['queries']) == request.num_queries
    assert all(isinstance(query, str) for query in search_queries['queries'])
    logging.info(f"[test_generate_search_queries] search_queries: {search_queries}")
    return search_queries


