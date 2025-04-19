'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useEffect, useState } from 'react';

// Generate a random color for the avatar background
const getRandomColor = () => {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Avatar component
const UserAvatar = ({ user, onClick }: { user: any; onClick?: () => void }) => {
  const [imageError, setImageError] = useState(false);
  const photoURL = user.photoURL;
  const displayName = user.displayName || user.email;
  const initial = displayName ? displayName[0].toUpperCase() : '?';
  const bgColor = getRandomColor();

  // Reset image error state when photoURL changes
  useEffect(() => {
    setImageError(false);
  }, [photoURL]);

  return (
    <button
      onClick={onClick}
      className="w-10 h-10 rounded-full overflow-hidden focus:outline-none flex items-center justify-center relative inline-flex"
      style={{ cursor: 'pointer' }}
    >
      {photoURL && !imageError ? (
        <img 
          src={photoURL} 
          alt="Profile" 
          className="w-full h-full object-cover" 
          onError={() => setImageError(true)}
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className={`w-full h-full ${bgColor} flex items-center justify-center`}>
          <span className="text-white text-lg font-semibold">{initial}</span>
        </div>
      )}
    </button>
  );
};

export default function AuthButton() {
  const router = useRouter();
  const { user } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log("Sign out successful");
      router.push('/');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.profile-dropdown')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    console.log("AuthButton: Auth state changed:", user ? `User: ${user.email}` : "No user");
  }, [user]);

  if (user) {
    return (
      <div className="relative inline-block profile-dropdown z-50 h-10 w-10">
        <div className="relative z-50 h-full w-full">
          <UserAvatar user={user} onClick={() => setShowDropdown(!showDropdown)} />
          {showDropdown && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-[rgb(12,14,35)] rounded-lg shadow-lg border border-white/10 overflow-hidden z-50">
              <div className="p-4 border-b border-white/10">
                <p className="text-white font-medium">{user.displayName || user.email}</p>
                <p className="text-white/60 text-sm truncate">{user.email}</p>
              </div>
              <button
                onClick={() => router.push('/profile')}
                className="w-full px-4 py-3 text-left text-white hover:bg-white/5 transition-colors inline-flex items-center gap-2"
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span>Profile</span>
              </button>
              <button
                onClick={handleSignOut}
                className="w-full px-4 py-3 text-left text-white hover:bg-white/5 transition-colors inline-flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
                  />
                </svg>
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full flex items-center">
      <button
        type="button"
        onClick={() => router.push('/auth')}
        className="h-[45px] px-6 rounded-lg bg-[rgb(12,14,35)] text-white text-base font-medium shadow-lg hover:bg-[rgb(18,20,45)] transition-all inline-flex items-center justify-center gap-2 border border-white/10 cursor-pointer"
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
            d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
          />
        </svg>
        <span>Sign In</span>
      </button>
    </div>
  );
}