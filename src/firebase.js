// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCv_Msml6xc53-n59V1XEpIwUCrTeftbcQ",
  authDomain: "leetcodewrapped.firebaseapp.com",
  projectId: "leetcodewrapped",
  storageBucket: "leetcodewrapped.firebasestorage.app",
  messagingSenderId: "597051299798",
  appId: "1:597051299798:web:bea22bcf7386e6bc2bb677",
  measurementId: "G-Q8JLVYF19C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { app, analytics, db };
