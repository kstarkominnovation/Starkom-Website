// firebase.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Your config
const firebaseConfig = {
  apiKey: "AIzaSyBaIDs25Cys7_n3xADWIKNfF2W32KEWje4",
  authDomain: "k-starkom-web.firebaseapp.com",
  projectId: "k-starkom-web",
  storageBucket: "k-starkom-web.firebasestorage.app",
  messagingSenderId: "636088955972",
  appId: "1:636088955972:web:2c6e8691777f1be3ca3811",
  measurementId: "G-M2GQFR4VT5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ✅ EXPORT THESE
export { db, collection, getDocs };