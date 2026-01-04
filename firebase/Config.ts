import { initializeApp } from 'firebase/app'
import { getFirestore, Firestore,collection,addDoc,orderBy,serverTimestamp,query,onSnapshot,doc,deleteDoc } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig);
const firestore: Firestore = getFirestore(app);

const GAMES: string = 'games'

export { 
    firestore,
    collection,
    addDoc,
    GAMES,
    orderBy,
    serverTimestamp,
    query,
    onSnapshot,
    doc,
    deleteDoc
}