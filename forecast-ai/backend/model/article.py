class Article:

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
