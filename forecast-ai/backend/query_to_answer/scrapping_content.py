# Given URL, scape the content and return the following:
# Text: The main text content of the page
# Media: A list of media files (images, videos, etc.) on the page
import requests
from bs4 import BeautifulSoup
import html2text


def scrape_content(url: str) -> dict:
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
        'Text': clean_text,
        'Media': media
    }
