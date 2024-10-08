Meeting Title

    Partner Meeting	

Meeting Date

    Saturday Oct 5, 2024 ⋅ 6:40pm – 7:15pm (Eastern Time - Toronto)

Location

    Discord

Attendance

    Meeting not mandatory


    Sheldon Huang - partner


    Yuchen Wang - partner


    Yehyun Lee - team coordinator


    Ho Kwan Edison Liem


    Tyseer Toufiq


    Irene Kang


## Agenda / Meeting Overview
1. General Updates
2. D2 Updates
3. Subteam Overview

---

# Meeting Notes

## General Updates
- Worked on D1 review
- Working on D2

## D2 Updates
- Focus on explaining the tasks we’re working on.
- The team is divided into 3 subteams based on user stories with plans to merge efforts later.

## Subteam Overview

### First Team(U1): User Story 1
- Members: Muaj and Irene
- Focus: DB schema, frontend and little bit of backend work for chat history(sidebar, etc.)
- Database schema already setup by Muaj
- Documentation: Good explanations available

### Second Team(U2): User Story 2
- Members: Edison, Yehyun, and Aditya
- Focus: Mainly backend focus and also some frontend components for user prompt
- Tasks
    1. Breaking down the queries into multiple queries (Edison)
    2. Collect sources(news and twitter) (Yehyun)
    3. Evaluation and Ranking (Aditya)
- Some parts that we want to work with the partners’ models: LLMs
    - Forecast themselves(reasonings) and heatmaps
    - But will be revisited next week after implementing the tasks above
- Ongoing Discussion Points:
    - How much news article and twitter data we want to collect for each prompt?
    - Comments from Sheldon:
        - Ideally dynamic
            - Depends on queries (types, political factors, past events, etc.) → So make it dynamic for now
    - For testing, collect 10 articles/tweets in the development environment and later increase to 50
    - It would be helpful if the frontend allows users to specify the number of articles/tweets → will be discussed in Parameters
    - Comments from Yuchen:
        - Clarification: 
            - If the user says 10, then we should collect more than 10. Then, the program needs to use metrics so that narrow them down to 10 to be displayed. It doesn’t mean that we ‘collect’ 10 initially.
            - Why would you want to LLM to decide how many articles to collect?
                - Team’s Thought: To make it more flexible and dynamic
            - Suggestion for Parameters:
                - [1] News to look up in total
                - [2] News to display
                - Same implementations [1] & [2] for the other sources like Twitter
                - Enable/disable Twitter collection (include or no include)
                - How many queries to search
                - Twitter collection ratio (default: 5% of total sources, adjustable by the user):
                    - More explanation: Heuristics of how much twitter to be used for the collection before evaluating(default: 5% from other source), even better if the user can experiment by changing the ratios
            - Other Social Media Data Recommendation
                - More sources - better accuracy
                - Not concerned with fake data for now → so gather more sources!
                - Examples from Yehyun: Instagram, Reddit, Facebook, …, etc.
                - Provide more flexibility for the user with customizable parameters discussed above!

### Third Team(U3): User Story 6
- Members: Tyseer and Jasjot
- Focus:
    - Chat-sharing features + Frontend design based on the Figma prototype 
    - User Story 6 for ref:
        - User Story 6: As a researcher, I want to send the results that the AI agent sent me and share my findings with others. I want them to be able to click a link and view the entire chat history.
- Tasks
    - Dependency: This team’s work depends on U1’s completion
    - Once User story 1 (U1) is complete, the team will implement sharable (public) links for the chat has done their work, they will be working on the sharable(public) link sharing for the chat
    - Now, waiting for U1 to be done asap because this team’s work is dependent on U1
- Branch Naming Convention Update
    - D2-14.1<TEAM NUMBER = 14.SUBTEAM = 1, 2, or 3>/…
- Summary of Parameters to be added to the frontend & backend: (From Yuchen’s discord message:)
    - The number of queries to generate from the forecasting question
    - The number of articles to collect and rank in total
    - The number of articles to use
    - The percentage of each source
    - Some clarifications on the last one



