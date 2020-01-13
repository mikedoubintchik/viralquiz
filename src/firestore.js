import firebase from "firebase/app";
import "firebase/firestore";

const config = {
  apiKey: "AIzaSyB33nY1cip10MWGPM3WoJO6BMw7n25JC2s",
  authDomain: "viral-quiz-b0207.firebaseapp.com",
  databaseURL: "https://viral-quiz-b0207.firebaseio.com",
  projectId: "viral-quiz-b0207",
  storageBucket: "viral-quiz-b0207.appspot.com",
  messagingSenderId: "1014055753599",
  appId: "1:1014055753599:web:6f390268d765f87a8bec4a",
  measurementId: "G-CMMX8R8S0D"
};

firebase.initializeApp(config);

export default firebase;
