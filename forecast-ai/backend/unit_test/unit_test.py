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
    news = test_collect_news(search_queries, request)
    news_with_content = test_scrapping_content(news, LOCAL_OR_PROD)


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


def test_collect_news(search_queries: dict, request: ForecastRequest) -> dict:
    news = collect_news.collect_news(search_queries["queries"], request)
    # {'Who will win the US 2024 election site:x.com': [{'title': 'Collin Rugg (@CollinRugg) - X',
    #                                                    'description': 'Collin Rugg (@CollinRugg)  X',
    #                                                    'published date': 'Wed, 05 Jun 2024 04:45:47 GMT',
    #                                                    'url': 'https://n:en',
    #                                                    'publisher': {'href': 'https://x.com', 'title': 'X'}},
    #                                                   {'title': 'Times Algebra (@TimesAlgebraIND) on X - X',
    #                                                    'description': 'Times Algebra (@TimesAlgebraIND) on X  X',
    #                                                    'published date': 'Sun, 13 Oct 2024 08:30:35 GMT',
    #                                                    'url': 'https://newn',
    #                                                    'publisher': {'href': 'https://x.com', 'title': 'X'}}],
    #  'Who will win the US 2024 election site:facebook.com': [{'title': 'Heather Cox Richardson - Facebook',
    #                                                          'description': 'Heather Cox Richardson  Facebook',
    #                                                          'published date': 'Sat, 31 Oct 2015 05:55:51 GMT',
    #                                                          'url': 'httpsA:en',
    #                                                          'publisher': {'href': 'https://www.facebook.com',
    #                                                                        'title': 'Facebook'}},
    #                                                         ...
    assert isinstance(news, dict)
    assert all(isinstance(key, str) for key in news.keys())
    assert all(isinstance(value, list) for value in news.values())
    assert all(isinstance(article, dict) for value in news.values() for article
               in value)
    assert all('title' in article for value in news.values() for article in value)
    assert all('description' in article for value in news.values() for article in value)
    assert all('published date' in article for value in news.values() for article in value)
    assert all('url' in article for value in news.values() for article in value)
    assert all('publisher' in article for value in news.values() for article in value)
    assert all(isinstance(article['publisher'], dict) for value in news.values() for article in value)
    # assert total # of articles is equal to request.before_ranking_num_articles
    assert sum(len(value) for value in news.values()) == request.before_ranking_num_articles
    logging.info(f"[test_collect_news] news: {news}")
    return news


def test_scrapping_content(news: dict, LOCAL_OR_PROD: str) -> dict:
    news_with_content = scrapping_content.multiple_scrape_content(news, LOCAL_OR_PROD)
    # {'Who will win the US 2024 election site:x.com': [{'title': 'Collin Rugg (@CollinRugg) - X', 'description':
    # 'Collin Rugg (@CollinRugg)  X', 'published date': 'Wed, 05 Jun 2024 04:45:47 GMT',
    # 'url': 'https://news.google.com/rss/articles
    # /CBMiPEFVX3lxTE1jbmUxZ29SdC1QR3BmZUc3UWc0aTlYT1FIRWNWbER1aFJvdFNRQVdFTC1Zbm02eDVkUHQyRA?oc=5&hl=en-CA&gl=CA
    # &ceid=CA:en', 'publisher': {'href': 'https://x.com', 'title': 'X'}, 'content': {'text': '', 'media': []}},
    # {'title': 'Times Algebra (@TimesAlgebraIND) on X - X', 'description': 'Times Algebra (@TimesAlgebraIND) on X
    # X', 'published date': 'Sun, 13 Oct 2024 08:30:35 GMT', 'url':
    # 'https://news.google.com/rss/articles
    # /CBMiPEFVX3lxTE1jbmUxZ29SdC1QR3BmZUc3UWc0aTlYT1FIRWNWbER1aFJvdFNRQVdFTC1Zbm02eDVkUHQyRA?oc=5&hl=en-CA&gl=CA
    # &ceid=CA:en', 'publisher': {'href': 'https://x.com', 'title': 'X'}, 'content': {'text': '', 'media': []}},
    # ... 'Who will win the US 2024 election site:facebook.com': [{'title': 'Heather Cox Richardson - Facebook',
    # 'description': 'Heather Cox Richardson  Facebook',
    assert isinstance(news_with_content, dict)
    assert all(isinstance(key, str) for key in news_with_content.keys())
    assert all(isinstance(value, list) for value in news_with_content.values())
    assert all(isinstance(article, dict) for value in news_with_content.values() for article in value)
    assert all('title' in article for value in news_with_content.values() for article in value)
    assert all('description' in article for value in news_with_content.values() for article in value)
    assert all('published date' in article for value in news_with_content.values() for article in value)
    assert all('url' in article for value in news_with_content.values() for article in value)
    assert all('publisher' in article for value in news_with_content.values() for article in value)
    assert all(isinstance(article['publisher'], dict) for value in news_with_content.values() for article in value)
    assert all('content' in article for value in news_with_content.values() for article in value)
    assert all(isinstance(article['content'], dict) for value in news_with_content.values() for article in value)
    assert all('text' in article['content'] for value in news_with_content.values() for article in value)
    assert all('media' in article['content'] for value in news_with_content.values() for article in value)
    logging.info(f"[test_scrapping_content] news_with_content: {news_with_content}")
    return news_with_content


def test_convert_to_article(news_with_content: dict) -> dict:
    news_objects = convert_to_article.dict_to_article(news_with_content)
    # {'x.com': [<model.article.Article at 0x22948f6bc50>,
    #            <model.article.Article at 0x22948f6b6d0>],
    #  'facebook.com': [<model.article.Article at 0x22948f6b510>,
    #                   <model.article.Article at 0x22948f6bc10>],
    #  'automatic': [<model.article.Article at 0x22948f6ba50>,
    #                <model.article.Article at 0x22948eaff50>,
    #                <model.article.Article at 0x22948eac790>,
    #                <model.article.Article at 0x22948ead350>,
    #                <model.article.Article at 0x22948eac8d0>,
    #                <model.article.Article at 0x22948ead950>]}
    assert isinstance(news_objects, dict)
    assert all(isinstance(key, str) for key in news_objects.keys())
    assert all(isinstance(value, list) for value in news_objects.values())
    assert all(isinstance(article, Article) for value in news_objects.values() for article in value)
    logging.info(f"[test_convert_to_article] news_objects: {news_objects}")


def test_get_relevance_score(news_objects: dict, request: ForecastRequest, client: OpenAI):
    filtering.get_relevance_score(news_objects, request.question, client)
    # update self.score
    assert all(isinstance(article.score, float) for value in news_objects.values() for article in value)
    logging.info(f"[test_get_relevance_score] news_objects: {news_objects}")


def test_sort_and_filter(news_objects: dict, request: ForecastRequest):
    ranked_news_with_content = filtering.sort_and_filter(news_objects, request.after_ranking_num_articles,
                                                         request.perc_of_each_source)
    # {'x.com': [<model.article.Article at 0x22948f6bc50>],
    #  'facebook.com': [<model.article.Article at 0x22948f6b510>],
    #  'automatic': [<model.article.Article at 0x22948eaff50>,
    #                <model.article.Article at 0x22948ead950>,
    #                <model.article.Article at 0x22948eac790>]}
    assert isinstance(ranked_news_with_content, dict)
    assert all(isinstance(key, str) for key in ranked_news_with_content.keys())
    assert all(isinstance(value, list) for value in ranked_news_with_content.values())
    assert all(isinstance(article, Article) for value in ranked_news_with_content.values() for article in value)
    logging.info(f"[test_sort_and_filter] ranked_news_with_content: {ranked_news_with_content}")

