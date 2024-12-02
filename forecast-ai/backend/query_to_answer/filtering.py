from model.article import Article
from query_to_answer.prompt import MAX_TOKEN_LENGTH

relevance_prompt = """Please consider the following forecasting question.
After that, I will give you a news article and ask you to rate its relevance with respect to the forecasting question.

Question:
{question}
Article:
{article}

Please rate the relevance of the article to the question, at the scale of 1-6
1 -- irrelevant
2 -- slightly relevant
3 -- somewhat relevant
4 -- relevant
5 -- highly relevant
6 -- most relevant

Guidelines:
- You don't need to access any external sources. Just consider the information provided.
- Focus on the content of the article, not the title.
- If the text content is almost entirely irrelevant to the question, empty, or \
an error message about JavaScript, paywall, cookies or other technical issues, output a score \
of 1.

Your response should look like the following:
Rating: {{ insert your rating }}"""

# Your response should look like the following:
# Thoughts: {{ insert your thinking }}
# Rating: {{ insert your rating }}"""

# For faster speed, we're removing thoughts.


def truncate_str_to_max_token(text: str, max_token: int = MAX_TOKEN_LENGTH):
    """
    Truncate the string to the maximum token length.

    Args:
        text (str): The text to truncate.
        max_token (int): The maximum token length to truncate the text to.

    Returns:
        str: The truncated text.
    """
    tokens = text.split()
    if len(tokens) > max_token:
        return " ".join(tokens[:max_token])
    return text


def get_relevance_score(
    articles: dict[str, list[Article]], forecasting_question: str, client: any
):
    """
    Assigns a relevance score to each article based on its alignment with a forecasting question.

    Args:
        articles (dict[str, list[Article]]): A dictionary where keys are source names, and values are lists of
            `Article` objects to be evaluated.
        forecasting_question (str): The forecasting question to which the articles' relevance is measured.
        client (any): The client object used for making API requests to an LLM or similar service.

    Modifies:
        Each `Article` object's `score` attribute is set to a relevance score (1 to 6) based on the LLM's assessment,
        with a default score of 1 for invalid ratings.
    """
    # get relevance score for each article wrt original forecasting question using LLM
    for key in articles.keys():
        for article in articles[key]:
            article_text = "\n---\nTitle: {title}\n\n{text}\n---\n".format(
                title=article.title, text=truncate_str_to_max_token(article.content["text"], 128000)
            )
            prompt = relevance_prompt.format(
                question=forecasting_question, article=article_text
            )
            response = client.chat.completions.create(
                model="gpt-4o-mini", messages=[{"role": "user", "content": prompt}]
            ).to_dict()
            loc = response["choices"][0]["message"]["content"].split("Rating:")
            rating = loc[1].split()[0]
            if rating.isnumeric():
                article.score = float(rating)
            else:
                article.score = 1.0  # for not numeric (invalid) rating


def sort_and_filter(
    articles: dict[str, list[Article]], n: int, percentage_per_source: dict[str, float]
) -> dict[str, list[Article]]:
    """
    Filters and sorts articles to return the top N most relevant articles per source.

    Args:
        articles (dict[str, list[Article]]): A dictionary where keys are source names, and values are lists of
            `Article` objects that have been scored for relevance.
        n (int): The total number of top articles to retain across all sources.
        percentage_per_source (dict[str, float]): A dictionary where keys are source names, and values are the
            percentage of the top N articles to keep for each source.

    Returns:
        dict[str, list[Article]]: A dictionary containing the top relevant articles for each source, sorted by score.
            The number of articles per source is determined by `percentage_per_source`.

    Raises:
        Exception: Raises an exception if an error occurs during sorting or filtering.
    """
    # return N most relevant articles
    filtered_articles = {}
    for source in articles.keys():
        try:
            sorted_articles = sorted(
                articles[source], key=lambda article: article.score, reverse=True
            )
            num_articles = n * percentage_per_source[source]
            filtered_articles[source] = sorted_articles[: int(num_articles)]
        except Exception as e:
            raise Exception(f"Error sorting and filtering articles: {str(e)}")

    # Remove sources with score 1
    filtered_articles = {source: articles for source, articles in filtered_articles.items() if articles[0].score != 1.0}
    return filtered_articles
