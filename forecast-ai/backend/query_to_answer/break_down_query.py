from typing import List

def generate_search_queries(client: any, question: str, num_queries: int) -> List[str]:
    prompt = f"Break down the following forecast question into {num_queries} key search queries: {question}"
    response = client.chat.completions.create(
        model="gpt-4o-mini", 
        messages=[{ "role": "user", "content": prompt }]
    )
    return [query.strip() for query in response.choices[0].message.split('\n') if query.strip()]