// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDb4R-ic3zS_ZuZ_B-I_9auKUDQ9bHEndo",
  authDomain: "shooting-memory.firebaseapp.com",
  projectId: "shooting-memory",
  storageBucket: "shooting-memory.appspot.com",
  messagingSenderId: "1060901624376",
  appId: "1:1060901624376:web:102972d4b1e928184ea4cd",
  measurementId: "G-FD5L6GZSS9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { app, analytics, auth, provider, db };
