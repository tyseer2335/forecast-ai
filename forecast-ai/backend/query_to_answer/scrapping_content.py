# Given URL, scape the content and return the following:
# Text: The main text content of the page
# Media: A list of media files (images, videos, etc.) on the page
import requests
from bs4 import BeautifulSoup
from typing import List


def scrape_content(url: str) -> dict:
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')

    # Extract text content
    text = ' '.join([p.get_text() for p in soup.find_all('p')])

    # Extract media content
    media = []
    for img in soup.find_all('img'):
        media.append(img['src'])

    return {
        'Text': text,
        'Media': media
    }
