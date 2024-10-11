# Given URL, scape the content and return the following:
# Text: The main text content of the page
# Media: A list of media files (images, videos, etc.) on the page
import requests
from bs4 import BeautifulSoup
import html2text


def _single_scrape_content(url: str) -> dict:
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')

    cleaner = html2text.HTML2Text()
    cleaner.ignore_links = True
    cleaner.ignore_images = True
    clean_text = cleaner.handle(str(soup))

    # Extract text content from common tags
    text_elements = soup.find_all(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'ol', 'ul', 'blockquote', 'a', 'b', 'i', 'strong', 'em', 'mark', 'small', 'del', 'ins', 'sub', 'sup', 'code', 'pre', 'abbr', 'address', 'bdo', 'br', 'cite', 'dfn', 'kbd', 'q', 'samp', 'var', 'time', 'ruby', 'rt', 'rp', 'bdi', 'wbr', 'span', 'div'])
    clean_text = ' '.join([elem.get_text(strip=True) for elem in text_elements])

    # Extract media content
    media = [img['src'] for img in soup.find_all('img')]

    return {
        'text': clean_text,
        'media': media
    }


def multiple_scrape_content(urls: dict) -> dict:
    # Add 'content' key to each news
    for _, news in urls.items():
        for article in news:
            article['content'] = _single_scrape_content(article['url'])
    return urls
