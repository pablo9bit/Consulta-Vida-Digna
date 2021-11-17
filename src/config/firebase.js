import firebase from "firebase";


const config = {
  apiKey: "AIzaSyC0I-RcDD2eioxkc3jenBnuWn_VMfv7o60",
  authDomain: "vida-digna-cba-gov-ar.firebaseapp.com",
  databaseURL: "https://vida-digna-cba-gov-ar-default-rtdb.firebaseio.com",
  projectId: "vida-digna-cba-gov-ar",
  storageBucket: "vida-digna-cba-gov-ar.appspot.com",
  messagingSenderId: "785081488749",
  appId: "1:785081488749:web:560efa96edba8ee51ff664",
  measurementId: "G-YQB93GTLCS"
}; 


firebase.initializeApp(config);

export default firebase;
