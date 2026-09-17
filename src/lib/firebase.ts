import { initializeApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  getDocs, 
  writeBatch,
  serverTimestamp,
  Firestore
} from 'firebase/firestore';
import rawFirebaseConfig from '../../firebase-applet-config.json';

const metaEnv = typeof import.meta !== 'undefined' ? (import.meta as any).env : {};

// Support both static configuration file and optional Vercel / Vite environment variables
const resolvedConfig = {
  apiKey: metaEnv?.VITE_FIREBASE_API_KEY || rawFirebaseConfig.apiKey,
  authDomain: metaEnv?.VITE_FIREBASE_AUTH_DOMAIN || rawFirebaseConfig.authDomain,
  projectId: metaEnv?.VITE_FIREBASE_PROJECT_ID || rawFirebaseConfig.projectId,
  storageBucket: metaEnv?.VITE_FIREBASE_STORAGE_BUCKET || rawFirebaseConfig.storageBucket,
  messagingSenderId: metaEnv?.VITE_FIREBASE_MESSAGING_SENDER_ID || rawFirebaseConfig.messagingSenderId,
  appId: metaEnv?.VITE_FIREBASE_APP_ID || rawFirebaseConfig.appId,
  firestoreDatabaseId: metaEnv?.VITE_FIREBASE_DATABASE_ID || (rawFirebaseConfig as any).firestoreDatabaseId
};

// Initialize Firebase App singleton
export const app = !getApps().length ? initializeApp(resolvedConfig) : getApps()[0];
export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Initialize Firestore with custom databaseId if configured
export const db: Firestore = resolvedConfig.firestoreDatabaseId
  ? getFirestore(app, resolvedConfig.firestoreDatabaseId)
  : getFirestore(app);

export type { FirebaseUser };
