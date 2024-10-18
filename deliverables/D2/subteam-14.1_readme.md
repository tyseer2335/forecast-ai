## Introduction

Welcome to **forecastAI**! forecastAI is a forecasting application that offers seamless user interaction, personalized predictions, and efficient chat management. Our component of this application allows users to store and retrieve chat histories effortlessly. Featuring dynamic sidebar interactions and a structured chat history system, our component is designed to enhance the forecastAI user experience.

This README will guide you through the installation, setup, and usage of our component. Videos are provided to illustrate key features and testing.

## Key Features

- **Chat History:** Store and retrieve previous chats with the AI for future reference.
- **Chat Sorting:** Automatically sorts chat sessions by the latest activity.
- **Real-time Chat Reflection:** Select any chat from your history, and the screen updates instantly, reflecting the conversation in real-time.
- **Secure User Data:** All user data is securely stored in Firebase, ensuring that your chats and personal data are protected.
- **Automated Chat Title Generation:** Each chat session is automatically assigned a meaningful title based on its content, making it easier for users to search through their chat history.

## Installation

0. Ensure you have Node.js, npm, git, and an IDE such as VS Code installed.

   - Node.js and npm install guide: [Node.js & npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
   - Git install: [Git Downloads](https://git-scm.com/downloads)
   - VS Code Install: [Visual Studio Code](https://code.visualstudio.com/download)

1. Clone the repository by typing in a new terminal:
   ```bash
   git clone https://github.com/csc301-2024-f/project-14-ml-cs-uoft.git
   ```
2. Change branch to the D2-14.1 branch:
   ```bash
   git checkout D2-14.1
   ```
3. Navigate to the project directory:
   ```bash
   cd forecast-ai/frontend
   ```
4. Install the dependencies:
   ```bash
   npm install
   ```
5. Set up Firebase:
   - Create a Firebase project and obtain your API keys. Here is a guide: [Firbase Setup](https://firebase.google.com/docs/web/setup)
   - Create a .env file in the frontend folder and add the following:
        ```
        REACT_APP_FIREBASE_API_KEY=your-firebase-api-key
        REACT_APP_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
        REACT_APP_FIREBASE_PROJECT_ID=your-firebase-project-id
        REACT_APP_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
        REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
        REACT_APP_FIREBASE_APP_ID=your-firebase-app-id
        ```
6. Run the development server:
   ```bash
   npm start
   ```
7. The application should now be running in your browser!

## Demonstration

Here’s a video demo of the application showcasing the key features of our component:

<video src="https://github.com/user-attachments/assets/b6c3dfcb-51c0-45f7-adbe-174aae3545f6
" controls="controls" style="max-width: 730px;">
</video>
