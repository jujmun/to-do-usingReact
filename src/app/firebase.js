// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC40ZwH6HhKZEr8w12w2iffatTe97igZqM",
  authDomain: "todo-react-88d6b.firebaseapp.com",
  projectId: "todo-react-88d6b",
  storageBucket: "todo-react-88d6b.appspot.com",
  messagingSenderId: "528186141285",
  appId: "1:528186141285:web:f0e7bd3b6a294b5b37f48c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);