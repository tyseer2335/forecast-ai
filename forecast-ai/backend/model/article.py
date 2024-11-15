class Article:
    """
    Represents an article with metadata and content information.

    Attributes:
        query (str): The search query used to retrieve the article.
        platform (str): The platform where the article was found (e.g., 'X', 'LinkedIn').
        title (str): The title of the article.
        description (str): A short description or summary of the article.
        published_date (str): The date when the article was published.
        url (str): The URL link to the article.
        publisher (dict[str, str]): Information about the publisher, with keys:
            - 'href': A URL link to the publisher's site.
            - 'title': The name of the publisher.
        content (dict[str, str]): The main content of the article, with keys:
            - 'text': The textual content of the article.
            - 'media': A list of media items (e.g., images, videos) associated with the article.
        score (Optional[float]): A score assigned to the article for ranking or relevance purposes. Defaults to None.
    """

    def __init__(self, query: str, platform: str, title: str, description: str, published_date: str, url: str,
                 publisher: dict[str, str], content: dict[str, str]):
        query: str
        platform: str
        title: str
        description: str
        published_date: str
        url: str
        publisher: dict[str, str]  # 'publisher': {'href': 'https://x.com', 'title': 'X'},
        content: dict[str, str]  # 'content': {'text': '', 'media': []}},

        self.query = query
        self.platform = platform

        self.title = title
        self.description = description
        self.published_date = published_date
        self.url = url
        self.publisher = publisher
        self.content = content
        self.score = None
