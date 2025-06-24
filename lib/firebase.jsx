
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyDLxymMrJfhRegnfyCpAfZ7vOIIhb-MCrE",
    authDomain: "nutrition-bar.firebaseapp.com",
    projectId: "nutrition-bar",
    storageBucket: "nutrition-bar.firebasestorage.app",
    messagingSenderId: "664138542262",
    appId: "1:664138542262:web:444dbd6839e47ae5fe0a17"
  };

  export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const analytics = isSupported().then((yes) =>
  yes ? getAnalytics(app) : null
);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

