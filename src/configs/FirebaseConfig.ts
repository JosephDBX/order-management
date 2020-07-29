import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC7z4ymEA6fsGaPNMUsDuW0ChSXdnSi1r4",
  authDomain: "lcbm-nicaragua.firebaseapp.com",
  databaseURL: "https://lcbm-nicaragua.firebaseio.com",
  projectId: "lcbm-nicaragua",
  storageBucket: "lcbm-nicaragua.appspot.com",
  messagingSenderId: "698302161223",
  appId: "1:698302161223:web:30163af8246e378d05ec62",
  measurementId: "G-KWZSKGMCPE",
};

firebase.initializeApp(firebaseConfig);
firebase.firestore();

export default firebase;
