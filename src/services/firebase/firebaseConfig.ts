import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCqKioE_1eeepIANnNCvr6fODCpsX74cKo",
  authDomain: "premail-app.firebaseapp.com",
  projectId: "premail-app",
  storageBucket: "premail-app.firebasestorage.app",
  messagingSenderId: "716385265566",
  appId: "1:716385265566:web:ea1667a25e14a83546188f",
  measurementId: "G-S85JT637X0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
