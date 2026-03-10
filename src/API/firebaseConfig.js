import { initializeApp } from "firebase/app";
import { getAI, getGenerativeModel } from "firebase/ai"; 

const firebaseConfig = {
  apiKey: "AIzaSyBjue1IH4UIMjBdKoBevwUjY4bcMqc56v0",
  authDomain: "my-gemini-app-b0e7d.firebaseapp.com",
  projectId: "my-gemini-app-b0e7d",
  storageBucket: "my-gemini-app-b0e7d.firebasestorage.app",
  messagingSenderId: "884603155710",
  appId: "1:884603155710:web:1676c5b097391c5c12e1af",
  measurementId: "G-K7QECCKV4T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize the AI service
const ai = getAI(app);

// Export the model so we can use it in App.js
export const geminiModel = getGenerativeModel(ai, { model: "gemini-2.0-flash-001" });



                                                                                                          