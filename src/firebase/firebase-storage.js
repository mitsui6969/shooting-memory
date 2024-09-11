// src/firebase.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Firebaseの設定情報
const firebaseConfig = {
  apiKey: "AIzaSyDoapRsTh_-VkrOoZ0tuHQ74p_-gOw39CU",
  authDomain: "hackthon-firebase.firebaseapp.com",
  projectId: "hackthon-firebase",
  storageBucket: "hackthon-firebase.appspot.com",
  messagingSenderId: "429948710938",
  appId: "1:429948710938:web:525887c15e88395abee1a3"
};

// Firebaseアプリを初期化
const app = initializeApp(firebaseConfig);

// FirestoreとStorageのインスタンスを取得
const storage = getStorage(app);

export default storage;
