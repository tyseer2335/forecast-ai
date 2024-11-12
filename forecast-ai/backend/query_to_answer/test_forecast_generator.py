import asyncio
from datetime import datetime
from model.forecast_request import ForecastRequest
from model.article import Article

# Import your updated generate_forecast.py
from query_to_answer.mock_generate_forecast import ForecastGenerator


def create_mock_article(query: str, platform: str, title: str, content_text: str) -> Article:
    """Helper function to create mock articles"""
    return Article(
        query=query,
        platform=platform,
        title=title,
        description=f"Description for {title}",
        published_date=datetime.now().strftime("%Y-%m-%d"),
        url=f"https://{platform}/article123",
        publisher={'href': f'https://{platform}', 'title': platform.title()},
        content={'text': content_text, 'media': []}
    )


def create_mock_news_data():
    """Create mock news data for testing"""
    return {
        'x.com': [
            create_mock_article(
                query="News Ukraine conflict",
                platform="x.com",
                title="Latest developments in Ukraine",
                content_text="Recent reports indicate significant developments in the ongoing situation..."
            )
        ],
        'facebook.com': [
            create_mock_article(
                query="Opinion Ukraine peace prospects",
                platform="facebook.com",
                title="Analysis: Peace Prospects in Ukraine",
                content_text="Experts analyze the potential for peaceful resolution..."
            )
        ],
        'automatic': [
            create_mock_article(
                query="News Ukraine military capabilities",
                platform="reuters.com",
                title="Assessment of Military Capabilities",
                content_text="A detailed analysis of current military capabilities shows..."
            ),
            create_mock_article(
                query="Opinion international support Ukraine",
                platform="bbc.com",
                title="International Support for Ukraine",
                content_text="Global community continues to provide support..."
            ),
            create_mock_article(
                query="News humanitarian situation Ukraine",
                platform="apnews.com",
                title="Humanitarian Situation Report",
                content_text="Current humanitarian conditions in affected regions..."
            )
        ]
    }


async def test_simple():
    """Simple test with minimal data"""
    print("\nRunning simple test...")

    # Create a basic forecast request
    request = ForecastRequest(
        question="Will Ukraine regain control of Crimea by the end of 2024?",
        num_queries=3
    )

    # Create minimal test data
    news = {
        'automatic': [
            create_mock_article(
                query="News Ukraine Crimea",
                platform="reuters.com",
                title="Latest on Crimea Situation",
                content_text="Recent developments regarding Crimea indicate..."
            )
        ]
    }

    # Initialize generator and get forecast
    generator = ForecastGenerator()
    result = await generator.generate_forecast(request, news)

    # Print results
    print(f"\nQuestion: {request.question}")
    print(f"Forecast: {result['answer']['Forecast']}")
    print(f"Rationale: {result['answer']['Forecaster Rationale'][:200]}...")  # Truncated for readability
    print("\nSources:")
    for source, articles in result['answer']['Sources'].items():
        print(f"\n{source}:")
        for article in articles:
            print(f"- {article['title']}")


async def test_comprehensive():
    """Comprehensive test with full mock data"""
    print("\nRunning comprehensive test...")

    # Create a detailed forecast request
    request = ForecastRequest(
        question="Will Ukraine regain control of Crimea by the end of 2024?",
        num_queries=5,
        perc_of_each_source={'automatic': 0.6, 'x.com': 0.2, 'facebook.com': 0.2},
        before_ranking_num_articles=10,
        after_ranking_num_articles=5,
        start_date="2024-01-01",
        end_date="2024-12-31"
    )

    # Get mock news data
    news = create_mock_news_data()

    # Initialize generator and get forecast
    generator = ForecastGenerator()
    result = await generator.generate_forecast(request, news)

    # Print detailed results
    print(f"\nQuestion: {request.question}")
    print(f"Forecast: {result['answer']['Forecast']}")
    print("\nRationale Summary:")
    rationale = result['answer']['Forecaster Rationale']
    print(f"{rationale[:300]}...")  # Truncated for readability

    print("\nSources by Platform:")
    for platform, articles in result['answer']['Sources'].items():
        print(f"\n{platform}:")
        for article in articles:
            print(f"- {article['title']} ({article['published_date']})")
            print(f"  URL: {article['url']}")


async def main():
    """Run all tests"""
    print("Starting forecast generator tests...")

    try:
        await test_simple()
        print("\n" + "=" * 50)
        await test_comprehensive()

    except Exception as e:
        print(f"Error during testing: {str(e)}")
        raise

    print("\nTests completed!")


if __name__ == "__main__":
    asyncio.run(main())