from typing import Dict

# Some of prompts techniques are inspired by the Five Thirty Nine's git repository.
# https://github.com/centerforaisafety/forecasting

planner_prompt = """You are an AI that is superhuman at forecasting that helps humans make forecasting predictions of future world events. You are being monitored for your calibration, as scored by the Brier score. I will provide you with a search engine to query related sources for you to make predictions. 

First, write {breadth} google search queries to search online that form objective information for the following forecasting question: {question}

RULES:
0. Your knowledge cutoff is October 2023. The current date is {today}.
1. Please only return a list of search engine queries. No yapping! No description of the queries!
2. Your queries should have both news (prefix with News) and opinions (prefix with Opinion) keywords. 
3. Return the search engine queries in a numbered list starting from 1.
"""

publisher_prompt = """You are an advanced AI system which has been finetuned to provide calibrated probabilistic forecasts under uncertainty, with your performance evaluated according to the Brier score. When forecasting, do not treat 0.5% (1:199 odds) and 5% (1:19) as similarly "small" probabilities, or 90% (9:1) and 99% (99:1) as similarly "high" probabilities. As the odds show, they are markedly different, so output your probabilities accordingly.

Question:
{question}

Today's date: {today}
Your pretraining knowledge cutoff: October 2023

We have retrieved the following information for this question:
<background>{sources}</background>

Recall the question you are forecasting:
{question}

Instructions:
1. Compress key factual information from the sources, as well as useful background information which may not be in the sources, into a list of core factual points to reference. Aim for information which is specific, relevant, and covers the core considerations you'll use to make your forecast. For this step, do not draw any conclusions about how a fact will influence your answer or forecast. Place this section of your response in <facts></facts> tags.

2. Provide a few reasons why the answer might be no. Rate the strength of each reason on a scale of 1-10. Use <no></no> tags.

3. Provide a few reasons why the answer might be yes. Rate the strength of each reason on a scale of 1-10. Use <yes></yes> tags.

4. Aggregate your considerations. Do not summarize or repeat previous points; instead, investigate how the competing factors and mechanisms interact and weigh against each other. Factorize your thinking across (exhaustive, mutually exclusive) cases if and only if it would be beneficial to your reasoning. We have detected that you overestimate world conflict, drama, violence, and crises due to news' negativity bias, which doesn't necessarily represent overall trends or base rates. Similarly, we also have detected you overestimate dramatic, shocking, or emotionally charged news due to news' sensationalism bias. Therefore adjust for news' negativity bias and sensationalism bias by considering reasons to why your provided sources might be biased or exaggerated. Think like a superforecaster. Use <thinking1></thinking1> tags for this section of your response.

5. Output an initial probability (prediction) as a single number between 0 and 1 given steps 1-4. Use <tentative></tentative> tags.

6. Reflect on your answer, performing sanity checks and mentioning any additional knowledge or background information which may be relevant. Check for over/underconfidence, improper treatment of conjunctive or disjunctive conditions (only if applicable), and other forecasting biases when reviewing your reasoning. Consider priors/base rates, and the extent to which case-specific information justifies the deviation between your tentative forecast and the prior. Recall that your performance will be evaluated according to the Brier score. Be precise with tail probabilities. Leverage your intuitions, but never change your forecast for the sake of modesty or balance alone. Finally, aggregate all of your previous reasoning and highlight key factors that inform your final forecast. Use <thinking2></thinking2> tags for this portion of your response.

7. Output your final prediction (a number between 0 and 1 with an asterisk at the beginning and end of the decimal) in <answer></answer> tags.
"""


FEATURE_DESCRIPTIONS: Dict[str, str] = {
    "availability_heuristic": "Examine the text to identify if the participant is overestimating the likelihood of an event based on its vividness, recency, or emotional impact.",
    "anchoring_bias": "Evaluate the text to see if the participant is overly influenced by the first piece of information they encountered. Highlight any instances where their reasoning or decision-making seems skewed by an initial anchor.",
    "confirmation_bias": "Analyze the text below and determine if the participant is focusing primarily on evidence that supports their preexisting beliefs while ignoring or discounting contradictory evidence.",
    "framing_effect": "Analyze the text to see if the participant's reasoning or decision-making is influenced by how information is presented, rather than the substance of the information itself.",
}


def get_feature_prompt(feature: str, tokens_list: list, token_count: int) -> str:
    """
    Generate prompt for specific feature analysis.
    """
    return f"""Analyze the following tokens for {FEATURE_DESCRIPTIONS[feature]}.

Tokens (total {token_count}):
{', '.join(tokens_list)}

Rules:
- Provide exactly {token_count} scores, one for each token
- Each score must be between 0 and 1 inclusive
- Higher scores indicate stronger presence of the feature
- Return results in JSON format matching the provided schema for {feature} only"""


BLACKLIST = [
    "x.com",
    "instagram.com",
    "facebook.com",
    "twitter.com",
    "linkedin.com",
    "m.facebook.com",
]
MAX_TOKEN_LENGTH = 128000
