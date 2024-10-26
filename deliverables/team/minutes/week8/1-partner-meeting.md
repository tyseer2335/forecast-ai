Meeting Title

    Partner Meeting	

Meeting Date

    Saturday Oct 26, 2024 ⋅ 1:30pm - 2:20pm (Eastern Time - Toronto)

Location

    Discord

Attendance

    Meeting not mandatory


    Sheldon Huang - partner


    Yuchen Wang - partner


    Yehyun Lee - team coordinator


    Ho Kwan Edison Liem


    Irene Kang


## Agenda / Meeting Overview
1. D3 User Stories
2. Render, Selenium, Docker Updates → Working production
3. Real-time Backend Status with Socket → Not working in prod yet


---

# Meeting Notes

## D3 User Stories
### Tasks:
* **(Top Priority)** Enable selenium on Render via Docker
* **(Other Major Features)**
    * Heatmap (User Story 4)
    * Improve speed of Gnews and Selenium
    * Forecasting Answer & Bias: get question and news data and generate answer
* **(Others)**
    * User Story 3 (visualizations & metrics)
        * Copied from [D1 Doc](/deliverables/D1/planning.md)
            * *User Story 3: As a forecast researcher, I want to be able to** see the quantified reasoning and bias of the data sources** when the relevant query is given in a **visually appealing **manner in order to save time by streamlining the data exploration.*
    * User Story 6 (chat sharing)
    * Auth verification in the backend
    * 2 New ideas we pitched: Pre-indexing and showing backend process
### Task Assignment:
* Edison = Heatmap
* Muaj & Tyseer = Optimization( Improving speed)
* Irene & Jasjot = Need further discussion
## (Completed Task) Run selenium in Docker on Render
* Explanations on why it took longer to implement than expected:
    * Issue 1:
        * 2 ways of Docker on Render
            * Render Blueprint
            * Pushing image to Docker Hub
        * The first solution is a paid feature, so we switched to the second solution
    * Issue 2:
        * Linux Chrome version != Chrome driver issue
        * The latest version is only supported, needed to download
## (Completed Task) Show backend processing status in the frontend while waiting for a response
* Status includes:
    * Generating search queries…
    * Collecting news…
    * Scraping content…
    * Converting news objects to articles…
    * Filtering and scoring relevance…
    * Ranking news articles…
    * Generating forecast answer…
    * Process complete.
* Demo on Local (not yet working on prod)
    * Will update the message design later (currently at the bottom of the screen – below the prompt bar)
    * Real-time backend status is displayed as expected!

## Partner's Comments
* Yuchen’s Suggestion on Deployment:
    * Change the frequency of the deployment as needed
* Sheldon’s Comments:
    * Let the partner know about the required budgets of APIs as the team progresses! 
    * Please keep data confidential

