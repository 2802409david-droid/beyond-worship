// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";       // <--- Agregado
import { getFirestore } from "firebase/firestore"; // <--- Agregado

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDUHltTw4w-1WC_9d9Ohkl1Ys2gHVsm0Xo",
  authDomain: "alabanzaapp.firebaseapp.com",
  projectId: "alabanzaapp",
  storageBucket: "alabanzaapp.firebasestorage.app",
  messagingSenderId: "84487392583",
  appId: "1:84487392583:web:f95defc1aed60db0c5d062",
  measurementId: "G-KGKRKKB9QQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Exportar los servicios que tus archivos necesitan
export const auth = getAuth(app);
export const db = getFirestore(app);