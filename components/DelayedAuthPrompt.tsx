"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";

export default function DelayedAuthPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [progress, setProgress] = useState(0);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      const duration = 5000; // 5 seconds delay
      const interval = 50; // Update progress every 50ms
      const steps = duration / interval;
      let currentStep = 0;

      const progressTimer = setInterval(() => {
        currentStep++;
        setProgress((currentStep / steps) * 100);
        
        if (currentStep >= steps) {
          clearInterval(progressTimer);
          setShowPrompt(true);
        }
      }, interval);

      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, duration);

      return () => {
        clearTimeout(timer);
        clearInterval(progressTimer);
      };
    }
  }, [user]);

  const handleClose = () => setShowPrompt(false);

  const handleAuth = (isSignUp: boolean = false) => {
    router.push(`/auth${isSignUp ? "?signup=true" : ""}`);
    setShowPrompt(false);
  };

  if (user) return null;

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-8 right-8 z-[9999] w-full max-w-lg"
        >
          <div className="relative">
            <div
              className="relative rounded-2xl overflow-hidden border border-white/10 p-6 backdrop-blur-xl"
              style={{
                background: "rgb(4,7,29)",
                backgroundColor:
                  "linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)",
                boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.25)"
              }}
            >
              <div className="relative z-10">
                <button
                  onClick={handleClose}
                  aria-label="Close prompt"
                  className="absolute top-4 right-4 text-white/40 hover:text-white/90 transition-colors duration-200"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>

                <h3 className="text-xl font-bold text-white mb-2">
                  Join our community!
                </h3>
                <p className="text-white/60 mb-6">
                  Sign in to access exclusive features and personalized content.
                </p>

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAuth()}
                    className="flex-1 py-2.5 px-4 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200"
                  >
                    Sign In
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAuth(true)}
                    className="flex-1 py-2.5 px-4 bg-white/5 text-white rounded-lg font-medium hover:bg-white/10 border border-white/10 transition-colors duration-200"
                  >
                    Sign Up
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}