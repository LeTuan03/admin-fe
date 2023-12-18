// Import the functions you need from the SDKs you need
// JavaScript
// src.firebase.js
import {initializeApp} from "firebase/app";
import {getFirestore} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBKRK4VHTKxkKHmnb-8eGK-oP6D2E9J08o",
  authDomain: "volunteer-campaign-management.firebaseapp.com",
  projectId: "volunteer-campaign-management",
  storageBucket: "volunteer-campaign-management.appspot.com",
  messagingSenderId: "1030291701020",
  appId: "1:1030291701020:web:0c78cc662775030fad8ed9",
  measurementId: "G-JDDTMR82C9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const database = getDatabase(app);

export default app;
