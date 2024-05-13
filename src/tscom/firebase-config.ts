// src/firebase-config.ts
// import { initializeApp,getDatabase, Database  } from 'firebase/app';
import { initializeApp } from 'firebase/app';
import { getDatabase, Database } from 'firebase/database';


// import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js';
// import { getDatabase, Database } from 'https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js';

const firebaseConfig = {
    apiKey: "AIzaSyAhGVvIf7mvJZkSqCz2Cfs98oSWhZokLks",
    authDomain: "pure-wall-356711.firebaseapp.com",
    projectId: "pure-wall-356711",
    storageBucket: "pure-wall-356711.appspot.com",
    messagingSenderId: "530616305644",
    appId: "1:530616305644:web:c9069ac1f0285c10abe2c9",
    measurementId: "G-ZTME5HYJHL",
    databaseURL: 'https://pure-wall-356711-default-rtdb.asia-southeast1.firebasedatabase.app/'
  };
  

const app = initializeApp(firebaseConfig);
const db: Database = getDatabase(app);

export { db };
