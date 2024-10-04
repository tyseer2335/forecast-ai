from typing import List

def generate_search_queries(client: any, question: str) -> List[str]:
    prompt = f"Break down the following forecast question into 5 key search queries: {question}"
    response = client.chat.completions.create(
        model="gpt-4o-mini", 
        messages=[{ "role": "user", "content": prompt }]
    )
    return [query.strip() for query in response.choices[0].message.split('\n') if query.strip()]