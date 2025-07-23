// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDnnCkGiNVg-26FMYuSDmUdxRg6wSXT4YA",
  authDomain: "route-ai-6a51c.firebaseapp.com",
  projectId: "route-ai-6a51c",
  storageBucket: "route-ai-6a51c.firebasestorage.app",
  messagingSenderId: "3177814951",
  appId: "1:3177814951:web:4576c8a75321a6ec54b482",
  measurementId: "G-EVZQ2KRQM7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db }; 