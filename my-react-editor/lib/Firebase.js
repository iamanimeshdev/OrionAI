// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "APIKEY",
  authDomain: "orionai-27173.firebaseapp.com",
  projectId: "orionai-27173",
  storageBucket: "orionai-27173.firebasestorage.app",
  messagingSenderId: "379590678691",
  appId: "1:379590678691:web:2c236dddd9bf8780364716",
  measurementId: "G-MRX736EXF6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
