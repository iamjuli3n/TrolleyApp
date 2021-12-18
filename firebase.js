import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC_O8PXgtFdPsvn1WJ_OSyVpnZshix5w8U",
    authDomain: "uber-next-clone-5a955.firebaseapp.com",
    projectId: "uber-next-clone-5a955",
    storageBucket: "uber-next-clone-5a955.appspot.com",
    messagingSenderId: "802095274211",
    appId: "1:802095274211:web:c00e548cd332071bc18dd6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
const auth = getAuth();

export { app, provider, auth };