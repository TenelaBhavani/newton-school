import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAz0PI3pj9c6XazhM4ZanZ7JT6YGfIA7J4",
  authDomain: "newton-em-web.firebaseapp.com",
  projectId: "newton-em-web",
  storageBucket: "newton-em-web.firebasestorage.app",
  messagingSenderId: "779357293142",
  appId: "1:779357293142:web:3b5de91c40e2fbf04809f7",
  measurementId: "G-LTYV4NLWF8",
};

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);

export const ADMIN_EMAIL = "admin@newtonschool.com";
