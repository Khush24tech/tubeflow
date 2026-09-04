import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  Auth,
  User 
} from 'firebase/auth';

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCwDkRcPjHE3ptPGpjd6BS2C5z57aYB39s",
  authDomain: "tubeflow-21845.firebaseapp.com",
  projectId: "tubeflow-21845",
  storageBucket: "tubeflow-21845.firebasestorage.app",
  messagingSenderId: "1034302339334",
  appId: "1:1034302339334:web:b396dd62ea14c5e2074687",
  measurementId: "G-9ZHL13FNPP"
};

// Safely initialize Firebase App singleton without crashing the app
let appInstance: FirebaseApp | null = null;
try {
  appInstance = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
} catch (err) {
  console.warn('Firebase App initialization warning:', err);
}
export const app = appInstance;

// Safely initialize Firebase Authentication
let authInstance: Auth | null = null;
if (appInstance) {
  try {
    authInstance = getAuth(appInstance);
  } catch (err) {
    console.warn('Firebase Auth initialization warning:', err);
  }
}
export const auth = authInstance;

// Configure Google OAuth Provider
export const googleProvider = new GoogleAuthProvider();
try {
  googleProvider.setCustomParameters({
    prompt: 'select_account'
  });
} catch {}

// Google OAuth Sign In with Popup
export async function signInWithGoogle(): Promise<User> {
  if (!auth) {
    throw new Error('Authentication is currently unavailable. Please refresh or try again later.');
  }
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.error('Google Sign-In Error:', error);
    throw error;
  }
}

// Email/Password Sign In
export async function signInWithEmail(email: string, pass: string): Promise<User> {
  if (!auth) {
    throw new Error('Authentication is currently unavailable. Please refresh or try again later.');
  }
  const result = await signInWithEmailAndPassword(auth, email, pass);
  return result.user;
}

// Email/Password Sign Up with optional display name
export async function signUpWithEmail(email: string, pass: string, displayName?: string): Promise<User> {
  if (!auth) {
    throw new Error('Authentication is currently unavailable. Please refresh or try again later.');
  }
  const result = await createUserWithEmailAndPassword(auth, email, pass);
  if (displayName && result.user) {
    try {
      await updateProfile(result.user, { displayName });
    } catch {}
  }
  return result.user;
}

// Sign out current user
export async function logOut(): Promise<void> {
  if (!auth) return;
  await firebaseSignOut(auth);
}

// Helper to observe auth state with robust error handling
export function subscribeToAuth(callback: (user: User | null) => void): () => void {
  if (!auth) {
    callback(null);
    return () => {};
  }
  try {
    const unsubscribe = onAuthStateChanged(
      auth, 
      (user) => {
        callback(user);
      },
      (error) => {
        console.warn('Firebase Auth state listener error:', error);
        callback(null);
      }
    );
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  } catch (err) {
    console.warn('Failed to attach auth state listener:', err);
    callback(null);
    return () => {};
  }
}

