import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAMQaHYi2vG0Bxpssieha_8OMX8oLnuUyU",
  authDomain: "kimtaehyun-calender-33576.firebaseapp.com",
  projectId: "kimtaehyun-calender-33576",
  storageBucket: "kimtaehyun-calender-33576.firebasestorage.app",
  messagingSenderId: "113071685421",
  appId: "1:113071685421:web:e24b1ec3affb0a1ce89da4",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);