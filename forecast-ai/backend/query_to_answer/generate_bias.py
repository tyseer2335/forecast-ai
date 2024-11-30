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

#
# def analyze_features(rationale: str, client: OpenAI) -> Dict[str, np.ndarray]:
#     tokens = rationale.strip().split()
#     token_count = len(tokens)
#     results = {}
#     features = list(FEATURE_DESCRIPTIONS.keys())
#
#     for feature in features:
#         # Add token enumeration to prompt
#         tokens_enum = "\n".join([f"{i}: {token}" for i, token in enumerate(tokens)])
#         prompt = f"{get_feature_prompt(feature, tokens, token_count)}\n\nTokens to score:\n{tokens_enum}\n\nProvide exactly {token_count} scores."
#
#         response = client.chat.completions.create(
#             model="gpt-4o-mini",
#             messages=[{"role": "user", "content": prompt}],
#             functions=[get_analyze_function(token_count, feature)],
#             function_call={"name": f"score_{feature}"}
#         )
#
#         try:
#             function_args = json.loads(response.choices[0].message.function_call.arguments)
#             scores = function_args["scores"]
#
#             # Handle length mismatch
#             if len(scores) < token_count:
#                 scores.extend([0.0] * (token_count - len(scores)))  # For missing scores, fill with 0
#             elif len(scores) > token_count:
#                 scores = scores[:token_count]  # For extra scores, truncate to token count
#
#             feature_scores = np.array(scores)
#
#         except (json.JSONDecodeError, KeyError, AttributeError) as e:
#             print(f"Error processing {feature} scores: {e}")
#             feature_scores = np.zeros(token_count)
#
#         results[feature] = feature_scores
#
#     return results





def analyze_features(rationale: str, client: OpenAI) -> Dict[str, np.ndarray]:
    tokens = rationale.strip().split()
    token_count = len(tokens)
    results = {}
    features = list(FEATURE_DESCRIPTIONS.keys())

    for feature in features:
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

            if len(scores) < token_count:
                # Get missing scores
                missing_scores = get_missing_scores(tokens, len(scores), feature, client)
                scores.extend(missing_scores)
            elif len(scores) > token_count:
                scores = scores[:token_count]

            feature_scores = np.array(scores)

        except (json.JSONDecodeError, KeyError, AttributeError) as e:
            print(f"Error processing {feature} scores: {e}")
            feature_scores = np.zeros(token_count)

        results[feature] = feature_scores

    return results


def get_missing_scores(tokens: List[str], start_idx: int, feature: str, client: OpenAI) -> List[float]:
    """Request scores for missing tokens"""
    missing_tokens = tokens[start_idx:]
    tokens_enum = "\n".join([f"{i + start_idx}: {token}" for i, token in enumerate(missing_tokens)])

    prompt = f"{get_feature_prompt(feature, missing_tokens, len(missing_tokens))}\n\nScore these remaining tokens:\n{tokens_enum}"

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        functions=[get_analyze_function(len(missing_tokens), feature)],
        function_call={"name": f"score_{feature}"}
    )

    try:
        function_args = json.loads(response.choices[0].message.function_call.arguments)
        return function_args["scores"]
    except (json.JSONDecodeError, KeyError, AttributeError):
        return [0.0] * len(missing_tokens)


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
