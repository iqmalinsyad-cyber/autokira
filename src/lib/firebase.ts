import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  setDoc,
  enableIndexedDbPersistence
} from 'firebase/firestore';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as fbSignOut, 
  onAuthStateChanged,
  User
} from 'firebase/auth';

export const firebaseConfig = {
  apiKey: "AIzaSyDoqzlqifrHbbBYviaYGhQh-QUoFqRw6Iw",
  authDomain: "docuvault-v2.firebaseapp.com",
  projectId: "docuvault-v2",
  storageBucket: "docuvault-v2.firebasestorage.app",
  messagingSenderId: "734492192690",
  appId: "1:734492192690:web:71bfe7f1ae0fd47c6b3eab"
};

// Initialize Firebase safely
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const loginWithGoogle = async (): Promise<User | null> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.warn("Google popup sign-in encountered an issue or was blocked by iframe/cross-origin:", error);
    throw error;
  }
};

export const logoutGoogle = async () => {
  try {
    await fbSignOut(auth);
  } catch (error) {
    console.error("Sign-out error:", error);
  }
};
