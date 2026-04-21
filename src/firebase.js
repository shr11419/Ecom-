// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyC14Lo_XbQAOhRC_-jC_6Egtc970BvrNJw",
  authDomain: "shophub-b450a.firebaseapp.com",
  projectId: "shophub-b450a",
  storageBucket: "shophub-b450a.firebasestorage.app",
  messagingSenderId: "479082605990",
  appId: "1:479082605990:web:0ca7052f6f92a9ee223367",
  measurementId: "G-8715YTY7EM"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);