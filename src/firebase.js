// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB5OeWz86qi2RrdDAB4-aA69vZlY133B70",
  authDomain: "react-b9eba.firebaseapp.com",
  databaseURL: "https://react-b9eba-default-rtdb.firebaseio.com",
  projectId: "react-b9eba",
  storageBucket: "react-b9eba.firebasestorage.app",
  messagingSenderId: "615751486008",
  appId: "1:615751486008:web:b9a9ab412637c5cd70f4cd",
  measurementId: "G-4MD01WE4R6"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
//test