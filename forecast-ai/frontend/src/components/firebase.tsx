// src/components/firebase.tsx
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, UserCredential } from "firebase/auth";

/**
 * Firebase Initialization and Authentication
 *
 * This module initializes Firebase using environment-specific configuration and sets up
 * Firebase Authentication, including Google Sign-In.
 *
 * Exports:
 * - `auth`: The Firebase authentication instance, used for managing user sessions.
 * - `signInWithGoogle`: A function that allows users to sign in using Google via a popup.
 *
 * Firebase Configuration:
 * - Uses environment variables for Firebase project credentials, enhancing security
 *   by not hardcoding sensitive data into the source code.
 *
 * Functions:
 * - `signInWithGoogle`: Initiates Google Sign-In using Firebase's `signInWithPopup` and
 *   returns a `UserCredential` object upon success.
 *
 * @module Firebase
 */


const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Google Auth Provider
const provider = new GoogleAuthProvider();

export const signInWithGoogle = (): Promise<UserCredential> => {
  return signInWithPopup(auth, provider);
};

// Function to get the current user's ID token
export const getAuthToken = async (): Promise<string | null> => {
  const user = auth.currentUser;
  if (user) {
    return await user.getIdToken(true);
  }
  return null;
};

export default app;
