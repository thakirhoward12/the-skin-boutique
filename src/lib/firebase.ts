import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD8_UOz3Wpow0Wn9w3EHi3MI74r3Yrn_YU",
  authDomain: "gen-lang-client-0717528220.firebaseapp.com",
  projectId: "gen-lang-client-0717528220",
  storageBucket: "gen-lang-client-0717528220.firebasestorage.app",
  messagingSenderId: "335167175305",
  appId: "1:335167175305:web:4f7c4f0a3f4419af9be458",
  measurementId: "G-51B1M2M70P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Firebase Authentication
export const auth = getAuth(app);
