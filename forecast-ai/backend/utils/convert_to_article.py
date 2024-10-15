from model.article import Article


def dict_to_article(article_dict: dict) -> dict:
    """
    Convert dict to Article object
    :param article_dict:

    Example:

{'Who will win the election site:x.com': [{'title': 'Watcher.Guru (@WatcherGuru) on X - X',
   'description': 'Watcher.Guru (@WatcherGuru) on X  X',
   'published date': 'Fri, 11 Oct 2024 22:29:26 GMT',
   'url': 'https://news.google.com/rss/articles/CBMiYkFVX3lxTFBXNE1aeW9tTGpmclhmOTEzTDAxUHQwcUdpekpmZF9DeXJ0NUpJMXRrWDd0UVdvaWs4T2ZzYlJ1dFoyUkRGRWlVeWEzU1Z0NkdmRlZOMWd1RmJHWG1zaTdVc3dn?oc=5&hl=en-CA&gl=CA&ceid=CA:en',
   'publisher': {'href': 'https://x.com', 'title': 'X'},
   'content': {'text': '', 'media': []}},
  {'title': 'Piers Morgan (@piersmorgan) - X',
   'description': 'Piers Morgan (@piersmorgan)  X',
   'published date': 'Thu, 10 Oct 2024 15:33:29 GMT',
   'url': 'https://news.google.com/rss/articles/CBMiPkFVX3lxTE9XbWxYRktNNkl2VW81cHZRb2RPRUMwejFfWWhTM1Z2aFhtU3VJbFduVmhhdFRiTmFzNUg1NVVR?oc=5&hl=en-CA&gl=CA&ceid=CA:en',
   'publisher': {'href': 'https://x.com', 'title': 'X'},
   'content': {'text': '', 'media': []}}],
 'Who will win the election site:facebook.com': [{'title': 'Heather Cox Richardson - Facebook',
   'description': 'Heather Cox Richardson  Facebook',
   'published date': 'Sat, 31 Oct 2015 05:55:51 GMT',
   'url': 'https://news.google.com/rss/articles/CBMiWkFVX3lxTE9vYWdfaVY0NnlDUE5YeDVhOExOZ3p6TVp5SzJEWEpjODYwaHA1Zl94Ull5QjNYYnRERDhaSHUzTnd5b1FLdzVvZVpWbURMWGJpejItN2paVGs1QQ?oc=5&hl=en-CA&gl=CA&ceid=CA:en',
   'publisher': {'href': 'https://www.facebook.com', 'title': 'Facebook'},
   'content': {'text': '', 'media': []}}],
 'Predictions on who will win the election 2024': [{'title': 'Who Is Favored To Win The 2024 Presidential Election? - FiveThirtyEight',
   'description': 'Who Is Favored To Win The 2024 Presidential Election?  FiveThirtyEight',
   'published date': 'Sat, 12 Oct 2024 02:04:16 GMT',
   'url': 'https://news.google.com/rss/articles/CBMibEFVX3lxTE1pX1dYREY4dnpxYUg0NXF0ZEliZ2htM0J5a3ltN2FuVEJIZ1lYOGZYMnE1U1RqSEs2d3J2SktOMjNDeEdsQnNEU0pyeDY1aHR5T3dmYk5CeGg4YURJMUItWkU2dGhWSFhwMHN1SA?oc=5&hl=en-CA&gl=CA&ceid=CA:en',
   'publisher': {'href': 'https://projects.fivethirtyeight.com',
    'title': 'FiveThirtyEight'},
   'content': {'text': '', 'media': []}}]}


   If " site:" don't exist in query, then platform is "automatic"

   We group by platform and have list of Article objects
    :return:
    """
    article_dict = article_dict.copy()
    # in article_dict, replace "published date" to "published_date"
    res = {}
    for query, articles in article_dict.items():
        for article in articles:
            article['query'] = query.split(' site:')[0]
            article['platform'] = 'automatic' if ' site:' not in query else query.split(' site:')[1]
            article['published_date'] = article.pop('published date')
            if article['platform'] not in res:
                res[article['platform']] = [Article(**article)]  # **article is unpacking the dictionary
            else:
                res[article['platform']].append(Article(**article))
    # {'x.com US 2024 election predictions': [<model.article.Article at 0x1f2e4ed7cd0>,
    #   <model.article.Article at 0x1f2e691fcd0>],
    #  'facebook.com US 2024 election forecasts': [<model.article.Article at 0x1f2e6962950>,
    #   <model.article.Article at 0x1f2e6aec750>],
    #  'automatic': [<model.article.Article at 0x1f2e6ae3810>,
    #   <model.article.Article at 0x1f2e6ae3250>,
    #   <model.article.Article at 0x1f2e6a2fe10>]}
    # We only want site name to be key; rename them
    res = {key.split(' ')[0]: value for key, value in res.items()}

    return res
