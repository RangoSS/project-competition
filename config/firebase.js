// /config/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyAZaZMp2CEPQQyuRUG0zPNXd0SyaChTwJc",
    authDomain: "hotel-project-5dc93.firebaseapp.com",
    projectId: "hotel-project-5dc93",
    storageBucket: "hotel-project-5dc93.appspot.com",
    messagingSenderId: "1041628659171",
    appId: "1:1041628659171:web:af3d439a114c0759ce34d6",
    measurementId: "G-5LYEECGSPC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);


console.log("Firebase initialized successfully:");
console.log("Firebase App:", app);
console.log("Firebase Auth:", auth);
console.log("Firebase Firestore:", db);
console.log("Firebase Storage:", storage);

export { auth, db, storage };

// Import the functions you need from the SDKs you need
