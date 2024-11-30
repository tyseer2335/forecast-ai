from typing import List, Dict, Any
import json
import numpy as np
from openai import OpenAI
from query_to_answer.prompt import get_feature_prompt, FEATURE_DESCRIPTIONS


def get_analyze_function(token_count: int, feature: str) -> dict:
    """Creates function definition with strict array length enforcement"""
    return {
        "name": f"score_{feature}",
        "description": f"Score exactly {token_count} tokens for {feature}",
        "parameters": {
            "type": "object",
            "properties": {
                "scores": {
                    "type": "array",
                    "items": {
                        "type": "number",
                        "minimum": 0,
                        "maximum": 1
                    },
                    "minItems": token_count,
                    "maxItems": token_count,
                    "description": f"Exactly {token_count} scores between 0 and 1"
                }
            },
            "required": ["scores"]
        }
    }


def analyze_features(rationale: str, client: OpenAI) -> Dict[str, np.ndarray]:
    tokens = rationale.strip().split()
    token_count = len(tokens)
    results = {}
    features = list(FEATURE_DESCRIPTIONS.keys())

    for feature in features:
        # Add token enumeration to prompt
        tokens_enum = "\n".join([f"{i}: {token}" for i, token in enumerate(tokens)])
        prompt = f"{get_feature_prompt(feature, tokens, token_count)}\n\nTokens to score:\n{tokens_enum}\n\nProvide exactly {token_count} scores."

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            functions=[get_analyze_function(token_count, feature)],
            function_call={"name": f"score_{feature}"}
        )

        try:
            function_args = json.loads(response.choices[0].message.function_call.arguments)
            scores = function_args["scores"]

            # Handle length mismatch
            if len(scores) < token_count:
                scores.extend([0.0] * (token_count - len(scores)))  # For missing scores, fill with 0
            elif len(scores) > token_count:
                scores = scores[:token_count]  # For extra scores, truncate to token count

            feature_scores = np.array(scores)

        except (json.JSONDecodeError, KeyError, AttributeError) as e:
            print(f"Error processing {feature} scores: {e}")
            feature_scores = np.zeros(token_count)

        results[feature] = feature_scores

    return results


def summarize_rationale(rationale: str, client: OpenAI) -> str:
        """Summarizes the forecast rationale to 250 words using the LLM"""
        # Define the prompt for summarization
        prompt = f"Please summarize the following rationale to 250 words:\n\n{rationale}"

        # Get the LLM response
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}]
        ).to_dict()["choices"][0]["message"]["content"]

        # Print the summarized content for debugging purposes
        print(f"Summarized Forecast Rationale (250 words):\n{response.strip()}")

        return response.strip()


# def get_feature_schema(token_count: int, feature: str) -> dict:
#     """
#     Creates a JSON schema for scoring a specified feature at the token level.
#
#     Args:
#         token_count (int): The number of tokens in the rationale text.
#         feature (str): The name of the feature to be analyzed (e.g., bias, certainty).
#
#     Returns:
#         dict: A JSON schema that enforces the exact number of scores, from 0 to 1, for each token in the rationale text.
#             The schema is designed to ensure that each token is scored for the specified feature.
#     """
#     # Properties for each token score
#     score_properties = {
#         f"token_{i}": {
#             "type": "number",
#             "minimum": 0,
#             "maximum": 1
#         } for i in range(token_count)
#     }
#
#     return {
#         "type": "object",
#         "properties": {
#             feature: {
#                 "type": "object",
#                 "description": f"Scores for {feature}.",
#                 "properties": score_properties,
#                 "required": list(score_properties.keys()),
#                 "additionalProperties": False
#             }
#         },
#         "required": [feature],
#         "additionalProperties": False
#     }


def get_feature_schema(token_count: int, feature: str) -> dict:
    """Creates a JSON schema for array-based scoring"""
    return {
        "type": "object",
        "properties": {
            feature: {
                "type": "array",
                "items": {
                    "type": "number",
                    "minimum": 0,
                    "maximum": 1
                },
                "minItems": token_count,
                "maxItems": token_count
            }
        },
        "required": [feature],
        "additionalProperties": False
    }


# def analyze_features(rationale: str, client: OpenAI) -> Dict[str, List[float]]:
#     """
#     Analyzes a rationale text to produce token-level scores for multiple reasoning features.
#
#     Args:
#         rationale (str): The rationale text to analyze, where each token will be scored on specific features.
#         client (OpenAI): The OpenAI client used to call a language model to evaluate the rationale text.
#
#     Returns:
#         Dict[str, List[float]]: A dictionary where keys are feature names, and values are lists of token-level scores
#             for each feature. Each token is assigned a score between 0 and 1 for each feature analyzed.
#     """
#     tokens = rationale.strip().split()
#     token_count = len(tokens)
#
#     # Initialize results dictionary
#     results = {}
#
#     # Analyze each feature separately
#     features = list(FEATURE_DESCRIPTIONS.keys())
#
#     for feature in features:
#         prompt = get_feature_prompt(feature, tokens, token_count)
#         schema = get_feature_schema(token_count, feature)
#
#         response = client.chat.completions.create(
#             model="gpt-4o-mini",
#             messages=[{"role": "user", "content": prompt}],
#             functions=[{
#                 "name": "analyze_features",
#                 "description": f"Analyze text for {feature}. Must output array with exact length.",
#                 "parameters": schema
#             }],
#             function_call={"name": "analyze_features"}
#         )
#
#         result = response.choices[0].message.function_call.arguments
#
#         # Parse the JSON string into a Python object
#         if isinstance(result, str):
#             import json
#             result = json.loads(result)
#
#         # Extract just the relevant feature's scores
#         feature_scores = result.get(feature, {})
#         if len(feature_scores) != token_count:
#             print(f"Expected {token_count} scores for {feature}, got {len(feature_scores)} instead.")
#
#         results[feature] = feature_scores
#
#     return results


def array_to_dict_format(feature_arrays: Dict[str, np.ndarray]) -> Dict[str, Dict[str, float]]:
    """Converts array-based features to the original dictionary format"""
    result = {}
    for feature, scores in feature_arrays.items():
        result[feature] = {f"token_{i}": float(score) for i, score in enumerate(scores)}
    return result


def generate_bias(answer: Dict[str, Any], client: OpenAI) -> Dict[str, Any]:
    """
    Generates a bias analysis for a given forecast rationale and appends the results to the answer.

    Args:
        answer (Dict[str, Any]): A dictionary containing the forecast answer details, including "Forecaster Rationale."
        client (OpenAI): The OpenAI client used to analyze the rationale text for feature-specific biases.

    Returns:
        Dict[str, Any]: The input answer dictionary updated with `llm_features`, which contains token-level
            scores for various features (e.g., bias) in the rationale.
    """
    if not answer.get("Forecaster Rationale"):
        return answer

    answer["Forecaster Rationale"] = summarize_rationale(answer["Forecaster Rationale"], client)

    # Get features as arrays
    feature_arrays = analyze_features(answer["Forecaster Rationale"], client)

    # Convert to dictionary format before returning
    answer["llm_features"] = array_to_dict_format(feature_arrays)

    print(answer)
    return answer
