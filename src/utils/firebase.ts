// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDuDQ0DP-sR_pryjy7sDRYdkO2JvLh7VuY",
  authDomain: "vue-webcam-recorder.firebaseapp.com",
  projectId: "vue-webcam-recorder",
  storageBucket: "vue-webcam-recorder.appspot.com",
  messagingSenderId: "939233469597",
  appId: "1:939233469597:web:73ed17aa4027f4167b6074",
  measurementId: "G-Y2HK6BEPWB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

import { getStorage} from 'firebase/storage';
const storage = getStorage(app);

export { storage };