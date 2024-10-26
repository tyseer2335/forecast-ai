Meeting Title

    Partner Meeting	

Meeting Date

    Saturday Oct 20th, 2024 ⋅ 1:40 PM - 2:41 PM (Eastern Time - Toronto)

Location

    Discord

Attendance

    Meeting not mandatory


    Sheldon Huang - partner


    Yuchen Wang - partner


    Yehyun Lee - team coordinator


    Tyseer Toufiq


    Irene Kang


## Agenda / Meeting Overview
1. Report/README
2. Live Demo
3. Unit Testing

---

# Meeting Notes

## Report & README:
* Went through the report and readme files on the repository
## Demonstration
### Authentication
* Login – Security concerns addressed
* Email Verification
* Reset Password
### Dynamic Sidebar + ChatWindow
* DB connection
* Server
    * Backend server: Render
        * Serverless
        * Inactive 30 mins → Server’s down
            * Needs some time to load up
            * Error messages show up in this case now
        * Scaling is possible in future updates.
* Parameters in prompt
* Scraping – Using BeautifulSoup for now. 
    * No content scraped yet, but visible on local.
    * Save to DB
* Unit Testings are ready
    * Frontend: npm
    * Backen: python
## Plans
### Last Auth Components
* Authentication cache.
* Backend authentication verification.
### New Ideas
* Asking the partners for these
* Latest trend news pre indexing
    * Sheldon supported the idea, mentioning that common questions are frequently repeated, but their frequency of the questions varies
        * E.g. election
        * Saving frequently asked questions could enhance efficiency.
* Showing backend progress real-time while loading
    * Sheldon and Yuchen supported the idea
    * This would improve user experience by providing visualization as the backend processes data.
### Major Features 
* Fetch view count / trend metric
* Dark Mode
* Chat Sharing → important
* Heatmap
    * Yehyun’s local heatmap design work proposed
* Faster Gnews and scrapping
    * Gnews / Selenium Parallel Run
        * Docker needed
    * Major Delay
        * Gnews
            * Iterations across multiple sources are causing delays.
            * For all source, for each source
                * E.g. 3 sets of iterations in the case with 2 sources
            * Solution is to use threading and multiprocessing
        * Selenium
            * Scraping pages one by one
            * Solution is multiprocessing (as multiprocessing is faster than threading based on Yehyun’s research)
            * Browser concerns
            * Sheldon raised concerns about users potentially running the service from a remote server.
            * **Q**(Partner)**:** Is the bottleneck hardware or API rate limits?
            * **A**(Team)**:** It's hardware-related

                    → Then it should be manageable for current use cases, though future scalability might be a concern as Yehyun mentioned.

* Forecasting-related API Changes or Updates
    * Partner’s Feedback:
        * Keep monitoring 539 codes; their stable implementation can help easily incorporate future changes.
            * Also this enables a complete system, focusing on a more efficient retrieval system.
        * 0, 1, 2 → the current rate does not rate individual token
        * Future possibilities include rating individual tokens in forecasts and introducing a bias score: Quality of the forecast, bias score in the future
        * Partners will provide subsets of example prompts to the team for testing.
        * Another possible future work: Enhance the heatmap feature to not only show the score (0, 1, 2) but also explain the reasons behind it.
## Healthcheck
* Additional advice + partner’s own experiences regarding teamwork & wellbeing