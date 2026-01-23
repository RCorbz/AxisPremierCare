import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDsvgF0AGP9wwVHNLHuJLJfmaiuB-SvBZw",
    authDomain: "axis-premier-care.firebaseapp.com",
    projectId: "axis-premier-care",
    storageBucket: "axis-premier-care.firebasestorage.app",
    messagingSenderId: "204334100130",
    appId: "1:204334100130:web:61ff3358259002949631fb",
    measurementId: "G-81QNRXQ5HT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
