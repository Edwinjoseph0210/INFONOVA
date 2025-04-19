import { initializeApp, getApps } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyAxgwRbJ8j35oyeQuG3Nnca3dEXPxoBR9g",
  authDomain: "news-a97d6.firebaseapp.com",
  projectId: "news-a97d6",
  storageBucket: "news-a97d6.firebasestorage.app",
  messagingSenderId: "813787195573",
  appId: "1:813787195573:web:ab3002b3e17da582a6b6fc",
  measurementId: "G-C9TH7VPB35"
};

export function initFirebase() {
  if (!getApps().length) {
    const app = initializeApp(firebaseConfig);
    // Only initialize analytics if window is available (client-side)
    if (typeof window !== 'undefined') {
      getAnalytics(app);
    }
    return app;
  }
  return getApps()[0];
} 