# Given URL, scape the content and return the following:
# Text: The main text content of the page
# Media: A list of media files (images, videos, etc.) on the page
import requests
from bs4 import BeautifulSoup
import html2text
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By


def _single_scrape_content(url: str) -> dict:
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


options = Options()
options.headless = True
driver = webdriver.Chrome(options=options)


def advanced_selenium_scrape_content(url: str) -> dict:
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


def multiple_scrape_content(urls: dict) -> dict:
    # Add 'content' key to each news
    for _, news in urls.items():
        for article in news:
            article['content'] = _single_scrape_content(article['url'])
    for _, news in urls.items():
        for article in news:
            if not article['content']['text']:
                res = advanced_selenium_scrape_content(article['url'])
                article['content']['text'] = res['text']
                if not article['content']['media']:
                    article['content']['media'] = res['media']
    driver.quit()
    return urls
