from typing import List, Dict, Any
from openai import OpenAI
from query_to_answer.prompt import get_feature_prompt, FEATURE_DESCRIPTIONS


def get_feature_schema(token_count: int, feature: str) -> dict:
    """
    Creates a JSON schema for a single feature to enforce exact lengths.
    """
    # Properties for each token score
    score_properties = {
        f"token_{i}": {
            "type": "number",
            "minimum": 0,
            "maximum": 1
        } for i in range(token_count)
    }

    return {
        "type": "object",
        "properties": {
            feature: {
                "type": "object",
                "description": f"Scores for {feature}.",
                "properties": score_properties,
                "required": list(score_properties.keys()),
                "additionalProperties": False
            }
        },
        "required": [feature],
        "additionalProperties": False
    }


def analyze_features(rationale: str, client: OpenAI) -> Dict[str, List[float]]:
    """
    Analyzes rationale text for different reasoning features and returns token-level scores.
    """
    tokens = rationale.strip().split()
    token_count = len(tokens)

    # Initialize results dictionary
    results = {}

    # Analyze each feature separately
    features = list(FEATURE_DESCRIPTIONS.keys())

    for feature in features:
        prompt = get_feature_prompt(feature, tokens, token_count)
        schema = get_feature_schema(token_count, feature)

        response = client.chat.completions.create(
            model="gpt-4-0613",
            messages=[{"role": "user", "content": prompt}],
            functions=[{
                "name": "analyze_features",
                "description": f"Analyze text for {feature}. Must output array with exact length.",
                "parameters": schema
            }],
            function_call={"name": "analyze_features"}
        )

        result = response.choices[0].message.function_call.arguments

        # Parse the JSON string into a Python object
        if isinstance(result, str):
            import json
            result = json.loads(result)

        # Extract just the relevant feature's scores
        feature_scores = result.get(feature, {})
        if len(feature_scores) != token_count:
            print(f"Expected {token_count} scores for {feature}, got {len(feature_scores)} instead.")
            feature_scores = feature_scores[:token_count]

        results[feature] = feature_scores

    return results


def generate_bias(answer: Dict[str, Any], client: OpenAI) -> Dict[str, Any]:
    """
    Generate bias analysis for forecast rationale.
    """
    if not answer.get("Forecaster Rationale"):
        return answer

    features = analyze_features(answer["Forecaster Rationale"], client)
    answer["llm_features"] = features
    print(answer)
    return answer
