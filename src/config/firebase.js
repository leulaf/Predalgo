// Import the functions you need from the SDKs you need
// import firebase from 'firebase/app';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/firestore';
import { getStorage, ref, deleteObject } from "firebase/storage";
// import {
//     initializeAuth,
//     getReactNativePersistence
// } from 'firebase/auth/react-native';
import {
    initializeAuth,
    getReactNativePersistence
} from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";
import { getFirestore, connectFirestoreEmulator, initializeFirestore } from "firebase/firestore";
import { FIREBASE_API_KEY, FIREBASE_AUTH_DOMAIN, FIREBASE_PROJECT_ID, FIREBASE_STORAGE_BUCKET, FIREBASE_MESSAGING_SENDER_ID, FIREBASE_APP_ID, FIREBASE_MEASUREMENT_ID } from "@env";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: FIREBASE_API_KEY,
    authDomain: FIREBASE_AUTH_DOMAIN,
    projectId: FIREBASE_PROJECT_ID,
    storageBucket: FIREBASE_STORAGE_BUCKET,
    messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
    appId: FIREBASE_APP_ID,
    measurementId: FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
let Firebase
if (firebase.apps.length == 0) {
    Firebase = firebase.initializeApp(firebaseConfig);
} else {
    Firebase = firebase.app(); // if already initialized, use that one
}


// const analytics = getAnalytics(Firebase);

// initialize auth
const auth = initializeAuth(Firebase, {
    persistence: getReactNativePersistence(AsyncStorage)
});

initializeFirestore(Firebase, {
    ignoreUndefinedProperties: true
});

const db = getFirestore(Firebase);

// Create a root reference
const storage = getStorage(Firebase);


export {Firebase, firebase, auth, db, storage, ref, deleteObject};
