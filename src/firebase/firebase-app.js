// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebaseの設定情報
const firebaseConfig = {
  apiKey: "AIzaSyDb4R-ic3zS_ZuZ_B-I_9auKUDQ9bHEndo",
  authDomain: "shooting-memory.firebaseapp.com",
  databaseURL: "https://shooting-memory-default-rtdb.firebaseio.com",
  projectId: "shooting-memory",
  storageBucket: "shooting-memory.appspot.com",
  messagingSenderId: "1060901624376",
  appId: "1:1060901624376:web:102972d4b1e928184ea4cd",
  measurementId: "G-FD5L6GZSS9",
};

// Firebaseアプリを初期化
const app = initializeApp(firebaseConfig);

// FirestoreとStorageのインスタンスを取得
const db = getFirestore(app);
const storage = getStorage(app);

// Firebase Authenticationのインスタンスを取得
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, storage, auth, provider };
