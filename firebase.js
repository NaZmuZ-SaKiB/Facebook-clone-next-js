import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
    apiKey: "AIzaSyDkKFWz1QRe1mH5j4cldEuqMMdS-Ijhf1Y",
    authDomain: "facebook-clone-next-f05e7.firebaseapp.com",
    projectId: "facebook-clone-next-f05e7",
    storageBucket: "facebook-clone-next-f05e7.appspot.com",
    messagingSenderId: "866550727788",
    appId: "1:866550727788:web:6734dcac516968b1b08449"
  };

  const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

  const db = app.firestore();
  const storage = firebase.storage();

  export { db, storage };
