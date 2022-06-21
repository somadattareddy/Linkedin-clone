import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAgl9uXRnps8HORs97_ftxpuOTiLO_W8SY",
    authDomain: "linkedin-78806.firebaseapp.com",
    projectId: "linkedin-78806",
    storageBucket: "linkedin-78806.appspot.com",
    messagingSenderId: "420406334551",
    appId: "1:420406334551:web:4b4adfd7ce6504b544bf12"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();

export { db, auth };