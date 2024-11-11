import json
from datetime import datetime
from typing import List, Dict
import os
from dotenv import load_dotenv
from model.forecast_request import ForecastRequest
from model.article import Article
from openai import OpenAI
from prompt import planner_prompt, publisher_prompt

# Import your LLM client/wrapper here
# from your_llm_module import LLMClient


class ForecastGenerator:
    def __init__(self, client: any, model: str = "gpt-4"):
        # Initialize LLM client
        self.model = model
        self.client = client

        # Load prompts
        self.planner_prompt = planner_prompt
        self.publisher_prompt = publisher_prompt

        self.GOOGLE_SEARCH_DATE_FORMAT = "%Y-%m-%d"

    def format_articles_for_llm(self, articles: Dict[str, List[Article]]) -> str:
        """Format articles into a string format suitable for the LLM prompt"""
        formatted_results = []
        id_counter = 1

        for source, article_list in articles.items():
            for article in article_list:
                content = f"""ID: {id_counter}
Query: {article.query}
Title: {article.title}
Date: {article.published_date}
Source: {source}
Content:
[start content]{article.content.get('text', '')}
[end content]"""
                formatted_results.append(content)
                id_counter += 1

        return "\n\n----\n\n".join(formatted_results)

    def extract_prediction(self, response: str) -> float:
        """Extract the final prediction from the LLM response"""
        import re
        # Look for the prediction between <answer> tags
        answer_match = re.search(r'<answer>\s*\*([0-9.]+)\*\s*</answer>', response)
        if answer_match:
            return float(answer_match.group(1))
        return None

    def extract_rationale(self, response: str) -> str:
        """Extract the rationale from the LLM response"""
        import re
        # Combine facts, reasons, and thinking sections
        sections = []

        facts_match = re.search(r'<facts>(.*?)</facts>', response, re.DOTALL)
        if facts_match:
            sections.append("Key Facts:\n" + facts_match.group(1).strip())

        no_match = re.search(r'<no>(.*?)</no>', response, re.DOTALL)
        if no_match:
            sections.append("Reasons Against:\n" + no_match.group(1).strip())

        yes_match = re.search(r'<yes>(.*?)</yes>', response, re.DOTALL)
        if yes_match:
            sections.append("Reasons For:\n" + yes_match.group(1).strip())

        thinking_matches = re.findall(r'<thinking>(.*?)</thinking>', response, re.DOTALL)
        if thinking_matches:
            sections.append("Analysis:\n" + "\n".join(thinking_matches))

        return "\n\n".join(sections)

    async def generate_forecast(self, request: ForecastRequest, news: Dict[str, List[Article]]) -> dict:
        """
        Generate forecast based on the news articles collected.

        :param request: The ForecastRequest object
        :param news: The news articles collected per source
        :return: The forecast answer
        """
        # Format the articles for the LLM
        formatted_sources = self.format_articles_for_llm(news)

        # Prepare the publishing prompt
        today_string = datetime.now().strftime(self.GOOGLE_SEARCH_DATE_FORMAT)
        publishing_query = self.publisher_prompt.format(
            sources=formatted_sources,
            today=today_string,
            question=request.question
        )

        # Get LLM response
        # Note: Implementation depends on your LLM client
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": publishing_query}]
        ).to_dict()["choices"][0]["message"]["content"]
        
        #response = "Mock LLM response with <answer>*0.75*</answer>"

        # Extract prediction and rationale
        prediction = self.extract_prediction(response)
        rationale = self.extract_rationale(response)

        # Format the answer
        answer = {
            "Question": request.question,
            "Forecaster ID": "AI-Forecaster",  # You might want to make this configurable
            "Forecaster Rationale": rationale,
            "Forecast": f"{prediction * 100:.1f}%",
            "Sources": {
                source: [
                    {
                        "title": article.title,
                        "url": article.url,
                        "published_date": article.published_date,
                        "platform": article.platform
                    }
                    for article in articles
                ]
                for source, articles in news.items()
            }
        }

        return {
            "answer": answer,
            "raw_response": response  # Including raw response for debugging/logging
        }
