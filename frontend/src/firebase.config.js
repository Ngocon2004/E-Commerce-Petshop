// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";


import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDpfvFHG7KPRe_nSDaB9l4qzIftbMznpQg",
  authDomain: "studio-1834158531-ea15a.firebaseapp.com",
  projectId: "studio-1834158531-ea15a",
  storageBucket: "studio-1834158531-ea15a.firebasestorage.app",
  messagingSenderId: "445404243155",
  appId: "1:445404243155:web:ee24341f76ffe47c9aa026"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;