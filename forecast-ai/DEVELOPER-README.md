# Technical Documentation

## Tech Stack
Our application uses a modern tech stack to ensure scalability, reliability, and an intuitive user experience:

- **Frontend**: React and TypeScript, providing a responsive and interactive web application.
- **Backend**: Python with FastAPI, offering robust and fast API endpoints for processing user queries and interfacing with external APIs.
- **Authentication**: Firebase Authentication, ensuring secure user access and management.
- **Database**: Cloud Firestore (NoSQL) for storing user chat histories and other data.

### External APIs and Tools:
- **OpenAI API**: Provides AI-powered query generation, forecasting, relevance filtering, and bias analysis.
- **Google News API**: Aggregates relevant news data for forecasts.
- **Selenium**: Handles web scraping and automation for additional data sources when APIs fall short.
- **Jest**: Used for testing frontend components to ensure functionality and reliability.

### Deployment:
- **Frontend**: Hosted on Netlify for fast and scalable deployment.
- **Backend**: Hosted on Render, offering an easy-to-manage and scalable backend environment.
- **Docker**: Used for containerizing the application, ensuring consistent builds and deployments across environments.

---

## Architecture

Our application follows a modular and scalable architecture designed to perform data-driven forecasting effectively. Below is an image that illustrates our architecture:

<img src="images/architecture.png" alt="forecastai's architecture" width="600"/>

### 1. **Frontend**:
- **User Interaction**:
  - Captures user questions for forecasting.
  - Displays forecasting results, bias heatmaps, and chat history.
- **Authentication and Data Management**:
  - Firebase Authentication secures user sessions.
  - Cloud Firestore retrieves and stores user chat data seamlessly.
- **Communication with Backend**:
  - Sends HTTP requests to the backend for generating forecasts and receiving processed results.

### 2. **Backend**:
- **Main Framework**: Python with FastAPI.
- **Core Functionalities**:
  - Processes forecasting requests.
  - Integrates external APIs (OpenAI, Google News) and handles web scraping with Selenium.
- **API Integration**:
  - OpenAI API for generating search queries, filtering relevant content, and generating forecasts.
  - Google News API for retrieving relevant news links.
- **Bias Analysis**:
  - Uses OpenAI to create a bias heatmap, analyzing token-level biases in retrieved text.

### 3. Backend Forecasting Pipeline:
- **Search Query Extraction**:
  - Prompt GPT-4o to get google search queries that find objective information for forecasting question from different (specified) sources.

  - This involves reorganizing and dividing the forecasting question into multiple search queries to get the most relevant information. We ensure we make use of total news to collect and final news data to display, and use those numbers to appropriately divide the search queries, and re-organize them to get the most relevant information.
  
- **Article Retrieval**:
  - Uses the **Google News API** to fetch links to relevant articles for each search query.
  - However, Gnews returns new link which will redirect to the actual news article. We use two ways to tackle this problem: a) When using single processing, we decode the link to get the actual news article. b) When using parallel processing, we use **Selenium** to scrape the actual news article from the link.
  - This solves the problem of getting the actual news article from the link.

  - Employs **Selenium** to scrape content from websites when necessary, extracting full text, titles, and metadata. This works well locally, but for production, we use **Lambdatest** to run the selenium tests on the cloud. Docker can be used as well, however, we found that Lambdatest is faster and more efficient. Currently, as requested, we are disabling the use of Selenium in the backend, but it can be enabled by setting the `USE_SELENIUM_TRUE_OR_FALSE` environment variable to `true`.

  - We use BLACKLIST in the prompt.py to filter out the websites that we don't want to scrape the content from. This is to ensure that we only scrape the content from the websites that we trust and that we know are reliable. For example, as requested, for demo purpose, we disabled, X, Facebook, and other websites that we do not want to scrape the content from, along with disabling the use of Selenium.

  - If config for USE_SELENIUM_TRUE_OR_FALSE is set to false, we use html2text and beutifulsoup to scrape the content from the website. This ensure faster and more efficient scraping of the content.


- **Relevance Filtering**:
  - Prompts **GPT-4o-mini/GPT3.5 Turbo** to evaluate the relevance of each retrieved article with respect to the original forecasting question.
  - Scores articles on relevance, filters the top N articles, and prepares them for forecast generation.
  - We try to ensure our backend outputs formatted data as much as possible, so that next processing steps can be done easily.
  - For the empty, or irrelevant articles, we try to ensure that we do not include them in the final output, and we try to ensure that we only include the relevant articles in the final output.
  - For example, ones with score 1 will be excluded from the final output.


- **Forecast Generation**:
  - Prompts **GPT-4o-mini** to synthesize selected articles and generate:
    - A probability-based forecast for the question.
    - A rationale explaining the reasoning behind the forecast.
  - Offers flexibility for future integration of custom forecasting models or pipelines.

  - This involves first summarizing the articles, and then generating the forecast. We ensure that we summarize the articles to get the most relevant information, and then generate the forecast based on the summarized articles. This ensures that we get the most relevant information for the forecast.

  - Then to avoid maximum token exceed error, we summarize the forecasting answer to get the most relevant information. Then this will be feeded to the GPT-4o-mini to generate the forecast bias heatmap.

- **Bias Heatmap Generation**:
  - Generates a heatmap visualizing token-level bias, which is returned to the frontend for display.

  - As mentioned above, we generate the bias heatmap based on the summarized forecasting answer. This ensures we avoid maximum token exceed error, and get the most relevant information for the bias heatmap. Maximum token exceed error happens otherwise, since we use function calling to get expected formatted structured data. We used to use dictionary to store the data, but we found that it was not efficient, and we were getting maximum token exceed error. So we changed dictionary to list, ensuring faster and more efficient processing of the data.

---

# Development Requirements 

* Please note, following is instruction for both local and production deployment.

To set up your own environment to continue working on this project, you will need Netlify, Firebase, Docker, and Render for hosting, deployment, and managing the backend and frontend components. You will also need an [OpenAI API Key](https://openai.com/index/openai-api/). Optionally, you can use [Lambdatest](https://www.lambdatest.com/) for cloud-based Selenium testing. Otherwise, you can use Selenium on your local device, or with proper configuration, you can disable Selenium in the backend, using html2text and beautifulsoup for scraping the content from the website (works both locally and in production).

As an overview with environment variables, for frontend, you only need one .env file, and for backend, you need one .env file, one prompt.py file, and one firebase service account key json file.

We highly recommend you to read from top to bottom first, and then following the steps to set up the local development setting and production deployment.


0. Ensure you have Node.js, npm, git, and an IDE such as VS Code installed.

   - **Node.js and npm install guide**: [Node.js & npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
   - **Git install**: [Git Downloads](https://git-scm.com/downloads)
   - **VS Code Install**: [Visual Studio Code](https://code.visualstudio.com/download)

1. Clone the repository by typing in a new terminal:
   ```bash
   git clone https://github.com/csc301-2024-f/project-14-ml-cs-uoft.git
   ```
   or using the forked repository link.
   ```bash
   git clone https://github.com/YehyunLee/MachineLearningGroupUofTCsDepart-ForecastAI.git
   ```

2. Deploy frontend on Netlify:
   - Please follow the [guide](https://www.netlify.com/blog/2016/09/29/a-step-by-step-guide-deploying-on-netlify/) to do this.
   - You will need to create a Netlify account and link it to your GitHub repository. We first recommend you go through the guide to understand the process and setting the GitHub repository first.
   - For the build settings, please refer to the image below.
![Netlify build settings](images/netlify-build.png)
   - For the environment variables, use the credentials that has been shared to add them to netlify "environment variables" section. Or, please go through this guide till the end to set up the environment variables.

3. If you want to run frontend locally, navigate to the frontend project directory:
   ```bash
   cd forecast-ai/frontend
   ```

    Set up frontend .env:
   - Create a Firebase project and obtain your API keys. Here is a guide: [Firebase Setup](https://firebase.google.com/docs/web/setup). Please follow step 5. for more details on how to get the firebase credentials.
   - Create a `.env` file in the frontend folder and add the following:
     ```plaintext
     REACT_APP_FIREBASE_API_KEY=your-firebase-api-key
     REACT_APP_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
     REACT_APP_FIREBASE_PROJECT_ID=your-firebase-project-id
     REACT_APP_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
     REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
     REACT_APP_FIREBASE_APP_ID=your-firebase-app-id
     REACT_APP_BACKEND_URL=your-render-url
     ```
    - *Fill in those fields, as you follow this guide.

4. Install the frontend dependencies:
   ```bash
   npm install
   ```
    Ensure you have .env file with credentials that has been shared.
    Then, run the frontend server:
    ```bash
    npm start
    ```

5. Set up backend .env under /backend folder:
      ```bash
      cd forecast-ai/backend
      ```

    Again, to get firebase SDK credentials:
   - First, go to Google Cloud Console and select your firebase project. 
   - Then, [create your service account key](https://cloud.google.com/iam/docs/keys-create-delete). Make sure to download the json file to your computer since that will be your firebase service account key. For reference, here is what the json file would look like:
   ```plaintext
   {
      "type": "service_account",
      "project_id": "",
      "private_key_id": "",
      "private_key": "-----BEGIN PRIVATE KEY-----\n\n-----END PRIVATE KEY-----\n",
      "client_email": "",
      "client_id": "",
      "auth_uri": "",
      "token_uri": "",
      "auth_provider_x509_cert_url": "",
      "client_x509_cert_url": "",
      "universe_domain": "googleapis.com"
   }
     ```
    - Finally, create a `.env` file in the backend folder with the following:
     ```plaintext
     OPENAPI_API_KEY=your-openai-api-key
     LOCAL_OR_PROD=local/prod
     DOCKER_OR_LAMBDATEST=lambdatest/docker
     SINGLE_OR_PARALLEL=single/parallel
     USERNAME=your-lambdatest-username
     ACCESS_KEY=your-lambdatest-access-key
     FIREBASE_SERVICE_ACCOUNT_KEY=your-firebase-service-account-key
     USE_SELENIUM_TRUE_OR_FALSE=true/false
     ```
   - Here, `OPENAPI_API_KEY` is your OpenAI API key, and `USERNAME` and `ACCESS_KEY` are for your LambdaTest credentials. To get a lambdatest key, refer to this [guide](https://www.lambdatest.com/support/docs/hyperexecute-how-to-get-my-username-and-access-key/).
   - Option 1:
      ```plaintext
      DOCKER_OR_LAMBDATEST=docker
      SINGLE_OR_PARALLEL=single/parallel
      ```
      This option will run selenium on your local device if LOCAL_OR_PROD is set to local.
      If LOCAL_OR_PROD is set to prod, it will run on the cloud.
   - Option 2:
      ```plaintext
      DOCKER_OR_LAMBDATEST=lambdatest
      SINGLE_OR_PARALLEL=single/parallel
      ```
      This option will run lambdatest on the cloud and will be much faster, regardless of the LOCAL_OR_PROD setting.

6. Set up backend files:
   - To run our app, you will need to put a `prompt.py` file into the `query_to_answer/` folder
   - Lastly, you will need to put the firebase service account key json file in the backend folder.

7. Install the backend dependencies by navigating to the backend folder via the terminal:
     ```bash
     pip install -r requirements.txt
     ```

8. To run the backend server locally:
     ```bash
     uvicorn main:app
     ```
    The backend will be available at `http://127.0.0.1:8000`.

9. To finish hosting backend in production, build the app using Docker:
   - Before you begin, ensure you have the following:
      - Docker Desktop: [Download Docker Desktop](https://www.docker.com/products/docker-desktop/)
      - Docker Hub account: [Create a Docker Hub account](https://app.docker.com/signup)
   - Run the docker desktop application.
   - Then write the following in a terminal in the backend folder:
      ```bash
      docker system prune -a  # Reset images
      docker build -t your-dockerhub-username/forecastai(or your-repository-name) # Build all
      docker push your-dockerhub-username/forecastai(or your-repository-name) #  Push to docker hub
      ```

10. Host backend fastAPI via Render:
   - If you haven't already, [create an account](https://dashboard.render.com/register) on Render and login.
   - Once logged in, click on "New +" in the top right corner.
   - Then, choose "Web Service" from the available options.
   - Finally, select the "Existing image" option and fill in the information required with the image you pushed to Docker Hub.
   - You should now be able to manually deploy your app!
   - For the render environment variables below, use the credentials that has been shared to add them to render "environment variables" section. Feel free to adjust the environment variables as needed.
   <p style="text-align: left; margin-left: 20px;">
      <img src="images/render-env-variables.png" width="300" />
   </p>
