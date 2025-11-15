// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCUuv916d_qQedNa9i4UgZiGmLVByl4l-Y",
  authDomain: "er-database-9a0a6.firebaseapp.com",
  projectId: "er-database-9a0a6",
  storageBucket: "er-database-9a0a6.firebasestorage.app",
  messagingSenderId: "377339254828",
  appId: "1:377339254828:web:fa28305d73ec6b74de9989",
  measurementId: "G-ST79JSW99Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = firebase.firestore();
const analytics = getAnalytics(app);