## What is the product? ⚙️

The project is designed to streamline the collection of real-time global data and identify biases in AI-generated forecasts. It automates data gathering from various sources like news and social media, organizes it for AI analysis, and provides visualizations that highlight both the predictions and any biases in the data. This enhances the transparency of AI forecasts and improves their accuracy by addressing potential cognitive biases.

Developed in partnership with the Machine Learning Group at the University of Toronto, the platform refines a custom AI model for forecasting major events. Users can submit questions, and the system generates predictions, clearly showing how the data and AI's reasoning impact the results, making AI-driven forecasts more understandable and transparent.

## Installation Guide

#### 1. Ensure you have Node.js, npm, Python, pip and an IDE such as VS Code installed.

- Node.js and npm install guide: https://docs.npmjs.com/downloading-and-installing-node-js-and-npm
- Python and pip install guide: https://wiki.python.org/moin/BeginnersGuide/Download
- VS Code Install: https://code.visualstudio.com/download

#### 2. Clone the repository by typing in a new terminal:

`git clone https://github.com/csc301-2024-f/project-14-ml-cs-uoft.git`

#### 3. Navigate to the frontend project directory:

`cd forecast-ai/frontend`

#### 4. Install the frontend dependencies:

`npm install`

#### 5. Create .env file at the root of the current folder:

```
REACT_APP_FIREBASE_API_KEY=your-firebase-api-key

REACT_APP_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain

REACT_APP_FIREBASE_PROJECT_ID=your-firebase-project-id

REACT_APP_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket

REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id

REACT_APP_FIREBASE_APP_ID=your-firebase-app-id

REACT_APP_BACKEND_URL=backend-url (http://localhost:8000 for local)
```

If REACT_APP_BACKEND_URL is set to production endpoint, you do not need to run the backend locally. If this is set to localhost, please continue to host the Fast API locally.

#### 6. Run the development server:

`npm start`

#### 7. Access the frontend application:

The application should now be running in your browser as http://localhost:3000.

#### 8. Navigate to the backend project directory:

`cd ../forecast-ai/backend`

#### 9. Install the backend dependencies:

`pip install -r requirements.txt`

#### 10. Create .env file at the root of the current folder:

```
OPENAPI_API_KEY=your-openapi-api-key

LOCAL_OR_PROD=local
```

#### 11. Run the development server:

`uvicorn main:app`

- If an error raises, pip install "uvicorn[standard]" and try again.

#### 12. Access the backend application:

The server should now be running in http://localhost:8000.

## How to run tests 🧪

#### 1. Navigate to the frontend directory and run the following commmand:

`npm test`

You should see the following output:\
<img src="./images/14.2/frontend-unit-test-result.png" width="600">


#### 2. Navigate to the backend directory and run the following command:

`python unit_test/unit_test.py`

You should see the following output:\
<img src="./images/14.2/backend-unit-test-result.png" width="600">

---
### Key Features 🔑

#### 1. User Input Features:

- **Input Forecasting Question**: Users can input a specific forecasting question into the system via a prompt bar at the bottom of the page.

#### 2. Data Retrieval & Display:

- **Retrieve Relevant Data**: The system retrieves and displays the X most relevant data points related to the user's forecasting question.
- **Adjustable Data Parameters**: Users can control the parameters to customize the total number of sources to collect/display, ratio of different news platform and article date ranges.
- **View Full Data Source**: Users can view the entire content of each data source to understand the context behind the data

## Demo

### Local:

<video src="https://github.com/user-attachments/assets/6bed3b01-1f62-4c9b-9eb3-709871057002" controls="controls" style="max-width: 730px;">
</video>

### Production:

<video src="https://github.com/user-attachments/assets/03b27fe0-6d79-4e8a-ac3c-4e23a69a2b06" controls="controls" style="max-width: 730px;">
</video>
