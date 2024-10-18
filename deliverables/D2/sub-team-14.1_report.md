# Subteam Report
ForecastAI/HeavyLifters/Subteam14.1 

## Table of Contents
  - [Goal and Focus: User Story 1](#goal-and-focus-user-story-1)
  - [Database Schema and Rules](#database-schema-and-rules)
    - [Structure](#structure)
    - [Database Breakdown](#database-breakdown)
    - [Data Relationships](#data-relationships)
    - [Security Rules](#security-rules)
  - [Implementations](#implementations)
    - [Dynamic Signup/Login](#dynamic-signuplogin)
    - [Dynamic Sidebar](#dynamic-sidebar)
    - [Dynamic Chat Window](#dynamic-chat-window)
    - [Unit Testing](#unit-testing)
  - [Individual Contributions](#individual-contributions)
    - [Muaj](#muaj)
    - [Irene](#irene)
  - [Scope of Contribution and Acknowledgment of Team Work](#scope-of-contribution-and-acknowledgment-of-team-work)


## Summary
### Goal and Focus: User Story 1

Our primary objective was to implement **User Story 1**:  
*As a forecast researcher, I want to be able to view all my chat messages with the AI agent so that I can go back and use it as reference material for future work.*

The main goal was to provide users with a streamlined and intuitive way to view and manage their past chat interactions with the AI agent. This was achieved through a **dynamic and responsive user interface**, particularly a sidebar that allows users to browse, select, and retrieve chat histories efficiently.

---

### Database Schema and Rules

The **database schema** was structured to support dynamic chat functionality while ensuring efficient storage and real-time updates of chat sessions. The key features included chat history tracking and automatic sorting based on the latest modifications. We implemented real-time synchronization to ensure seamless data consistency across sessions, enabling smooth transitions between chats and immediate reflection of any changes made by users.

#### Structure
We utilized **Firestore**, a NoSQL cloud database, chosen for its flexibility and real-time synchronization capabilities—key to supporting dynamic chat functionality. Firestore's ability to store collections of documents without rigid schemas allows us to scale as needed while meeting the project's query and scalability requirements.

#### Database Breakdown

- **Users Collection**  
  The **Users** collection stores essential information for each user. Each document within the collection includes a unique `user_id` (UID), derived from Firebase Authentication, and basic fields like `email`.

- **Chats Subcollection**  
  Under each user document, there exists a **Chats** subcollection that manages all chat sessions between the user and the AI agent. Each chat is stored as a document containing essential fields such as:
  - `user_id`: Links the chat to the user.
  - `title`: Automatically generated from the first message, but editable by the user.
  - `messages`: An array that stores each message object, including the sender, content, and timestamp.
  - `created_at`: The timestamp for when the chat session was created (used for sorting and filtering).
  - `updated_at`: The timestamp of the last activity in the chat.

#### Data Relationships

We adopted an **embedding approach** to maintain efficient querying, especially for fetching a user’s chat history. The **One-to-Many** relationship between users and their chat sessions allows easy retrieval of chat data by querying the subcollection under each user document. This structure ensures that all relevant chat data can be fetched quickly and efficiently when the user logs in.

#### Security Rules

To safeguard user privacy and data integrity, we implemented strict **security rules**, ensuring that users can only access their own data and preventing unauthorized access to other users' chats.

---

### Implementations

#### Dynamic Signup/Login

Upon successful signup or login, the database is automatically updated to store the user’s information in the **Users collection**. This ensures seamless user management for later chat functionalities and ensures that users—regardless of their email type—are correctly added to the database.

#### Dynamic Sidebar

The **dynamic sidebar** is now fully integrated with the database. It allows users to either select existing chats or initiate new ones. Upon creating a new chat, the sidebar auto-selects the new session, with the first message serving as the default title. The sidebar provides real-time updates, immediately reflecting new messages and auto-sorting chats based on the most recent activity. This enhances the user experience by ensuring the most relevant conversations are easily accessible without requiring manual refreshes.

#### Dynamic Chat Window

The **dynamic chat window** operates seamlessly for both new and returning users, providing a smooth and intuitive flow. Users can start new conversations or revisit old ones, with real-time updates ensuring that the chat window displays only relevant messages for the selected session. This facilitates easy message additions and history retrieval without interruptions.

#### Unit Testing

We conducted thorough **unit testing** for the core components of the chat functionality, ensuring reliability and performance:
- Tests are saved in `/__test__/ChatWindow.test.tsx` and `/__test__/Sidebar.test.tsx`.
- Continuous progress updates were provided to the team regarding database connection successes and overall feature integration.

---
**Note**: The focus on quality over quantity was maintained throughout the project, ensuring the features were robust, user-friendly, and efficient.

---
---
---

# Individual Contributions
## Muaj
Muaj’s main role was developing a comprehensive database schema that the team could follow to meet their goals. The schema contained significant information about how user data should be stored. More specifically, the schema was foundational for handling chat data, as it allows the app to store each user's chat history in a way that makes it easy to access and manage, facilitating features that were/will be implemented like search, sorting, and retrieval of chat messages for viewing purposes. This organized structure not only simplified backend processes but also served as the main guide for all the teams to follow when making their components. As such, the schema played a critical role for our application. Muaj was also responsible for implementing the updating of the database with user information upon successful login/signup with google or other email types. He also fully wrote the README for the project, providing detailed instructions and descriptions. This README served as a critical resource for other team members and future developers, offering clear guidance on how to set up, use, and contribute to the project.

## Irene
Irene contributed to updating the database schema and rules, but her main focus wat to implement dynamic sidebar interactions chat window functionality. She implemented key features, including allowing users to select or create new chats from the sidebar, setting the default title for new chats as the first query, and ensuring chat history is maintained based on user selections. Irene integrated real-time message updates, saving them to the correct chat session and reflecting changes in the sidebar. She addressed bugs related to real-time updates and user account behaviors, ensuring smooth navigation and sorting of chats by the latest activity. She wrote unit tests for both the **Sidebar** and **ChatWindow** and collaborated with sub-teams U2 and U3 to align on chat rules and type definitions, continuously revising the codebase to maintain team coordination.

# Scope of Contribution and Acknowledgment of Team Work
In this project, our team divided the work to 3 subteams. This subteam's (14.1) contributions  focused on updating the database, the chat history feature, and enabling users to interact with their chat sessions. We implemented the UI that allows users to view, select, and engage with past chats, along with features like automated chat title generation and editing for better organization. 

It's important to note that while we handled the chat interaction, database update, and history functionality, there were certain features we did not work on. Those includes authentication, the prompt bar, and any sort of backend development. We merged these features from team 14.2 because some of our work depended on their work (ex. prompt bar).
