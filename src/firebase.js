import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database"

const firebaseConfig = {
    apiKey: "AIzaSyDE54dXy2Q9I73P4EepVWxbk3DAtUb2CUA",
    authDomain: "event-6a2aa.firebaseapp.com",
    databaseURL: "https://event-6a2aa-default-rtdb.firebaseio.com/",
    projectId: "event-6a2aa"
  };

firebase.initializeApp(firebaseConfig)



export default firebase;

