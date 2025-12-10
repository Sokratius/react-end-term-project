import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCh_ylYzCq4uuDBBtAH_A7Xlq5YgAEiUoo",
  authDomain: "cinestream-pro-14dc7.firebaseapp.com",
  projectId: "cinestream-pro-14dc7",
  storageBucket: "cinestream-pro-14dc7.firebasestorage.app",
  messagingSenderId: "261532809572",
  appId: "1:261532809572:web:730cd10e43b4a88128e271"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);