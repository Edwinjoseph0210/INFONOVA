import { getApps } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { initFirebase } from './initFirebase';

// Initialize Firebase
const app = initFirebase();

const auth = getAuth(app);
const db = getFirestore(app);

// Set persistence to local to maintain the session
try {
  setPersistence(auth, browserLocalPersistence);
  console.log('Auth persistence set successfully');
} catch (error) {
  console.error('Error setting auth persistence:', error);
}

// Listen to auth state changes
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('User logged in:', user.email);
  } else {
    console.log('User logged out');
  }
});

export { auth, db };