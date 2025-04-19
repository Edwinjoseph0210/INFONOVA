'use client';

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { auth, db } from "@/lib/firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  fetchSignInMethodsForEmail,
  sendPasswordResetEmail
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import Image from "next/image";

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const signup = searchParams.get("signup");
    if (signup === "true") {
      setIsSignUp(true);
    }

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        router.push("/");
      }
    };

    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [searchParams, router]);

  const checkUsername = async (username: string) => {
    if (!username) {
      setUsernameError("Username is required");
      return false;
    }
    
    if (username.length < 3) {
      setUsernameError("Username must be at least 3 characters long");
      return false;
    }
    
    setIsCheckingUsername(true);
    try {
      if (!db) {
        console.error("Firestore is not initialized");
        setUsernameError("Service is temporarily unavailable. Please try again later.");
        return false;
      }

      const usernameDoc = await getDoc(doc(db, "usernames", username.toLowerCase()));
      if (usernameDoc.exists()) {
        setUsernameError("This username is already taken");
        return false;
      } else {
        setUsernameError("");
        return true;
      }
    } catch (error: any) {
      console.error("Error checking username:", error);
      if (error.code === 'permission-denied') {
        setUsernameError("Unable to check username. Please check your connection.");
      } else if (error.code === 'unavailable') {
        setUsernameError("Service is temporarily unavailable. Please try again later.");
      } else {
        setUsernameError("Error checking username availability. Please try again.");
      }
      return false;
    } finally {
      setIsCheckingUsername(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (username && isSignUp) {
        checkUsername(username);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [username, isSignUp]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      if (isSignUp) {
        if (!username) {
          setUsernameError("Username is required");
          return;
        }

        const isUsernameAvailable = await checkUsername(username);
        if (!isUsernameAvailable) {
          return;
        }

        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          
          await setDoc(doc(db, "usernames", username.toLowerCase()), {
            uid: userCredential.user.uid,
            username: username,
            createdAt: new Date().toISOString()
          });

          await updateProfile(userCredential.user, {
            displayName: username
          });
          
          router.push("/");
        } catch (error: any) {
          if (error.code === 'auth/email-already-in-use') {
            try {
              const methods = await fetchSignInMethodsForEmail(auth, email);
              if (methods.includes('google.com')) {
                setError("This email is registered with Google. Please use 'Continue with Google' to sign in.");
              } else {
                setError("This email is already registered. Would you like to sign in instead?");
                setTimeout(() => {
                  setIsSignUp(false);
                  setError("");
                }, 3000);
              }
            } catch (methodError) {
              setError("This email is already registered. Please try signing in.");
            }
          } else {
            setError(error.message || "An error occurred during sign up");
          }
          return;
        }
      } else {
        try {
          const methods = await fetchSignInMethodsForEmail(auth, email);

          if (methods.includes('google.com') && !methods.includes('password')) {
            setError("This email is registered with Google. Please use 'Continue with Google' to sign in.");
            return;
          }

          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          
          if (userCredential.user) {
            router.push("/");
          } else {
            setError("Failed to get user data after sign in");
          }
        } catch (error: any) {
          if (error.code === 'auth/invalid-credential' || error.code === 'auth/invalid-email' || error.code === 'auth/wrong-password') {
            setError("Invalid email or password. Please try again.");
          } else if (error.code === 'auth/user-not-found') {
            setError("No account found with this email. Please sign up first.");
          } else if (error.code === 'auth/too-many-requests') {
            setError("Too many failed attempts. Please try again later.");
          } else {
            setError(error.message || "An error occurred during sign in");
          }
          return;
        }
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      setError(error.message || "An error occurred during authentication");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        router.push("/");
      }
    } catch (error: any) {
      console.error("Google sign in error:", error);
      if (error.code === 'auth/popup-closed-by-user') {
        setError("Sign in cancelled. Please try again.");
      } else if (error.code === 'auth/popup-blocked') {
        setError("Pop-up blocked. Please allow pop-ups for this site.");
      } else {
        setError(error.message || "An error occurred during Google sign in");
      }
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setIsResetting(true);
    setError("");

    try {
      await sendPasswordResetEmail(auth, email);
      setResetEmailSent(true);
      setError("");
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        setError("No account found with this email address");
      } else if (error.code === 'auth/invalid-email') {
        setError("Invalid email address");
      } else {
        setError("Failed to send reset email. Please try again.");
      }
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[rgb(4,7,29)] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {isSignUp ? "Create your account" : "Sign in to your account"}
          </h1>
          <p className="text-gray-400">
            {isSignUp
              ? "Join our community and start exploring"
              : "Welcome back! Please enter your details"}
          </p>
        </div>

        <div className="bg-[rgb(12,14,35)] rounded-xl p-8 shadow-xl border border-white/10">
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-600 rounded-lg text-white hover:bg-white/5 transition-colors mb-6"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[rgb(12,14,35)] text-gray-400">Or continue with</span>
            </div>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Username</label>
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg bg-[rgb(24,26,45)] border ${usernameError ? 'border-red-500' : 'border-gray-600'} text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors`}
                />
                {usernameError && (
                  <p className="mt-1 text-sm text-red-500">{usernameError}</p>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-[rgb(24,26,45)] border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-[rgb(24,26,45)] border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </div>
              {!isSignUp && (
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={isResetting}
                  className="mt-2 text-sm text-purple-500 hover:text-purple-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isResetting ? "Sending reset link..." : resetEmailSent ? "Reset link sent! Check your email" : "Forgot password?"}
                </button>
              )}
            </div>

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-purple-500 text-white py-3 rounded-lg hover:bg-purple-600 transition-colors"
            >
              {isSignUp ? "Sign up" : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-400">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError("");
                setUsernameError("");
                setResetEmailSent(false);
              }}
              className="text-purple-500 hover:text-purple-400 transition-colors"
            >
              {isSignUp ? "Sign in" : "Sign up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}