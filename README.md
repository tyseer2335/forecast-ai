# YOUR PRODUCT/HeavyLifters

> _Note:_ This document is intended to be relatively short. Be concise and precise. Assume the reader has no prior knowledge of your application and is non-technical. 

## Partner Intro

 * Include the names, emails, titles, primary or secondary point of contact at the partner organization

 * Provide a short description about the partner organization. (2-4 lines)

We’re working with the _Machine Learning Group, Department of Computer Science, University of Toronto_. The team consists of brilliant researchers and engineers.

We’re working directly with Huang ([https://www.cs.toronto.edu/~huang/](https://www.cs.toronto.edu/~huang/)), and Yuchen ([https://www.yuchenwyc.com/](https://www.yuchenwyc.com/)) for advice on software-related questions. She is a U of T/Stanford/Microsoft-trained full-stack software engineer.

Project Team Leads:
- **Research Lead**: Sheldon Huang, PhD Student at University of Toronto, https://www.cs.toronto.edu/~huang.
- **Data Lead**: Ezra Karger, Federal Reserve Bank, University of Chicago, Research Director of Forecasting Research Institute, https://ezrakarger.com.
- **Software Lead**: Yuchen Wang, University of Toronto, Stanford, Microsoft, https://www.yuchenwyc.com.
- **Advisor**: Prof. Roger Grosse, CS Prof at University of Toronto, Scientist at Anthropic, https://www.cs.toronto.edu/~rgrosse.

**Contact**: Sheldon Huang, Research Lead, huang@cs.toronto.edu

## Description about the project

Keep this section very brief.

 * Provide a high-level description of your application and it's value from an end-user's perspective

 * What is the problem you're trying to solve? Is there any context required to understand **why** the application solves this problem?

A software platform that gathers global data to enhance an AI agent's ability to forecast significant future events and visualize AI rational and cognitive bias.

We’re building a website that enables users to prompt forecasting questions like ‘will Kamala Harris win the 2024 election?’, then gather relevant global data to validate, get statistics, then feed to the AI forecasting model. Output of AI rational will be then visualized to make it easy for users to identify the cognitive bias.

The Problems we’re solving make it easy for researchers to make judgement in order to improve AI forecasting models, and understand bias.

## Key Features

 * Describe the key features in the application that the user can access.

 * Provide a breakdown or detail for each feature.

 * This section will be used to assess the value of the features built

## Instructions

 * Clear instructions for how to use the application from the end-user's perspective

 * How do you access it? For example: Are accounts pre-created or does a user register? Where do you start? etc. 

 * Provide clear steps for using each feature described in the previous section.

 * This section is critical to testing your application and must be done carefully and thoughtfully.
 
 ## Development requirements

 * What are the technical requirements for a developer to set up on their machine or server (e.g. OS, libraries, etc.)?

 * Briefly describe instructions for setting up and running the application. You should address this part like how one would expect a README doc of real-world deployed application would be.

 * You can see this [example](https://github.com/alichtman/shallow-backup#readme) to get started.

 ## Deployment and Github Workflow

Describe your Git/GitHub workflow. Essentially, we want to understand how your team members share codebase, avoid conflicts and deploys the application.

 * Be concise, yet precise. For example, "we use pull-requests" is not a precise statement since it leaves too many open questions - Pull-requests from where to where? Who reviews the pull-requests? Who is responsible for merging them? etc.

 * If applicable, specify any naming conventions or standards you decide to adopt.

 * Describe your overall deployment process from writing code to viewing a live application

 * What deployment tool(s) are you using? And how?

 * Don't forget to **briefly justify why** you chose this workflow or particular aspects of it!

Here's a git workflow we will follow:

* Main -- this restricts any commits, and accepts only pull requests (PR). We require at least 1 developer to review.
* Docs/..major doc work name.. -- we also version control the document we work on. Ex) “docs/readme”.
* Features/developer name/feature name -- this is where major development happens. We then merge this to main via PR.
* Release/name of major features -- when we have a safe main branch, we will on weekly or monthly basis, save backup of main branch.
* No underlines _ but only dashes -

 ## Coding Standards and Guidelines

 Keep this section brief, a maximum of 2-3 lines. You would want to read through this [article](https://www.geeksforgeeks.org/coding-standards-and-guidelines/) to get more context about what this section is for before attempting to answer.

  * These are 2 optional resources that you might want to go through: [article with High level explanation](https://blog.codacy.com/coding-standards-what-are-they-and-why-do-you-need-them/) and [this article with Detailed Explanation](https://google.github.io/styleguide/)

 ## Licenses 

 Keep this section as brief as possible. You may read this [Github article](https://help.github.com/en/github/creating-cloning-and-archiving-repositories/licensing-a-repository) for a start.

 * What type of license will you apply to your codebase? And why?

 * What affect does it have on the development and use of your codebase?
