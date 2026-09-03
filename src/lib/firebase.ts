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
  signInWithRedirect,
  getRedirectResult,
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

export const loginWithGoogle = async (): Promise<{ user: any; isSimulated?: boolean }> => {
  try {
    // Attempt standard Google Popup login
    const result = await signInWithPopup(auth, googleProvider);
    if (result && result.user) {
      return { user: result.user };
    }
  } catch (error: any) {
    console.warn("Google popup sign-in encountered an issue (likely browser popup restriction in iframe):", error?.code, error?.message);
    
    // Check if error is popup-blocked or unauthorized domain in dev iframe
    if (
      error?.code === 'auth/popup-blocked' || 
      error?.code === 'auth/popup-closed-by-user' ||
      error?.code === 'auth/cancelled-popup-request' ||
      error?.code === 'auth/unauthorized-domain' ||
      error?.code === 'auth/operation-not-supported-in-this-environment'
    ) {
      // If we are in an iframe or redirect is viable, try redirect or fallback
      try {
        if (window.self === window.top) {
          // Not in an iframe, try redirect
          await signInWithRedirect(auth, googleProvider);
          return { user: null };
        }
      } catch (redirectErr) {
        console.warn("Redirect sign-in error:", redirectErr);
      }
    }
    
    throw error;
  }
  return { user: null };
};

export const checkRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (result && result.user) {
      return result.user;
    }
  } catch (err) {
    console.warn("Error checking redirect result:", err);
  }
  return null;
};

export const logoutGoogle = async () => {
  try {
    await fbSignOut(auth);
  } catch (error) {
    console.error("Sign-out error:", error);
  }
};

