Meeting Title

        Partner Meeting	

Meeting Date

    Saturday Sep 28, 2024 ⋅ 1:30pm – 2pm (Eastern Time - Toronto)

Location

    Discord

Attendance


    Sheldon Huang - partner


    Yuchen Wang - partner


    Yehyun Lee - team coordinator


    Ho Kwan Edison Liem


    Aditya Ohri


    Muaj Ahmed


    Irene Kang


## Agenda / Meeting Overview
1. [Auth](#auth)
2. [Backend](#backend)
3. [Search/News API and Metrics API](#searchnews-api-and-metrics-api)
4. [Design](#design)



# Notes

## Updates

### Auth
1. Google Auth → Completed
2. Email & Password → Completed

### Setting the Infrastructure
- **ForecastAI** will be the public website, plan to deploy and develop at the same time.
- **Backend**: FastAPI setup completed.
- Stuck with how to do the data gathering.

### Search Engines
- **Twitter API**: Expensive.
- **Google API**: (Free) Checked that we can use this API to gather content.
  - Use API to directly save the content article.
- **News articles**: Use the link and the title and scrape it ourselves.
- **Perplexity API**: We need to pay ($5/month).
- **GPT API**: Doesn’t support browsing APIs yet; cannot make use of it.

### News
- **NewsCatcher**: Completely free.
- **NewsData**: 12 hours of articles delay (200 articles per day).
- **NewsAPI**: 24 hours of articles delay (100 articles per day).
- **GNews**: Plan to explore in the future after reviewing data gathering methodologies.

### Design Updates
- Short Figma demo; we will develop further.

## Metrics
- Cosine similarity, BLEU, and Rouge scores.
- NLP metrics before LLM emerged.
- Yuchen has tested the performance with these three metrics.

### Extract Search Query from User Input
- Example: "2024, Trump, Election."
- How to determine useful news:
  - Calculating metrics between the news title and search query.
  - Most basic way to do so.
  - The basic three (Cosine, BLEU, Rouge) – exists open source help.

### Post-ChatGPT: Black Box Evaluation
- May combine both approaches – Yuchen’s suggestion to aggregate together.
- How? Numeric scores and mediums:
  - Top 5 + Top 5.
  - Rate relevance by other methods.

### Date Filter
- Partner wants a feature to only filter by dates – to backtest with past events without looking at news after the actual event occurrence.
- **New LLM**: Cutoff.

### Clarifications
- Relevance score is for data collection only, not for each article fed to LLM.
- Scores with thresholds:
  - Partner wants the scores to be kept.
  - Compare text and embeddings (retrieval problem):
    - Context Rule RAG: Boosting the retrieval.  
      [AI-Powered Search: Embedding-Based Retrieval and Retrieval-Augmented Generation (RAG)](https://dtunkelang.medium.com/ai-powered-search-embedding-based-retrieval-and-retrieval-augmented-generation-rag-cabeaba26a8b)
  - Partner wants the cutoff date feature implemented in Figma.

## Others
- Moving forward, meetings will be at **1:30 PM on Saturdays**.
