// /config/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyAvGYpE3STNTeGgafQvpPXnm-R7OK046-0",
    authDomain: "competition-d9722.firebaseapp.com",
    projectId: "competition-d9722",
    storageBucket: "competition-d9722.appspot.com",
    messagingSenderId: "839273917273",
    appId: "1:839273917273:web:9c52726aa02c9e48bd7a48",
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
