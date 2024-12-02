import os
import sys
import logging
import coloredlogs
from dotenv import load_dotenv
from openai import OpenAI

# Add the parent directory of 'unit_test' to the Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from query_to_answer import break_down_query, collect_news, scrapping_content, filtering, generate_forecast
from utils import convert_to_article
from model.forecast_request import ForecastRequest
from model.article import Article

# Configure logging with green success messages
coloredlogs.install(fmt='%(asctime)s [%(levelname)s] %(message)s', level='INFO')
logging.basicConfig(level=logging.INFO)


def unit_test_all():
    try:
        logging.info("\033[92m[Unit Test] Starting unit tests...\033[0m")
        client, LOCAL_OR_PROD, DOCKER_OR_LAMBDATEST, SINGLE_OR_PARALLEL, USERNAME, ACCESS_KEY = test_env_var()
        logging.info("\033[92m[Unit Test] Environment variables loaded successfully.\033[0m")
        request = test_create_request()
        logging.info("\033[92m[Unit Test] ForecastRequest object created successfully.\033[0m")
        search_queries = test_generate_search_queries(client, request)
        logging.info("\033[92m[Unit Test] Search queries generated successfully.\033[0m")
        news = test_collect_news(search_queries, request)
        logging.info("\033[92m[Unit Test] News collected successfully.\033[0m")
        news_with_content = test_scrapping_content(news, LOCAL_OR_PROD, DOCKER_OR_LAMBDATEST, SINGLE_OR_PARALLEL, USERNAME, ACCESS_KEY)
        logging.info("\033[92m[Unit Test] News with content scrapped successfully.\033[0m")
        news_objects = test_convert_to_article(news_with_content)
        logging.info("\033[92m[Unit Test] News converted to Article objects successfully.\033[0m")
        test_get_relevance_score(news_objects, request, client)
        logging.info("\033[92m[Unit Test] Relevance score calculated successfully.\033[0m")
        ranked_news_with_content = test_sort_and_filter(news_objects, request)
        logging.info("\033[92m[Unit Test] News sorted and filtered successfully.\033[0m")
        test_generate_forecast(request, client, ranked_news_with_content)
        logging.info("\033[92m[Unit Test] Forecast generated successfully.\033[0m")
        logging.info("\033[92m[Unit Test Success]\033[0m All tests passed successfully.")
    except AssertionError as e:
        logging.error(f"[Unit Test Failed] {e}")
        raise


def test_env_var() -> tuple[OpenAI, str]:
    """
    Test if environment variables are loaded correctly
    :return:
    """
    load_dotenv(dotenv_path='../.env')
    OPENAI_API_KEY = os.getenv('OPENAPI_API_KEY')
    client = OpenAI(api_key=OPENAI_API_KEY)
    LOCAL_OR_PROD = os.getenv('LOCAL_OR_PROD')  # set to `local` or `prod`. use `local` for testing selenium
    DOCKER_OR_LAMBDATEST = os.getenv('DOCKER_OR_LAMBDATEST')
    SINGLE_OR_PARALLEL = os.getenv('SINGLE_OR_PARALLEL')
    USERNAME = os.getenv('USERNAME')
    ACCESS_KEY = os.getenv('ACCESS_KEY')
    assert isinstance(OPENAI_API_KEY, str)
    assert isinstance(client, OpenAI)
    assert isinstance(LOCAL_OR_PROD, str) and (LOCAL_OR_PROD == 'local' or LOCAL_OR_PROD == 'prod')
    assert isinstance(DOCKER_OR_LAMBDATEST, str) and (DOCKER_OR_LAMBDATEST == 'docker' or DOCKER_OR_LAMBDATEST == 'lambdatest')
    assert isinstance(SINGLE_OR_PARALLEL, str) and (SINGLE_OR_PARALLEL == 'single' or SINGLE_OR_PARALLEL == 'parallel')
    assert isinstance(USERNAME, str)
    assert isinstance(ACCESS_KEY, str)
    logging.info(f"\033[92m[test_env_var] client: {client}, LOCAL_OR_PROD: {LOCAL_OR_PROD}, DOCKER_OR_LAMBDATEST: {DOCKER_OR_LAMBDATEST}, SINGLE_OR_PARALLEL: {SINGLE_OR_PARALLEL}, USERNAME: {USERNAME}, ACCESS_KEY: {ACCESS_KEY}\033[0m")
    return client, LOCAL_OR_PROD, DOCKER_OR_LAMBDATEST, SINGLE_OR_PARALLEL, USERNAME, ACCESS_KEY


def test_create_request() -> ForecastRequest:
    """
    Test if ForecastRequest object is created correctly
    :return:
    """
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
    logging.info(f"\033[92m[test_create_request] request: {request}\033[0m")
    return request


def test_generate_search_queries(client, request: ForecastRequest) -> dict:
    """
    Test if search queries are generated correctly
    :param client:
    :param request:
    :return:
    """
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
    logging.info(f"\033[92m[test_generate_search_queries] search_queries: {search_queries}\033[0m")
    return search_queries


def test_collect_news(search_queries: dict, request: ForecastRequest) -> dict:
    """
    Test if news are collected correctly
    :param search_queries:
    :param request:
    :return:
    """
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
    # assert total # of articles is within expected range (given floor division)
    num_articles_collected = sum(len(value) for value in news.values())
    lower_bound = request.before_ranking_num_articles - request.num_queries
    upper_bound = request.before_ranking_num_articles + request.num_queries
    assert lower_bound <= num_articles_collected <= upper_bound
    logging.info(f"\033[92m[test_collect_news] news: {news}\033[0m")
    return news


def test_scrapping_content(news: dict, LOCAL_OR_PROD: str, DOCKER_OR_LAMBDATEST: str, SINGLE_OR_PARALLEL: str, USERNAME: str, ACCESS_KEY: str) -> dict:
    """
    Test if content is scrapped correctly
    :param news:
    :param LOCAL_OR_PROD:
    :return:
    """
    news_with_content = scrapping_content.multiple_scrape_content(news, LOCAL_OR_PROD, DOCKER_OR_LAMBDATEST, SINGLE_OR_PARALLEL, USERNAME, ACCESS_KEY)
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
    logging.info(f"\033[92m[test_scrapping_content] news_with_content: {news_with_content}\033[0m")
    return news_with_content


def test_convert_to_article(news_with_content: dict) -> dict:
    """
    Test if news are converted to Article objects correctly
    :param news_with_content:
    :return:
    """
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
    logging.info(f"\033[92m[test_convert_to_article] news_objects: {news_objects}\033[0m")
    return news_objects


def test_get_relevance_score(news_objects: dict, request: ForecastRequest, client: OpenAI):
    """
    Test if relevance score is calculated correctly
    :param news_objects:
    :param request:
    :param client:
    :return:
    """
    filtering.get_relevance_score(news_objects, request.question, client)
    # update self.score
    assert all(isinstance(article.score, float) for value in news_objects.values() for article in value)
    logging.info(f"\033[92m[test_get_relevance_score] news_objects: {news_objects}\033[0m")


def test_sort_and_filter(news_objects: dict, request: ForecastRequest) -> dict:
    """
    Test if news are sorted and filtered correctly
    :param news_objects:
    :param request:
    :return:
    """
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
    logging.info(f"\033[92m[test_sort_and_filter] ranked_news_with_content: {ranked_news_with_content}\033[0m")
    return ranked_news_with_content


def test_generate_forecast(request: ForecastRequest, client: any, ranked_news_with_content: dict):
    """
    Test if forecast is generated correctly
    :param request:
    :param ranked_news_with_content:
    :return:
    """
    forecast_agent = generate_forecast.ForecastGenerator(client=client, model="gpt-4o-mini")
    answer = forecast_agent.generate_forecast(request, ranked_news_with_content)
    # {'answer': HARD_CODED_ANSWER,
    #  'sources': {'x.com': [<model.article.Article at 0x22948f6bc50>],
    #   'facebook.com': [<model.article.Article at 0x22948f6b510>],
    #   'automatic': [<model.article.Article at 0x22948eaff50>,
    #    <model.article.Article at 0x22948ead950>,
    #    <model.article.Article at 0x22948eac790>]}
    assert isinstance(answer, dict)
    assert 'answer' in answer
    assert 'Sources' in answer['answer']
    assert isinstance(answer['answer'], dict)
    assert isinstance(answer['answer']['Sources'], dict)
    assert all(isinstance(key, str) for key in answer['answer']['Sources'].keys())
    assert all(isinstance(value, list) for value in answer['answer']['Sources'].values())
    assert all(isinstance(article, dict) for value in answer['answer']['Sources'].values() for article in value)
    logging.info(f"\033[92m[test_generate_forecast] answer: {answer}\033[0m")
    return answer


if __name__ == '__main__':
    unit_test_all()
