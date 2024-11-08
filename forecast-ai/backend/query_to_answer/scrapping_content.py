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


def _single_scrape_content(url: str) -> dict:
    # response = requests.get(url)
    # soup = BeautifulSoup(response.content, 'html.parser')
    #
    # cleaner = html2text.HTML2Text()
    # cleaner.ignore_links = True
    # cleaner.ignore_images = True
    # clean_text = cleaner.handle(str(soup))
    #
    # # Extract text content from common tags
    # text_elements = soup.find_all(['p', 'h1', 'h2', 'h3', 'span', 'div'])
    # clean_text = ' '.join([elem.get_text(strip=True) for elem in text_elements])
    #
    # # Extract media content
    # media = [img['src'] for img in soup.find_all('img')]
    #
    # return {
    #     'text': clean_text,
    #     'media': media
    # }
    return {
        'text': '',
        'media': []
    }


def init_driver(LOCAL_OR_PROD: str) -> webdriver.Chrome:
    options = Options()
    if LOCAL_OR_PROD == 'prod':
        options.add_argument('--headless')
        options.add_argument('--no-sandbox')
        options.add_argument('--disable-dev-shm-usage')
        options.binary_location = '/usr/bin/google-chrome'
    driver = webdriver.Chrome(options=options)
    return driver


def advanced_selenium_scrape_content(driver: webdriver.Chrome, url: str) -> dict:
    driver.get(url)
    # once we get redirected to the page, we need to wait for the page to load
    # wait till news.google.com is not in the url
    while 'news.google.com' in driver.current_url:
        pass

    # Extract text content
    clean_text = driver.find_element(By.TAG_NAME, 'body').text

    # Extract media content
    media = [img.get_attribute('src') for img in driver.find_elements(By.TAG_NAME, 'img')]
    # clean media: remove None and any text, only links
    media = [link for link in media if link]

    return {
        'text': clean_text,
        'media': media
    }


def scrape_content_process(url, env):
    driver = init_driver(env)
    try:
        res = advanced_selenium_scrape_content(driver, url)
    except Exception as e:
        print(f"Error scraping content: {str(e)} for url: {url}")
        res = {'text': '', 'media': []}
    driver.quit()
    return res



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
#                         'url': 'https://x.com/elonmusk/status/1853260913690005634',
#                         'publisher': '...',
#                         'content': {'text': '...', 'media': ['...']}}]
#             }
#     print(multiple_scrape_content(urls, env))
