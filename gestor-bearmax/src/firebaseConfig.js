// Importa las funciones que necesitas de los SDKs de Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Configuración de Firebase
const firebaseConfig = {

    apiKey: "AIzaSyAbWAZkxCRRbVha34CW3ErDslK7YeqThkc",

    authDomain: "bear-max.firebaseapp.com",

    projectId: "bear-max",

    storageBucket: "bear-max.appspot.com",

    messagingSenderId: "751334020181",

    appId: "1:751334020181:web:ced30cf4a44217b7a0b0dc",

    measurementId: "G-62EM8ZRN00"

  };

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa Firestore
const db = getFirestore(app);

// Inicializa Auth
const auth = getAuth(app);

export { db, auth };
