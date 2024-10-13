
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
- If the text content is an error message about JavaScript, paywall, cookies or other technical issues, output a score of 1.

Your response should look like the following:
Thoughts: {{ insert your thinking }}
Rating: {{ insert your rating }}"""

def get_relevance_score(articles: dict[str, Article], forecasting_question: str, client: any):
    # get relevance score for each article wrt original forecasting question using LLM
    for key in article.keys():
        for article in articles[key]:
            article_text = "\n---\nTitle: {title}\n\n{text}\n---\n".format(title=article.title, text=article.summary)
            prompt = relevance_prompt.format(question=forecasting_question, article=article_text)
            response = client.chat.completions.create(
            model="gpt-4o-mini", 
            messages=[{ "role": "user", "content": prompt }]
            )
            loc = response.choices[0].message.split("Rating:")
            rating = loc[1].split()[0]
            if rating.isnumeric():
                article.score = float(rating)
            else:
                article.score = 1.0 # for not numeric (invalid) rating


def sort_and_filter(articles: dict[str, Article], n: int, percentage_per_source: dict[str, float]) -> dict[str, Article]:
    # return N most relevant articles
    filtered_articles = {}
    for source in articles.keys():
        sorted_articles = sorted(articles[source], key=lambda article: article.score, reverse=True)
        num_articles = n * percentage_per_source[source]
        filtered_articles[source] = sorted_articles[:num_articles]
    return filtered_articles