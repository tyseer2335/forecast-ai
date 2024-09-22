Meeting Title

	AI Forecasting System Kickoff Meeting

Meeting Date

    Friday Sep 20, 2024 ⋅ 4pm – 5pm (Eastern Time - Toronto)

Location


    MaRS Discovery District, 101 College St, Toronto, ON M5G 1L7, Canada

Attendance

Everyone with partners in-person; except Jasjot participated online due to illness.


    Sheldon Huang - partner


    Yuchen Wang - partner


    Tyseer Toufiq


    Yehyun Lee - team coordinator


    Jasjot Benipal - online


    Ho Kwan Edison Liem


    Aditya Ohri


    Muaj Ahmed


    Irene Kang



Agenda / Meeting Overview
1. Introduction & Why We’re Interested in AI  
2. Went through document provided by partners:  
   [Google Doc](https://docs.google.com/document/d/1Qr3VVTM0fryBIWYBzLswTyxHEFczidP5hr3ySHnuI7o/edit)  
3. Partner shared starter code for reference:  
   [GitHub Repo](https://github.com/centerforaisafety/forecasting)  
4. Q&A



Action Took After Meeting



    1. Invited partner to Discord server for faster communication.
    2. Conducted 2 more additional team meetings & asked Sheldon questions.
    3. Invited to the git repository.
    4. Worked on D1.
    5. Setting up the Jira and the infrastructure (ongoing).
    6. Scheduled a weekly meeting with a partner.
    7. Sheldon shared open API

TODO
1. Complete infrastructure setup.

\
NOTES Took Live by Yehyun
(bullet points)

---


* Forecasting requires news, and also involves bias. We want to verify.
* End goal: build platform for forecasting
* Rational: string of text
* Platform involves 2 parts of dev:
1. BEFORE FORECASTING

            Even for questions(input):


                collect news regarding question


                meta data (views)


                chart, trend visualization

2. AFTER FORECASTING

            Output:


            	Highlight output tokens of AI’s rational 

* Partner wants feature of “different permission” => to manage sensitive data
* End Goal:

        1. comparison and understand bias
        2. improving 

* 1st part: before forecasting (gather data); metric of the data. Q. How do we validate the data?

        -> gather much as possible


        ->Twitter ?


        Relying on google


        Can we scale up???


        perplexity as a API

* 2nd part: visualization after forecasting

        Web App is for human to debug


        But API is required.

* Budget:

	


        Firebase - free


        Free website we can host then later migrate - free


        Open API 

- Summary of platform user flow:


        Users/researchers input forecasting questions


        (breakdown the query)



        System to collect news. news is used as a data for AI to predict


        Probability as well as reasoning (data comes back by their team)


        We output the data of heatmap


        We want actual news text when asking a question and travel through the text with left and right arrows. Also want the text highlighted for biases and colour code.


        When you hover a specific text, see the score.


        Bonus: search through history of chats

        Visualization of the metrics.



* Questions to ask partner:


        1. Do you have any mockups of application screens that can be provided to us?


        Yes 


        2. Provide Data / metrics as soon as possible to get some idea?


        Yes


        Answer to follow up Q.: OpenAI API : used to validate the news


        3. Use of LLMs


        Ok


        4. Repo access. To be shared.


        Ok


        5. Infrastructure which account?


        Us, then migrate


        6. Web App => do you guys want app support? and web mobile view?


        Only web


        7. Cost:


        Free : but API


        8. Name: FiveForty


        or AI forecasting system, etc. to be decided!


        9. Metrics for 2nd part:


        Feature to toggle on and off multiple metric

        2 green -- high certainty

        1 red -- low certainty
    
        0 white just neutral
