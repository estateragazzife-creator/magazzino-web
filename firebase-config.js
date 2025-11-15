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
firebase.initializeApp(firebaseConfig);

// Ottieni il database
const db = firebase.firestore();
const analytics = getAnalytics(app);