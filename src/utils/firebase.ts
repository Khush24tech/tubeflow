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
  sendEmailVerification,
  Auth,
  User 
} from 'firebase/auth';
import { validateEmail } from './emailValidator';

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
    if (result.user.email) {
      const val = validateEmail(result.user.email);
      if (!val.isValid) {
        await firebaseSignOut(auth);
        throw new Error(val.error || 'This email domain has been blocked due to suspicious or automated activity.');
      }
    }
    return result.user;
  } catch (error: any) {
    console.error('Google Sign-In Error:', error);
    throw error;
  }
}

// Email/Password Sign In (Existing user directed directly to account without re-confirming)
export async function signInWithEmail(email: string, pass: string): Promise<User> {
  if (!auth) {
    throw new Error('Authentication is currently unavailable. Please refresh or try again later.');
  }
  const cleanEmail = email.trim();
  const val = validateEmail(cleanEmail);
  if (!val.isValid) {
    throw new Error(val.error || 'Please enter a valid email address.');
  }
  const result = await signInWithEmailAndPassword(auth, cleanEmail, pass);
  return result.user;
}

// Email/Password Sign Up with verification email trigger
export async function signUpWithEmail(email: string, pass: string, displayName?: string): Promise<User> {
  if (!auth) {
    throw new Error('Authentication is currently unavailable. Please refresh or try again later.');
  }
  const cleanEmail = email.trim();
  const val = validateEmail(cleanEmail);
  if (!val.isValid) {
    throw new Error(val.error || 'Invalid or disposable email.');
  }

  const result = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
  if (displayName && result.user) {
    try {
      await updateProfile(result.user, { displayName });
    } catch {}
  }

  // Send email verification link immediately upon registration
  if (result.user) {
    try {
      await sendEmailVerification(result.user);
    } catch (verErr) {
      console.warn('Could not send verification email immediately:', verErr);
    }
  }

  return result.user;
}

// Resend verification email
export async function resendVerificationEmail(user: User): Promise<void> {
  if (!user) throw new Error('No user account provided.');
  await sendEmailVerification(user);
}

// Check if user has verified their email
export async function checkIsEmailVerified(user: User): Promise<boolean> {
  if (!user) return false;
  try {
    await user.reload();
    return user.emailVerified;
  } catch {
    return user.emailVerified;
  }
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

