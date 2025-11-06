// Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
  import { getDatabase } from "firebase/database";


  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyDnoqRRMb_EdpGeODr9jPtZ4w5c4Usbq3E",
    authDomain: "holy-sheet-7b060.firebaseapp.com",
    projectId: "holy-sheet-7b060",
    storageBucket: "holy-sheet-7b060.firebasestorage.app",
    messagingSenderId: "736446386603",
    appId: "1:736446386603:web:fd422e498600bb7effc2ee"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const database = getDatabase();