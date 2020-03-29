import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import "firebase/auth";

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "viral-quiz-b0207.firebaseapp.com",
  databaseURL: "https://viral-quiz-b0207.firebaseio.com",
  projectId: "viral-quiz-b0207",
  storageBucket: "viral-quiz-b0207.appspot.com",
  messagingSenderId: "1014055753599",
  appId: "1:1014055753599:web:6f390268d765f87a8bec4a",
  measurementId: "G-CMMX8R8S0D"
};

firebase.initializeApp(config);

export const onAuthStateChange = callback => {
  return firebase.auth().onAuthStateChanged(user => {
    if (user) {
      callback({ loggedIn: true, uid: user.uid });
    } else {
      callback({ loggedIn: false });
    }
  });
};

export const login = async (method, username = null, password = null) => {
  let response = null;

  if (username && password) {
    try {
      response = await firebase
        .auth()
        .signInWithEmailAndPassword(username, password);
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  } else {
    try {
      const provider =
        method === "google"
          ? new firebase.auth.GoogleAuthProvider()
          : new firebase.auth.FacebookAuthProvider();

      response = await firebase.auth().signInWithPopup(provider);
    } catch (error) {
      console.log(error);

      throw new Error(error.message);
    }
  }

  return response;
};

export const logout = () => {
  firebase.auth().signOut();
};

export default firebase;
