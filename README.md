# ForecastAI/HeavyLifters

## Partner Intro

We’re working with the _Machine Learning Group, Department of Computer Science, University of Toronto_. The team consists of brilliant researchers and engineers.

We’re working directly with Huang ([https://www.cs.toronto.edu/~huang/](https://www.cs.toronto.edu/~huang/)), and Yuchen ([https://www.yuchenwyc.com/](https://www.yuchenwyc.com/)) for advice on software-related questions. She is a U of T/Stanford/Microsoft-trained full-stack software engineer.

Project Team Leads:
- **Research Lead**: Sheldon Huang, PhD Student at University of Toronto, https://www.cs.toronto.edu/~huang.
- **Data Lead**: Ezra Karger, Federal Reserve Bank, University of Chicago, Research Director of Forecasting Research Institute, https://ezrakarger.com.
- **Software Lead**: Yuchen Wang, University of Toronto, Stanford, Microsoft, https://www.yuchenwyc.com.
- **Advisor**: Prof. Roger Grosse, CS Prof at University of Toronto, Scientist at Anthropic, https://www.cs.toronto.edu/~rgrosse.

**Primary Contact**: Sheldon Huang, Research Lead, huang@cs.toronto.edu

---

## Description about the project

A software platform that gathers global data to enhance an AI agent's ability to forecast significant future events and visualize AI rational and cognitive bias.

We’re building a website that enables users to prompt forecasting questions like ‘will Kamala Harris win the 2024 election?’, then gather relevant global data to validate, get statistics, then feed to the AI forecasting model. Output of AI rational will be then visualized to make it easy for users to identify the cognitive bias.

The Problems we’re solving make it easy for researchers to make judgement in order to improve AI forecasting models, and understand bias.

## Key Features

1. **Data Aggregation and Visualization**
   - **Purpose**: To collect vast, up-to-date, and relevant global data, enhancing the AI agent's forecasting capabilities.
   - **Details**: 
     - Users can input specific queries, and the system automatically gathers relevant data from multiple sources.
     - Visualizations display the collected data in an intuitive format, making it easier for users to understand trends and patterns on their own.

2. **Cognitive Bias Detection**
   - **Purpose**: To identify and visualizee cognitive biases.
   - **Details**: 
     - The platform uses a custom-trained AI model to analyze predictions for potential biases, such as confirmation bias or overfitting to specific data.
     - Biases are color-coded in visual representations: darker colors indicate significant bias, softer colors represent minimal bias, and uncolored elements denote neutrality, allowing users to quickly assess the reliability of the forecast.

3. **User-Friendly Query System**
   - **Purpose**: To allow users to ask complex questions simply.
   - **Details**: 
     - Users can pose questions such as “Will Kamala Harris win the 2024 election?” and receive comprehensive AI-generated forecasts.
     - The system automatically gathers relevant data, validates it, and provides a clear output that users can easily interpret.

---

## Instructions
### How to Use ForecastAI

Our application is accessible online. Follow these steps to get started and explore key features.

### Accessing the Application
1. **Visit**: Go to [ForecastAI](https://forecastai.netlify.app/signup) in your browser.
2. **Register**: Create an account by clicking **Sign Up** and entering your email and password.

### Key Features

#### 1. User Dashboard
   - **Overview**: View recent activities and insights.
   - **Access**: You are automatically redirected here after logging in.

#### 2. Ask a Forecasting Question
   - **Purpose**: Enter questions (e.g., “Who will win the 2025 Canadian election?”) to receive AI-generated forecasts.
   - **Steps**: Go to **Ask a Question**, type your query, and click **Submit**.

#### 3. Cognitive Bias Detection
   - **Purpose**: Analyze biases in AI forecasts with a color-coded heatmap.
   - **Steps**: Each forecast will be color-coded to indicate reliability (darker colors indicate higher bias).

#### 5. Account Management
   - **Purpose**: Update settings, reset passwords, and log out.
   - **Steps**: Go to **Settings** to manage your account or **Log Out** to end your session.

---


### Instructions to Set Up and Run the Project

0. Ensure you have Node.js, npm, git, and an IDE such as VS Code installed.

   - **Node.js and npm install guide**: [Node.js & npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
   - **Git install**: [Git Downloads](https://git-scm.com/downloads)
   - **VS Code Install**: [Visual Studio Code](https://code.visualstudio.com/download)

1. Clone the repository by typing in a new terminal:
   ```bash
   git clone https://github.com/csc301-2024-f/project-14-ml-cs-uoft.git
   ```

2. Navigate to the project directory:
   ```bash
   cd forecast-ai/frontend
   ```

3. Install the frontend dependencies:
   ```bash
   npm install
   ```

4. Set up Firebase:
   - Create a Firebase project and obtain your API keys. Here is a guide: [Firebase Setup](https://firebase.google.com/docs/web/setup).
   - Create a `.env` file in the frontend folder and add the following:
     ```plaintext
     REACT_APP_FIREBASE_API_KEY=your-firebase-api-key
     REACT_APP_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
     REACT_APP_FIREBASE_PROJECT_ID=your-firebase-project-id
     REACT_APP_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
     REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
     REACT_APP_FIREBASE_APP_ID=your-firebase-app-id
     ```

5. Set up Backend API Keys:
   - Open another terminal in the backend folder and create a `.env` file with the following:
     ```plaintext
     OPENAPI_API_KEY=your-openai-api-key
     LOCAL_OR_PROD=local
     DOCKER_OR_LAMBDATEST=lambdatest
     USERNAME=your-lambdatest-username
     ACCESS_KEY=your-lambdatest-access-key
     ```
   - Here, `OPENAPI_API_KEY` is your OpenAI API key, and `USERNAME` and `ACCESS_KEY` are for LambdaTest credentials.

6. Install and Run FastAPI for the Backend:
   - **Install FastAPI**:
     Open a terminal in the backend folder and install FastAPI and its server, `uvicorn`, by running:
     ```bash
     pip install fastapi uvicorn
     ```
   - **Run the Backend Server**:
     Start the FastAPI server by running:
     ```bash
     uvicorn main:app --reload
     ```
     - The backend will be available at `http://127.0.0.1:8000`.

7. Run the Development Server for the Frontend:
   ```bash
   npm start
   ```

8. The application should now be running! Open `http://localhost:3000` in your browser to access it.

---

## Deployment and GitHub Workflow

### Branching and Naming Conventions
1. **Main Branch**: 
   - The `main` branch is the branch where all the working code resides.
   - Direct commits to `main` are **restricted**. Only **pull requests (PRs)** are merged after thorough review.
   - Each PR requires at least **one reviewer** from the team to approve before merging.
   
2. **Feature Branches**:
   - For major development, each developer creates a branch in the format: `features/developer-name/feature-name`. 
   - Example: `features/alice/user-authentication`.
   - This helps keep our work organized.
   
3. **Documentation Branches**:
   - Documentation is also version-controlled for clarity and tracking. Branches follow the naming format: `docs/developer-name/doc-work-name`.
   - Example: `docs/alice/d1-changes`.

4. **Release Branches**:
   - On a weekly or monthly basis after a major feature is completed, we will create a copy of the `main` saved as a release. 
   - Branch names follow the format: `release/major-feature-name`.
   - Example: `release/ui-complete`.

5. **Naming Conventions**:
   - We follow the convention of **dashes (-)** for separating words in branch names, avoiding underlines (_) for the sake of consistency.

### Git Workflow Process
1. **Creating Feature Branches**:
   - Developers will clone/pull from the `main` branch and create feature branches for any new work. 
   
2. **Pull Requests (PRs)**:
   - Once a feature or document is complete, the developer submits a **pull request** from the feature/document branch to `main`.
   - A PR requires at least **one reviewer** for approval to ensure code quality and reduce the chance of conflicts.

3. **Code Review and Merging**:
   - After reviewing and ensuring no conflicts exist, the reviewer approves the PR, and it is merged into the `main` branch by either the reviewer or the developer requesting the PR.
   
4. **Release Cycle**:
   - Periodically, once the `main` branch is considered stable and updated with a new feature, a backup is created using a `release` branch to keep track of the milestone.
   
### Deployment Process
1. **Code Writing**: Developers write code in their feature branches.
2. **Merging to Main**: Once tested and approved via testing locally, the feature branch is merged into the `main` branch.
3. **Deployment**: We are using Netlify as our deployment tool for hosting and managing the application.

### Justification for Workflow
- **Code Isolation**: By using feature and documentation branches, we ensure that work is isolated, making it easier to track progress and manage changes.
- **Peer Review**: Requiring a minimum of one peer review ensures that bugs, performance issues, and inconsistencies are caught early and can be fixed.
- **Naming Conventions**: Clear naming conventions make it easier to understand the purpose of a branch, especially when there will be many branches for different features.
- **Feature Release**: Regularly creating `release` branches allows us to maintain stable backups and provides a reliable fallback if issues arise in our code.

---

## Coding Standards and Guidelines

  Our code will follow the coding standards that help keep our code understandable, consistent and maintanable. We will follow language-specific style guides (such as PEP 8 for Python), conduct code reviews to ensure quality, and write comprehensive documentation including comments to clarify complex code. 

---

## Licenses 
 
 As of right now, we have decided that once the project is completed, we will completely open source our code with an MIT license, so that the public can access our work. We will keep hosting the frontend and backend but the API cost won’t be handled by the partner. We will most likely host it ourselves unless they decide to continue the project and handle the infrastructure cost. 
