import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC0iztPjGpuUgh0TBi5vILvlVMij4MBoEY",
  authDomain: "note-app-5d8f7.firebaseapp.com",
  projectId: "note-app-5d8f7",
  storageBucket: "note-app-5d8f7.appspot.com",
  messagingSenderId: "255766300144",
  appId: "1:255766300144:web:dffe4e449cf228b0778935",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
