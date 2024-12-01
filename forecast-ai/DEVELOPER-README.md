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

<img src="images/architecture.png" alt="forecastai's architecture" width="500"/>

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
- **Article Retrieval**:
  - Uses the **Google News API** to fetch links to relevant articles for each search query.
  - Employs **Selenium** to scrape content from websites when necessary, extracting full text, titles, and metadata.
- **Relevance Filtering**:
  - Prompts **GPT-4-mini** to evaluate the relevance of each retrieved article with respect to the original forecasting question.
  - Scores articles on relevance, filters the top N articles, and prepares them for forecast generation.
- **Forecast Generation**:
  - Prompts **GPT-4** to synthesize selected articles and generate:
    - A probability-based forecast for the question.
    - A rationale explaining the reasoning behind the forecast.
  - Offers flexibility for future integration of custom forecasting models or pipelines.

- **Bias Heatmap Generation**:
  - Evaluates selected articles for biases across specified features.
  - Generates a heatmap visualizing token-level bias, which is returned to the frontend for display.

## Design

---

# Development Requirements 

To set up your own environment to continue working on this project, you will need Netlify,  Firebase, Docker, and Render for hosting, deployment, and managing the backend and frontend components. You will also need an [OpenAi API Key](https://openai.com/index/openai-api/).

0. Ensure you have Node.js, npm, git, and an IDE such as VS Code installed.

   - **Node.js and npm install guide**: [Node.js & npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
   - **Git install**: [Git Downloads](https://git-scm.com/downloads)
   - **VS Code Install**: [Visual Studio Code](https://code.visualstudio.com/download)

1. Clone the repository by typing in a new terminal:
   ```bash
   git clone https://github.com/csc301-2024-f/project-14-ml-cs-uoft.git
   ```

2. Deploy frontend on Netlify:
   - Please follow the [guide](https://www.netlify.com/blog/2016/09/29/a-step-by-step-guide-deploying-on-netlify/) to do this.
   - For the build settings, please refer to the image below.
![Netlify build settings](images/netlify-build.png)

3. Navigate to the frontend project directory:
   ```bash
   cd forecast-ai/frontend
   ```

4. Install the frontend dependencies:
   ```bash
   npm install
   ```

5. Host backend via Render:
   - If you haven't already, [create an account](https://dashboard.render.com/register) on Render and login.
   - Once logged in, click on "New +" in the top right corner.
   - Then, choose "Web Service" from the available options.
   - Finally, select the "Existing image" option and fill in the information required.
   - You should now be able to manually deploy your app!
   - For the render environment variables below, please keep the relevant variables to single, prod, and lambdatest or docker.:
   <p style="text-align: left; margin-left: 20px;">
      <img src="images/render-env-variables.png" width="300" />
   </p>


6. Set up frontend .env:
   - Create a Firebase project and obtain your API keys. Here is a guide: [Firebase Setup](https://firebase.google.com/docs/web/setup).
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

7.  Navigate to the backend project directory:
      ```bash
      cd forecast-ai/backend
      ```

8. Build the app using Docker:
   - Before you begin, ensure you have the following:
      - Docker Desktop: [Download Docker Desktop](https://www.docker.com/products/docker-desktop/)
      - Docker Hub account: [Create a Docker Hub account](https://app.docker.com/signup)
   - Then write the following in a terminal:
      ```bash
      docker system prune -a  # Reset images
      docker build -t your-dockerhub-username/forecastai  # Build all
      docker push your-dockerhub-username/forecastai #  Push to docker hub
      ```

9. Set up backend .env:
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
      This option will run selenium on your local device.
   - Option 2:
      ```plaintext
      DOCKER_OR_LAMBDATEST=lambdatest
      SINGLE_OR_PARALLEL=single/parallel
      ```
      This option will run lambdatest on the cloud and will be much faster.

10. Set up backend files:
   - To run our app, you will need to put a `prompt.py` file into the `query_to_answer/` folder
   - You will also need to put the firebase service account key json file in the backend folder.

11. Install the backend dependencies by navigating to the backend folder via the terminal:
     ```bash
     pip install -r requirements.txt
     ```

12. Run the backend Server:
     ```bash
     uvicorn main:app
     ```
    The backend will be available at `http://127.0.0.1:8000`.

13. Run the development Server for the frontend by navigating to the frontend folder via the terminal:
      ```bash
      npm start
      ```

14. The application should now be running locally!

