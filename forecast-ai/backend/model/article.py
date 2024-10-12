class Article:
    
    def __init__(self, title, description, fulltext, source, media):
        self.title = title
        self.description = description
        self.fulltext = fulltext
        self.source = source
        self.media = media
        self.score = None
    
    def to_json():
        return