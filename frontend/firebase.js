// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "zesto-9d61f.firebaseapp.com",
  projectId: "zesto-9d61f",
  storageBucket: "zesto-9d61f.firebasestorage.app",
  messagingSenderId: "385588157932",
  appId: "1:385588157932:web:1e27214f9704f86a0a34c9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth=getAuth(app)

//expoert both app and auth
export {app, auth}