import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Public web configuration (safe to be visible in the browser).
// Real protection comes from Firebase Security Rules, not from hiding these.
const firebaseConfig = {
  apiKey: "AIzaSyDb1mZe79RkNZmyYB8h98AqvQvdcsyC_Nc",
  authDomain: "followup-app-ro.firebaseapp.com",
  projectId: "followup-app-ro",
  storageBucket: "followup-app-ro.firebasestorage.app",
  messagingSenderId: "347609077160",
  appId: "1:347609077160:web:7acad4c8df2236ecc2b99d",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
