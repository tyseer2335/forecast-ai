# Given URL, scape the content and return the following:
# Text: The main text content of the page
# Media: A list of media files (images, videos, etc.) on the page
import requests
from bs4 import BeautifulSoup
import html2text
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
import multiprocessing
import concurrent.futures
import time
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, WebDriverException
from typing import Optional
import json
from urllib.parse import quote, urlparse
from query_to_answer.prompt import WHITELIST


def get_decoding_params(gn_art_id):
    response = requests.get(f"https://news.google.com/rss/articles/{gn_art_id}")
    response.raise_for_status()
    soup = BeautifulSoup(response.text, "lxml")
    div = soup.select_one("c-wiz > div")
    return {
        "signature": div.get("data-n-a-sg"),
        "timestamp": div.get("data-n-a-ts"),
        "gn_art_id": gn_art_id,
    }


def decode_urls(articles):
    articles_reqs = [
        [
            "Fbv4je",
            f'["garturlreq",[["X","X",["X","X"],null,null,1,1,"US:en",null,1,null,null,null,null,null,0,1],"X","X",1,[1,1,1],1,1,null,0,0,null,0],"{art["gn_art_id"]}",{art["timestamp"]},"{art["signature"]}"]',
        ]
        for art in articles
    ]
    payload = f"f.req={quote(json.dumps([articles_reqs]))}"
    headers = {"content-type": "application/x-www-form-urlencoded;charset=UTF-8"}
    response = requests.post(
        url="https://news.google.com/_/DotsSplashUi/data/batchexecute",
        headers=headers,
        data=payload,
    )
    response.raise_for_status()
    return [json.loads(res[2])[1] for res in json.loads(response.text.split("\n\n")[1])[:-2]]


def return_new_links(encoded_urls: list[str]) -> list[str]:
    # articles_params = [get_decoding_params(urlparse(url).path.split("/")[-1]) for url in encoded_urls]
    # decoded_urls = decode_urls(articles_params)

    # Instead use for loop one by one to get correct orders.
    # If 1, 2, 3 given, return in 1, 2, 3 order.
    decoded_urls = []
    for url in encoded_urls:
        articles_params = get_decoding_params(urlparse(url).path.split("/")[-1])
        decoded_urls.append(decode_urls([articles_params])[0])

    return decoded_urls


def convert_to_decoded_urls(urls: dict[str, list[dict[str, str]]]) -> dict[str, list[dict[str, str]]]:
    # print("[URLs]", urls)
    urls_to_decode = []
    for key, articles in urls.items():
        urls_to_decode.extend([article["url"] for article in articles])
    # print("[Before]", urls_to_decode)
    decoded_urls = return_new_links(urls_to_decode)
    # reverse_decoded_urls = {url: decoded_url for url, decoded_url in zip(urls_to_decode, decoded_urls)}
    # print("[After]", decoded_urls) # list of urls
    # update the urls
    # make decoded_urls iterable
    decoded_urls = iter(decoded_urls)
    for key, articles in urls.items():
        for article in articles:
            article["url"] = next(decoded_urls)
    return urls

def _single_scrape_content(url: str) -> dict:
    """
    Scrapes the text and media content from a single web page using basic HTML parsing.

    Args:
        url (str): The URL of the web page to scrape.

    Returns:
        dict: A dictionary containing the text content and a list of media URLs (e.g., images) on the page.
    """
    if not any(x in url for x in WHITELIST):
        response = requests.get(url)
        soup = BeautifulSoup(response.content, 'html.parser')

        cleaner = html2text.HTML2Text()
        cleaner.ignore_links = True
        cleaner.ignore_images = True
        clean_text = cleaner.handle(str(soup))

        # Extract text content from common tags
        text_elements = soup.find_all(['p', 'h1', 'h2', 'h3', 'span', 'div'])
        clean_text = ' '.join([elem.get_text(strip=True) for elem in text_elements])

        # Extract media content
        media = [img['src'] for img in soup.find_all('img')]

        return {
            'text': clean_text,
            'media': media
        }
    return {
        'text': '',
        'media': []
    }


def init_driver(LOCAL_OR_PROD: str, DOCKER_OR_LAMBDATEST: str, USERNAME: str, ACCESS_KEY: str) -> webdriver.Chrome:
    """
    Initializes a Selenium WebDriver instance based on environment specifications.

    Args:
        LOCAL_OR_PROD (str): Environment type, either 'local' for local testing or 'prod' for production.
        DOCKER_OR_LAMBDATEST (str): Specifies if the environment uses 'docker' or 'lambdatest' for Selenium.
        USERNAME (str): Username for LambdaTest if used.
        ACCESS_KEY (str): Access key for LambdaTest if used.

    Returns:
        webdriver.Chrome: The initialized Selenium WebDriver instance.
    """
    options = Options()
    if LOCAL_OR_PROD == 'prod':
        options.add_argument('--headless')
        options.add_argument('--no-sandbox')
        options.add_argument('--disable-dev-shm-usage')
        options.add_argument('--disable-gpu')
        options.add_argument('--disable-extensions')
        options.add_argument('--ignore-certificate-errors')
        options.binary_location = '/usr/bin/google-chrome'

    if DOCKER_OR_LAMBDATEST == 'docker':
        driver = webdriver.Chrome(options=options)
    else:
        # LambdaTest specific configurations
        lt_options = {
            "browserName": "Chrome",
            "browserVersion": "130",  # Ensure this version is supported on LambdaTest
            "platformName": "Windows 10",
            "username": USERNAME,
            "accessKey": ACCESS_KEY,
            "project": "Untitled",
            "w3c": True,
            "plugin": "python-python"
        }
        options.set_capability('LT:Options', lt_options)
        # Initialize the WebDriver with LambdaTest capabilities
        driver = webdriver.Remote(
            command_executor='https://hub.lambdatest.com/wd/hub',
            options=options
        )
    return driver


# def _ensure_content_loaded_with_new_url(driver: webdriver.Chrome, url: str) -> str:
#     driver.get(url)
#     print(f"Scraping content for url: {url}")
#     # once we get redirected to the page, we need to wait for the page to load
#     # wait till news.google.com is not in the url
#     while 'news.google.com' in driver.current_url:
#         # time.sleep(3)
#         WebDriverWait(driver, 5)
#         # print(f"Redirected to {driver.current_url}, waiting for page to load...")
#         # pass
#
#     # time.sleep(3)
#     WebDriverWait(driver, 5)
#
#     # Get the final URL after all redirections
#     final_url = driver.current_url
#     return final_url

def _ensure_content_loaded_with_new_url(
        driver: webdriver.Chrome,
        url: str,
        timeout: int = 10,
        max_retries: int = 3
) -> Optional[str]:
    """
    Load URL and ensure content is fully loaded with proper redirect handling
    Returns final URL or None if failed
    """
    retry_count = 0

    while retry_count < max_retries:
        try:
            # Load the URL
            driver.get(url)
            print(f"Attempting to load URL (attempt {retry_count + 1}): {url}")

            # Wait for URL to change from news.google.com
            url_changed = WebDriverWait(driver, timeout).until(
                lambda x: "news.google.com" not in x.current_url
            )

            # Wait for page load
            WebDriverWait(driver, timeout).until(
                EC.presence_of_element_located((By.TAG_NAME, "body"))
            )

            # Additional check for document ready state
            is_ready = WebDriverWait(driver, timeout).until(
                lambda x: x.execute_script("return document.readyState") == "complete"
            )

            final_url = driver.current_url

            # Verify we have a valid final URL
            if final_url and "news.google.com" not in final_url:
                return final_url

            print(f"Invalid final URL: {final_url}, retrying...")
            retry_count += 1

        except (TimeoutException, WebDriverException) as e:
            print(f"Error loading page (attempt {retry_count + 1}): {str(e)}")
            retry_count += 1
            time.sleep(1)  # Brief pause before retry

    print(f"Failed to load content after {max_retries} attempts")
    return None


def advanced_selenium_scrape_content(driver: webdriver.Chrome, url: str) -> dict:
    """
    Uses Selenium to scrape content from a web page, including handling JavaScript-rendered content.

    Args:
        driver (webdriver.Chrome): The Selenium WebDriver instance.
        url (str): The URL of the web page to scrape.

    Returns:
        dict: A dictionary containing:
            - 'text': The main text content of the page.
            - 'media': A list of media URLs (e.g., images).
            - 'final_url': The URL of the page after all redirects.
    """
    final_url = _ensure_content_loaded_with_new_url(driver, url)
    if final_url is None:
        return {
            'text': '',
            'media': [],
            'final_url': url  # Keep original URL if scraping fails
        }

    # Extract text content
    print("Extracting text content...")
    clean_text = driver.find_element(By.TAG_NAME, 'body').text
    print(clean_text)

    # Extract media content
    print("Extracting media content...")
    media = [img.get_attribute('src') for img in driver.find_elements(By.TAG_NAME, 'img')]
    # clean media: remove None and any text, only links
    media = [link for link in media if link]

    return {
        'text': clean_text,
        'media': media,
        'final_url': final_url
    }


def scrape_content_process(url, env, DOCKER_OR_LAMBDATEST, USERNAME, ACCESS_KEY):
    """
    Scrapes content from a URL using Selenium in a separate process.

    Args:
        url (str): The URL to scrape.
        env (str): The environment ('local' or 'prod') to determine WebDriver settings.
        DOCKER_OR_LAMBDATEST (str): Specifies if Docker or LambdaTest is used for Selenium.
        USERNAME (str): Username for LambdaTest authentication.
        ACCESS_KEY (str): Access key for LambdaTest authentication.

    Returns:
        dict: A dictionary containing the scraped 'text', 'media' URLs, and 'final_url' after redirects.
    """
    driver = init_driver(env, DOCKER_OR_LAMBDATEST, USERNAME, ACCESS_KEY)
    try:
        res = advanced_selenium_scrape_content(driver, url)
    except Exception as e:
        print(f"Error scraping content: {str(e)} for url: {url}")
        res = {
            'text': '',
            'media': [],
            'final_url': url  # Keep original URL if scraping fails
        }
    driver.quit()
    return res


def single(urls: dict, env: str, DOCKER_OR_LAMBDATEST: str, USERNAME: str, ACCESS_KEY: str,
           USE_SELENIUM_TRUE_OR_FALSE: str = "false") -> dict:
    """
    Scrapes content from multiple URLs in a single-threaded manner.

    Args:
        urls (dict): A dictionary of articles with URLs to scrape.
        env (str): The environment ('local' or 'prod') to determine WebDriver settings.
        DOCKER_OR_LAMBDATEST (str): Specifies if Docker or LambdaTest is used for Selenium.
        USERNAME (str): Username for LambdaTest authentication.
        ACCESS_KEY (str): Access key for LambdaTest authentication.

    Returns:
        dict: A dictionary with updated article data containing scraped text and media URLs.
    """
    urls = urls.copy()
    # if env == 'local':  # Init here for faster loading
    driver = init_driver(env, DOCKER_OR_LAMBDATEST, USERNAME, ACCESS_KEY)

    # Add 'content' key to each news
    print(urls)
    for _, news in urls.items():
        for article in news:
            try:
                article['content'] = _single_scrape_content(article['url'])
                if not article['content']['text']:
                    print("ERRRRRRRRRRRRRRRRRRRRPR", article['url'])
            except Exception as e:
                print(f"Error scraping content: {str(e)} for url: {article['url']}")
                return e
    if USE_SELENIUM_TRUE_OR_FALSE != "false":
        for _, news in urls.items():
            for article in news:
                if not article['content']['text']:
                    try:
                        res = advanced_selenium_scrape_content(driver, article['url'])
                        article['content']['text'] = res['text']
                        article['url'] = res['final_url']  # Update the URL to the final redirected URL
                        if not article['content']['media']:
                            article['content']['media'] = res['media']
                    except Exception as e:
                        print(f"Error scraping content: {str(e)} for url: {article['url']}")
    driver.quit()
    return urls


def parallel(urls: dict, env: str, DOCKER_OR_LAMBDATEST: str, USERNAME: str, ACCESS_KEY: str) -> dict:
    """
    Scrapes content from multiple URLs in parallel using concurrent processing.

    Args:
        urls (dict): A dictionary of articles with URLs to scrape.
        env (str): The environment ('local' or 'prod') to determine WebDriver settings.
        DOCKER_OR_LAMBDATEST (str): Specifies if Docker or LambdaTest is used for Selenium.
        USERNAME (str): Username for LambdaTest authentication.
        ACCESS_KEY (str): Access key for LambdaTest authentication.

    Returns:
        dict: A dictionary with updated article data containing scraped text and media URLs.
    """
    urls = urls.copy()
    with concurrent.futures.ProcessPoolExecutor(max_workers=None) as executor:
        future_to_url = {executor.submit(scrape_content_process, article['url'],
                                         env, DOCKER_OR_LAMBDATEST, USERNAME, ACCESS_KEY): article for
                         news in urls.values() for article in news}
        for future in concurrent.futures.as_completed(future_to_url):
            article = future_to_url[future]
            try:
                result = future.result()
                # Update article with content and URLs
                article['content'] = {
                    'text': result['text'],
                    'media': result['media']
                }
                article['url'] = result['final_url']  # Update the URL to the final redirected URL
                print(f"Finished processing article: {article['url']}")
            except Exception as e:
                print(f"Error processing article: {e}")
                # article['content']['text'] = e
                # if not article['content']['media']:
                #     article['content']['media'] = []
    return urls


def multiple_scrape_content(urls: dict, env: str, DOCKER_OR_LAMBDATEST: str, SINGLE_OR_PARALLEL: str,
                            USERNAME: str, ACCESS_KEY: str, USE_SELENIUM_TRUE_OR_FALSE: str = "false") -> dict:
    """
    Chooses between single-threaded or parallel scraping for content based on configuration.

    Args:
        urls (dict): A dictionary of articles with URLs to scrape.
        env (str): The environment ('local' or 'prod') to determine WebDriver settings.
        DOCKER_OR_LAMBDATEST (str): Specifies if Docker or LambdaTest is used for Selenium.
        SINGLE_OR_PARALLEL (str): Specifies if the function should run in 'single' or 'parallel' mode.
        USERNAME (str): Username for LambdaTest authentication.
        ACCESS_KEY (str): Access key for LambdaTest authentication.

    Returns:
        dict: A dictionary with updated article data containing scraped text and media URLs.
    """
    try:
        urls = convert_to_decoded_urls(urls)
        if SINGLE_OR_PARALLEL == 'single' or USE_SELENIUM_TRUE_OR_FALSE == "false":
            return single(urls, env, DOCKER_OR_LAMBDATEST, USERNAME, ACCESS_KEY, USE_SELENIUM_TRUE_OR_FALSE)
        return parallel(urls, env, DOCKER_OR_LAMBDATEST, USERNAME, ACCESS_KEY)
    except Exception as e:
        print(f"Error scraping content: {str(e)}")
        raise e

# if __name__ == '__main__':
#     print(multiprocessing.cpu_count())
#     env = "LOCAL"
#     urls = {'query1': [{'title1': '...',
#        'description': '...',
#        'published date': '...',
#        'url': 'https://x.com/elonmusk/status/1853260913690005634',
#        'publisher': '...',
#        'content': {'text': '...', 'media': ['...']}}],
#
#             'query2': [{'title1': '...',
#                         'description': '...',
#                         'published date': '...',
#                         'url': 'https://news.google.com/rss/articles/CBMiakFVX3lxTE5IazRqZzBWaWp6VE94Umt0dlRTSjhOMVJpN2JNSkdiQ2d2M28yREt3S2xoalNUUnQ4ZktQRGJiS2s1M2N2bWNkXzQ2RHNZaDFFLXR3Tzdtb3hlY2NoNEY3U1NpaS1WRlRMSVHSAXJBVV95cUxPWmhqd291aFcwZEpZR05QSGxLRjM2eVJHTlBTTENYNGdpeDFkc2gtSk42MTdQNUFmbnhLU2lXN00zOWNrRnY1bzFVZlF0WnlCWl9IU19rM0R0blVMN2xJVHpudlRubl9paGRGb2VONzdKNFE?oc=5&hl=en-US&gl=US&ceid=US:en',
#                         'publisher': '...',
#                         'content': {'text': '...', 'media': ['...']}}]
#             }
#     print(multiple_scrape_content(urls, env, 'docker', '...', '...'))
# {'query1': [{'title1': '...', 'description': '...', 'published date': '...', 'url': 'https://x.com/elonmusk/status/1853260913690005634', 'publisher': '...', 'content': {'text': 'Don’t miss what’s happening\nPeople on X are the first to know.\nLog in\nSign up\nWelcome to x.com!\nWe are letting you know that we are changing our URL, but your privacy and data protection settings remain the same.\nFor more details, see our Privacy Policy: https://x.com/en/privacy', 'media': []}}], 'query2': [{'title1': '...', 'description': '...', 'published date': '...', 'url': 'https://www.nbcnews.com/politics/2024-elections/exit-polls', 'publisher': '...', 'content': {'text': "NBC News Logo\nState results\nPresident\nSenate\nHouse\nGov.\nExit polls\nBallot measures\nSec. of state\nAttorney general\nRoad to 270\nLIVE\nLast update 8:02 PM ET\nExit Polls\nNBC News, in conjunction with a consortium of news organizations, conducted exit polling across the country in 10 key states. The polling included speaking with voters at polling places and phone interviews. The exit polls are not results, but instead a look at the thinking and motives of voters across the country. Exit polls help the public better understand the makeup and motivations of the electorate.\n- view less\nKey States\nArizona\nFlorida\nGeorgia\nMichigan\nNevada\nNorth Carolina\nOhio\nPennsylvania\nTexas\nWisconsin\nDemocrats\nRepublicans\nOther\nGender\nMen (47%)\n42%\n55%\nWomen (53%)\n53%\n45%\nAre you:\nWhite (71%)\n41%\n57%\nBlack (11%)\n85%\n13%\nHispanic/Latino (12%)\n52%\n46%\nAsian (3%)\n54%\n39%\nOther (3%)\n42%\n54%\nAre you:\nWhite (71%)\n41%\n57%\nBlack (11%)\n85%\n13%\nHispanic/Latino (12%)\n52%\n46%\nAsian (3%)\n54%\n39%\nAmerican Indian (1%)\n34%\n65%\nOther (2%)\n43%\n52%\nRace\nWhite (71%)\n41%\n57%\nNon-White (29%)\n64%\n33%\nSex by race\nWhite men (34%)\n37%\n60%\nWhite women (37%)\n45%\n53%\nBlack men (5%)\n77%\n21%\nBlack women (7%)\n91%\n7%\nLatino men (6%)\n43%\n55%\nLatino women (6%)\n60%\n38%\nAll other races (6%)\n48%\n46%\nIn which age group are you?\n18-29 (14%)\n54%\n43%\n30-44 (23%)\n49%\n48%\n45-64 (35%)\n44%\n54%\n65 or over (28%)\n49%\n49%\nAge\n18-44 (37%)\n51%\n46%\n45+ (63%)\n46%\n52%\nAge\n18-24 (9%)\n54%\n42%\n25-29 (6%)\n53%\n45%\n30-39 (16%)\n50%\n46%\n40-49 (16%)\n48%\n50%\n50-64 (27%)\n43%\n56%\n65 or over (28%)\n49%\n49%\nAge by gender\nMen 18-29 (7%)\n47%\n49%\nMen 30-44 (12%)\n43%\n53%\nMen 45-64 (16%)\n38%\n60%\nMen 65+ (12%)\n44%\n55%\nWomen 18-29 (7%)\n61%\n37%\nWomen 30-44 (12%)\n54%\n43%\nWomen 45-64 (19%)\n49%\n50%\nWomen 65+ (16%)\n54%\n45%\nAge by race\nWhite 18-29 (8%)\n49%\n49%\nWhite 30-44 (15%)\n42%\n55%\nWhite 45-64 (25%)\n37%\n62%\nWhite 65+ (22%)\n44%\n55%\nBlack 18-29 (2%)\n84%\n15%\nBlack 30-44 (3%)\n82%\n15%\nBlack 45-64 (4%)\n83%\n15%\nBlack 65+ (3%)\n93%\n5%\nLatino 18-29 (3%)\n49%\n47%\nLatino 30-44 (3%)\n52%\n45%\nLatino 45-64 (4%)\n50%\n49%\nLatino 65+ (2%)\n58%\n41%\nAll other (6%)\n48%\n46%\nWhich best describes your education? You have:\nNever attended college (15%)\n35%\n63%\nAttended college but received no degree (26%)\n47%\n51%\nAssociate's degree (AA or AS) (16%)\n41%\n56%\nBachelor's degree (BA or BS) (24%)\n53%\n45%\nAn advanced degree after a bachelor's degree (such as JD, MA, MBA, MD, PhD) (19%)\n59%\n38%\nWhat was the last grade of school you completed?\nCollege graduate (43%)\n55%\n42%\nNo college degree (57%)\n42%\n56%\nEducation by race\nWhite college graduates (33%)\n52%\n45%\nWhite non-college graduates (39%)\n32%\n66%\nNon White college graduates (10%)\n65%\n32%\nNon White non-college graduates (19%)\n64%\n34%\nEducation by gender among white voters\nWhite women college graduates (17%)\n57%\n41%\nWhite women non-college graduates (20%)\n35%\n63%\nWhite men college graduates (16%)\n47%\n50%\nWhite men non-college graduates (18%)\n29%\n69%\nNon-whites (29%)\n64%\n33%\nNo matter how you voted today, do you usually think of yourself as a:\nDemocrat (31%)\n95%\n4%\nRepublican (35%)\n5%\n94%\nIndependent or something else (34%)\n49%\n46%\nOn most political matters, do you consider yourself:\nLiberal (23%)\n91%\n7%\nModerate (42%)\n57%\n40%\nConservative (34%)\n9%\n90%\n2023 total family income:\nUnder $30,000 (12%)\n50%\n46%\n$30,000-$49,999 (16%)\n45%\n53%\n$50,000-$99,999 (32%)\n46%\n51%\n$100,000-$199,999 (28%)\n51%\n47%\n$200,000 or more (13%)\n51%\n45%\n2023 total family income:\nUnder $50,000 (27%)\n47%\n50%\n$50,000 or more (73%)\n49%\n48%\n2023 total family income:\nUnder $100,000 (60%)\n46%\n50%\n$100,000 or more (40%)\n51%\n46%\n2023 total family income:\nUnder $50,000 (27%)\n47%\n50%\n$50,000-$99,999 (32%)\n46%\n51%\n$100,000 or more (40%)\n51%\n46%\nDoes anyone in your household belong to a labor union?\nYes (19%)\n53%\n45%\nNo (81%)\n47%\n50%\nReligion\nProtestant or other Christian (42%)\n36%\n63%\nCatholic (22%)\n40%\n58%\nJewish (2%)\n78%\n22%\nSomething else (10%)\n59%\n34%\nNone (24%)\n71%\n26%\nReligion among white voters\nProtestant/Other Christian (30%)\n26%\n72%\nCatholic (15%)\n35%\n61%\nJewish (2%)\n80%\n20%\nSomething else (5%)\n52%\n43%\nNone (17%)\n71%\n27%\nWhite born-again or evangelical Christian?\nYes (22%)\n17%\n82%\nNo (78%)\n57%\n40%\nDo you have any children under 18 living in your home?\nYes (27%)\n44%\n53%\nNo (73%)\n50%\n48%\nParents\nMen with children (13%)\n37%\n60%\nWomen with children (14%)\n51%\n46%\nMen without children (34%)\n44%\n54%\nWomen without children (38%)\n55%\n44%\nAre you currently married?\nYes (54%)\n43%\n56%\nNo (46%)\n54%\n42%\nGender by marital status\nMarried men (28%)\n38%\n60%\nMarried women (26%)\n48%\n51%\nNon-married men (20%)\n47%\n49%\nNon-married women (27%)\n59%\n38%\nAre you gay, lesbian, bisexual or transgender?\nYes (8%)\n86%\n13%\nNo (92%)\n45%\n53%\nHave you ever served in the U.S. military?\nYes (12%)\n34%\n65%\nNo (88%)\n50%\n48%\nIs this the first year you have ever voted?\nYes (8%)\n43%\n56%\nNo (92%)\n48%\n50%\nDo you think the condition of the nation's economy is:\nExcellent (5%)\n89%\n10%\nGood (27%)\n91%\n8%\nNot so good (35%)\n44%\n54%\nPoor (33%)\n10%\n87%\nDo you think the condition of the nation's economy is:\nExcellent or good (31%)\n91%\n8%\nNot so good or poor (68%)\n28%\n70%\nCompared to four years ago, is your family's financial situation:\nBetter today (24%)\n82%\n14%\nWorse today (46%)\n17%\n81%\nAbout the same (30%)\n69%\n28%\nIn the last year, has inflation caused you and your family:\nA severe hardship (22%)\n24%\n74%\nA moderate hardship (53%)\n45%\n51%\nNo hardship at all (24%)\n77%\n20%\nDo you think America's best days are:\nIn the past (35%)\n31%\n67%\nIn the future (61%)\n58%\n40%\nHow do you feel about the way things are going in the country today?\nEnthusiastic (6%)\n89%\n11%\nSatisfied, but not enthusiastic (19%)\n81%\n18%\nDissatisfied, but not angry (43%)\n42%\n56%\nAngry (30%)\n27%\n72%\nHow do you feel about the way things are going in the country today?\nEnthusiastic or satisfied (25%)\n83%\n16%\nDissatisfied or angry (73%)\n36%\n62%\nWhich ONE of these five issues mattered most in deciding how you voted for president?\nForeign policy (4%)\n37%\n57%\nAbortion (14%)\n74%\n25%\nThe economy (32%)\n19%\n80%\nImmigration (11%)\n9%\n90%\nThe state of democracy (34%)\n80%\n18%\nWhich ONE of these four candidate qualities mattered most in deciding how you voted for president?\nHas the ability to lead (30%)\n33%\n66%\nCares about people like me (18%)\n73%\n25%\nHas good judgment (20%)\n82%\n16%\nCan bring needed change (28%)\n24%\n74%\nShould most undocumented immigrants in the U.S. be:\nOffered a chance to apply for legal status (56%)\n75%\n22%\nDeported to the countries they came from (40%)\n11%\n87%\nIs U.S. support for Israel:\nToo strong (31%)\n67%\n30%\nNot strong enough (30%)\n17%\n82%\nAbout right (31%)\n59%\n39%\nWhich comes closest to your position? Abortion should be:\nLegal in all cases (32%)\n87%\n10%\nLegal in most cases (33%)\n49%\n49%\nIllegal in most cases (26%)\n7%\n92%\nIllegal in all cases (6%)\n11%\n88%\nWhich comes closest to your position? Abortion should be:\nLegal (65%)\n68%\n29%\nIllegal (31%)\n8%\n91%\nWho do you trust more to handle abortion?\nKamala Harris (49%)\n93%\n5%\nDonald Trump (45%)\n2%\n96%\nWho do you trust more to handle the economy?\nKamala Harris (46%)\n98%\n1%\nDonald Trump (52%)\n5%\n93%\nWho do you trust more to handle immigration?\nKamala Harris (44%)\n98%\n1%\nDonald Trump (53%)\n7%\n90%\nWho do you trust more to handle crime and safety?\nKamala Harris (46%)\n97%\n1%\nDonald Trump (52%)\n4%\n95%\nWho do you trust more to handle a crisis?\nKamala Harris (46%)\n97%\n1%\nDonald Trump (52%)\n4%\n95%\nHow confident are you that this year's election is being conducted fairly and accurately?\nVery confident (35%)\n84%\n14%\nSomewhat confident (33%)\n39%\n58%\nNot very confident (21%)\n16%\n82%\nNot at all confident (10%)\n19%\n79%\nHow confident are you that this year's election is being conducted fairly and accurately?\nConfident (68%)\n62%\n35%\nNot confident (31%)\n17%\n81%\nDo you think democracy in the U.S. today is:\nVery secure (8%)\n45%\n54%\nSomewhat secure (17%)\n50%\n48%\nSomewhat threatened (35%)\n49%\n50%\nVery threatened (38%)\n47%\n51%\nDo you think democracy in the U.S. today is:\nSecure (25%)\n48%\n50%\nThreatened (73%)\n48%\n51%\nAre you concerned about violence as a result of this election?\nYes (70%)\n56%\n42%\nNo (28%)\n29%\n69%\nHow do you feel about the way the Supreme Court is handling its job?\nApprove (35%)\n14%\n83%\nDisapprove (60%)\n71%\n26%\nWas your vote for president mainly:\nFor your candidate (73%)\n44%\n55%\nAgainst their opponent (24%)\n60%\n37%\nHow do you feel about the way Joe Biden is handling his job as president?\nStrongly approve (15%)\n98%\n2%\nSomewhat approve (24%)\n95%\n4%\nSomewhat disapprove (14%)\n54%\n43%\nStrongly disapprove (45%)\n4%\n93%\nHow do you feel about the way Joe Biden is handling his job as president?\nStrongly or somewhat approve (40%)\n96%\n3%\nStrongly or somewhat disapprove (59%)\n16%\n82%\nIs your opinion of Kamala Harris:\nFavorable (47%)\n96%\n3%\nUnfavorable (52%)\n5%\n93%\nIs your opinion of Donald Trump:\nFavorable (46%)\n2%\n98%\nUnfavorable (53%)\n88%\n9%\nDo you have a favorable opinion of ...\nOnly Harris (44%)\n99%\n1%\nOnly Trump (43%)\n99%\nBoth (2%)\n40%\n59%\nNeither (8%)\n30%\n56%\nIs your opinion of Tim Walz:\nFavorable (45%)\n91%\n8%\nUnfavorable (47%)\n8%\n90%\nIs your opinion of JD Vance:\nFavorable (47%)\n7%\n92%\nUnfavorable (46%)\n89%\n8%\nDo you have a favorable opinion of ...\nOnly Walz (39%)\n97%\n2%\nOnly Vance (40%)\n2%\n97%\nBoth (5%)\n46%\n52%\nNeither (6%)\n45%\n45%\nAre Kamala Harris' views too extreme?\nYes (47%)\n5%\n92%\nNo (50%)\n90%\n8%\nAre Donald Trump's views too extreme?\nYes (54%)\n85%\n12%\nNo (44%)\n4%\n94%\nAre Kamala Harris'/Donald Trump's views too extreme?\nOnly Harris (38%)\n1%\n98%\nOnly Trump (45%)\n97%\n2%\nBoth (8%)\n21%\n63%\nNeither (5%)\n26%\n65%\nIf Kamala Harris is elected president, would you feel:\nExcited (22%)\n99%\n1%\nOptimistic (25%)\n92%\n7%\nConcerned (21%)\n7%\n89%\nScared (30%)\n1%\n98%\nIf Kamala Harris is elected president, would you feel:\nExcited or optimistic (48%)\n95%\n4%\nConcerned or scared (50%)\n3%\n94%\nIf Donald Trump is elected president, would you feel:\nExcited (22%)\n2%\n98%\nOptimistic (27%)\n5%\n93%\nConcerned (14%)\n81%\n14%\nScared (35%)\n97%\n1%\nIf Donald Trump is elected president, would you feel:\nExcited or optimistic (49%)\n4%\n95%\nConcerned or scared (49%)\n92%\n5%\nIn the 2020 election for president, did you vote for:\nJoe Biden (Dem) (44%)\n93%\n6%\nDonald Trump (Rep) (43%)\n4%\n95%\nOther (2%)\n33%\n43%\nDid not vote (10%)\n45%\n49%\nWhen did you finally decide for whom to vote in the presidential election?\nIn the last few days (4%)\n41%\n47%\nIn the last week (3%)\n42%\n54%\nIn October (6%)\n47%\n40%\nIn September (7%)\n54%\n42%\nBefore that (79%)\n49%\n50%\nTime of vote decision\nIn the last month (13%)\n44%\n46%\nBefore that (86%)\n49%\n49%\nTime of vote decision\nIn the last week (7%)\n41%\n50%\nBefore that (92%)\n49%\n49%\nSuburban whites by sex\nWhite suburban women (19%)\n46%\n53%\nWhite suburban men (18%)\n35%\n62%\nOther (63%)\n52%\n46%\nArea type\nUrban (29%)\n59%\n38%\nSuburban (51%)\n47%\n51%\nRural (19%)\n34%\n64%\nLIVE\nElection Night Coverage\nRaquel Coronell Uribe28m ago / 7:45 PM ET\nTrump-appointed judge pokes fun at Harris in court order\nAlec Hernández & more\n1h ago / 6:55 PM ET\nPolicy areas Vance could pursue as vice president\nJohn Filippelli2h ago / 5:57 PM ET\nCalifornia resident arrested for trespassing at Mar-a-Lago\nAlex Tabet & more\n3h ago / 5:24 PM ET\nWalz vows to fight Trump and reach out to his supporters upon return to Minnesota\nKate Santaliz & more\n3h ago / 5:12 PM ET\nVance gives his son's Cub Scout group a Capitol Hill tour\n3h ago / 5:00 PM ET\nRobot dog among heightened security measures at Mar-A-Lago following Trump win\nAnnemarie Bonner4h ago / 4:36 PM ET\nWalz says he's 'learned a lot' on the campaign trail, vows to fight Trump agenda\nZoë Richards4h ago / 4:17 PM ET\nIndependent Angus King wins re-election to the U.S. Senate in Maine, NBC News projects\nRaquel Coronell Uribe4h ago / 4:17 PM ET\nRepublican Jeff Hurd wins U.S. House seat in Colorado's 3rd Congressional District, NBC News projects\nAnnemarie Bonner4h ago / 4:17 PM ET\nWalz says it's hard to reckon with the path forward after Trump win\nMORE POSTS\n2024 ELECTION RESULTS\nAlabama\nAlaska\nArizona\nArkansas\nCalifornia\nColorado\nConnecticut\nDelaware\nD.C.\nFlorida\nGeorgia\nHawaii\nIdaho\nIllinois\nIndiana\nIowa\nKansas\nKentucky\nLouisiana\nMaine\nMaryland\nMassachusetts\nMichigan\nMinnesota\nMississippi\nMissouri\nMontana\nNebraska\nNevada\nNew Hampshire\nNew Jersey\nNew Mexico\nNew York\nNorth Carolina\nNorth Dakota\nOhio\nOklahoma\nOregon\nPennsylvania\nRhode Island\nSouth Carolina\nSouth Dakota\nTennessee\nTexas\nUtah\nVermont\nVirginia\nWashington\nWest Virginia\nWisconsin\nWyoming\nMORE POLITICS COVERAGE\nLIVE UPDATES\nElection 2024 live updates: Trump prepares for a second term; Judge halts Jack Smith's election interference case\nTRANSGENDER KIDS\nSome Democrats blame party's position on transgender rights in part for Harris' loss\n2024 ELECTION\nWalz vows to fight Trump and reach out to his supporters upon return to Minnesota\nFROM THE POLITICS DESK\nDemocrats learned the wrong lessons from the last midterms: From the Politics Desk\n2024 ELECTION\nThe final price tag on 2024 political advertising: Almost $11 billion\n2024 ELECTION\nDemocratic governors vow to protect their states from Trump and his policies\n2024 ELECTION\nEvery uncalled race left in the fight for control in Washington\n2024 ELECTION\nJudge hits pause on Trump's election interference criminal case\nEXCLUSIVE\nElection Day bomb threats overwhelmingly targeted Democrat-leaning counties\n2024 ELECTION\nWhat Trump's return to the White House could mean for the economy and taxes\n2024 ELECTION\nTrump's call to end birthright citizenship would kick-start a legal fight\n\n\n\n\nABOUT\nCONTACT\nHELP\nCAREERS\nAD CHOICES\nPRIVACY POLICY\nCOOKIE NOTICE\nCA NOTICE\nTERMS OF SERVICE (UPDATED JULY 7, 2023)\nNBC NEWS SITEMAP\nCLOSED CAPTIONING\nADVERTISE\nSELECT SHOPPING\nSELECT PERSONAL FINANCE\n© 2024 NBCUniversal Media, LLC\nNBC NEWS LOGO\nMSNBC LOGO\nTODAY LOGO", 'media': ['https://media-cldnry.s-nbcnews.com/image/upload/v1728332719/firecracker/cms-images/stacked2024Logo.svg', 'https://media-cldnry.s-nbcnews.com/image/upload/dpr_2.0/f_auto,q_auto,w_216,h_228,c_fit/firecracker/headshots/2024/US_P00_R_D_TRUMP.jpg', 'https://media-cldnry.s-nbcnews.com/image/upload/dpr_2.0/f_auto,q_auto,w_216,h_228,c_fit/firecracker/headshots/2024/US_P00_R_D_TRUMP.jpg', 'https://media-cldnry.s-nbcnews.com/image/upload/v1683573975/firecracker/cms-images/decision2024-color.svg', 'https://media-cldnry.s-nbcnews.com/image/upload/v1683573975/firecracker/cms-images/decision2024-sm-color.svg', 'https://media-cldnry.s-nbcnews.com/image/upload/t_focal-60x60,f_auto,q_auto/newscms/2024_41/3665448/241011-raquel-coronell-uribe.jpg', 'https://media-cldnry.s-nbcnews.com/image/upload/t_focal-60x60,f_auto,q_auto/newscms/2024_31/3656891/240729-alec-hernandez.jpg', 'https://media-cldnry.s-nbcnews.com/image/upload/t_focal-60x60,f_auto,q_auto/newscms/2024_31/3656890/240729-alex-tabet.jpg', 'https://media-cldnry.s-nbcnews.com/image/upload/t_focal-60x60,f_auto,q_auto/newscms/2024_10/3641230/kate_santaliz.jpg', 'https://media-cldnry.s-nbcnews.com/image/upload/t_focal-60x60,f_auto,q_auto/newscms/2024_44/3667213/241028-annemarie-bonner.jpg', 'https://media-cldnry.s-nbcnews.com/image/upload/t_focal-60x60,f_auto,q_auto/newscms/2024_41/3665448/241011-raquel-coronell-uribe.jpg', 'https://media-cldnry.s-nbcnews.com/image/upload/t_focal-60x60,f_auto,q_auto/newscms/2024_44/3667213/241028-annemarie-bonner.jpg', 'https://media-cldnry.s-nbcnews.com/image/upload/t_focal-758x379,f_avif,q_auto:best/rockcms/2024-11/241107-trump-ch-1459-4c5eff.jpg', 'https://media-cldnry.s-nbcnews.com/image/upload/t_focal-760x760,f_avif,q_auto:best/rockcms/2024-11/241108-kamala-harris-concession-mn-1520-9d68c7.jpg', 'https://media-cldnry.s-nbcnews.com/image/upload/t_focal-760x760,f_avif,q_auto:best/rockcms/2024-11/241108-walz-ch-1630-ec23be.jpg', 'https://media-cldnry.s-nbcnews.com/image/upload/t_focal-758x379,f_avif,q_auto:best/rockcms/2024-11/241108-kamala-harris-joe-biden-se-451p-0bd136.jpg', 'https://media-cldnry.s-nbcnews.com/image/upload/t_focal-760x760,f_avif,q_auto:best/rockcms/2024-11/20241108-political-ads-sj-1245p-e29cc8.jpg', 'https://media-cldnry.s-nbcnews.com/image/upload/t_focal-760x760,f_avif,q_auto:best/rockcms/2024-11/241108-split-newsom-pritzker-ch-1018-7df04c.jpg', 'https://media-cldnry.s-nbcnews.com/image/upload/t_focal-760x760,f_avif,q_auto:best/rockcms/2024-11/241104-kamala-harris-donald-trump-vl-455p-faec53.jpg', 'https://media-cldnry.s-nbcnews.com/image/upload/t_focal-758x379,f_avif,q_auto:best/rockcms/2024-11/241108-trump-ch-1220-4d9b4c.jpg', 'https://media-cldnry.s-nbcnews.com/image/upload/t_focal-760x760,f_avif,q_auto:best/rockcms/2024-09/240926-vote-poll-election-shadow-sign-ew-656p-d3db96.jpg', 'https://media-cldnry.s-nbcnews.com/image/upload/t_focal-760x760,f_avif,q_auto:best/rockcms/2024-10/20241028-harris-sj-330p-65c677.jpg', 'https://media-cldnry.s-nbcnews.com/image/upload/t_focal-760x760,f_avif,q_auto:best/rockcms/2024-07/240726-donald-trump-mn-1715-28968a.jpg', 'https://media-cldnry.s-nbcnews.com/image/upload/t_focal-60x60,f_auto,q_auto/newscms/2024_41/3665448/241011-raquel-coronell-uribe.jpg', 'https://media-cldnry.s-nbcnews.com/image/upload/t_focal-60x60,f_auto,q_auto/newscms/2024_31/3656891/240729-alec-hernandez.jpg', 'https://tag.researchnow.com/t/beacon?adn=13&ca=https%3A%2F%2Fnews.google.com%2F&pl=https%3A%2F%2Fwww.nbcnews.com%2Fpolitics%2F2024-elections%2Fexit-polls&pr=284801&si=NBCNEWS', 'https://cdn.cookielaw.org/logos/17e5cb00-ad90-47f5-a58d-77597d9d2c16/d44e374b-e570-4884-9441-33c0ccae5431/959d0f3c-d044-46db-bc43-cbca0284a92d/NBCU_logo.png', 'https://cdn.cookielaw.org/logos/static/powered_by_logo.svg']}}]}
