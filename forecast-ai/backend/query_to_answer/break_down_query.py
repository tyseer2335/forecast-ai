from typing import List
from model.forecast_request import ForecastRequest
from utils.process_date import convert_str_to_datetime
import datetime


def generate_search_queries(client: any, metric_eval_ranking: ForecastRequest) -> dict:
    # variables
    question = metric_eval_ranking.question

    num_queries = metric_eval_ranking.num_queries
    # {'automatic': 0.6, 'x.com': 0.2, 'facebook.com': 0.2}
    perc_of_each_source = metric_eval_ranking.perc_of_each_source
    # before_ranking_num_articles = metric_eval_ranking.before_ranking_num_articles
    # after_ranking_num_articles = metric_eval_ranking.after_ranking_num_articles

    # start_date = convert_str_to_datetime(metric_eval_ranking.start_date)
    # end_date = convert_str_to_datetime(metric_eval_ranking.end_date)

    num_of_queries_per_source = {source: int(num_queries * perc) for source, perc in perc_of_each_source.items()}
    num_of_queries_per_automatic = num_of_queries_per_source.pop('automatic')

    prompt = f"""
        You are an AI that is superhuman at forecasting and helps humans make predictions of future world events. 
        You are being monitored for your calibration, scored by the Brier score.
        I will provide you with a search engine to query related sources to make predictions.
        Write breadth Google search queries to search online for objective information for the following \
forecasting question: `{question}`.

        RULES:
        0. Your knowledge cutoff is October 2023. The current date is {datetime.datetime.now().strftime('%B %d, %Y')}.
        1. Please only return a list of exactly {num_queries} search engine queries. No extra descriptions!
        2. Your queries should include both news (prefix with "News") and opinions (prefix with "Opinion") keywords.
        3. Return the search engine queries in a numbered list starting from 1.
        """

    # make dynamic prompt based on sources
    for source, num in num_of_queries_per_source.items():
        prompt += f"\nGenerate {num} queries based on the forecast question, used to search for news from {source}."
    prompt += f"\nGenerate {num_of_queries_per_automatic} queries based on the forecast question used for general news."

    schema = {
        "type": "object",
        "properties": {
            "queries": {
                "type": "array",
                "items": {"type": "string"}
            }
        },
        "required": ["queries"]
    }
    # explaination of schema
    # The schema is a JSON object that defines the structure of the structured output that the model should return.
    # In this case, the schema specifies that the model should return an object with a single property called "queries",
    # which should be an array of strings. The "queries" property is required, which means that the model must
    # return this property in its output
    #

    # Send the prompt to the model using structured outputs
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        functions=[{"name": "generate_search_queries", "parameters": schema}],
        function_call={"name": "generate_search_queries"}  # This forces the model to return structured data.
    ).to_dict()["choices"][0]["message"]["function_call"]["arguments"]

    # Convert string to dict. response is currently a string of a dict.
    response = eval(response)["queries"]

    # Example:
    # response = ['2024 US election edge site:x.com',
    #  '2024 US election edge site:facebook.com',
    #  '2024 US election predictions',
    #  'Who is leading the 2024 US election',
    #  '2024 US election analysis opinions']

    # Initialize a dictionary to hold queries grouped by source
    search_queries_by_source = {source: [] for source in perc_of_each_source}
    search_queries_by_source["automatic"] = []

    # Distribute the queries into their respective sources
    query_index = 0
    for source, num in num_of_queries_per_source.items():
        search_queries_by_source[source].extend(response[query_index: query_index + num])
        query_index += num

    # Handle automatic queries
    search_queries_by_source["automatic"].extend(response[query_index: query_index + num_of_queries_per_automatic])

    # example:
    # {'automatic': ['2024 US election predictions',
    #                'Who is leading the 2024 US election',
    #                '2024 US election analysis opinions'],
    #  'x.com': ['2024 US election edge site:x.com'],
    #  'facebook.com': ['2024 US election edge site:facebook.com']}

    # lastly, for non-automatic keys, ensure the ":{key}" is present in the query, if not, delete the query, if so,
    # remove :{key} from the query
    for source, queries in search_queries_by_source.items():
        if source == "automatic":
            continue
        for i in range(len(queries)):
            if f" site:{source}" not in queries[i]:
                del queries[i]
            else:
                queries[i] = queries[i].replace(f" site:{source}", "")

    # Edge case:

    # {'automatic': ['2024 US election predictions',
    #   'Who is leading the 2024 US election',
    #   '2024 US election analysis opinions'],
    #  'x.com': [],
    #  'facebook.com': []}

    # Good example:
    # {'automatic': ['2024 US election predictions',
    #   'Who is leading the 2024 US election',
    #   '2024 US election analysis opinions'],
    #  'x.com': ['2024 US election edge'],
    #  'facebook.com': ['2024 US election edge']}

    success = False
    # check automatic and non-automatic queries count
    if len(search_queries_by_source["automatic"]) == num_of_queries_per_automatic and \
            all(len(queries) == num_of_queries_per_source[source] for source, queries in
                search_queries_by_source.items() if source != "automatic"):
        success = True

    return {"queries": search_queries_by_source, "success": success}
