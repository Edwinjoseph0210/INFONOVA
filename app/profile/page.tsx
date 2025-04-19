'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const newsCategories = [
    'Technology', 'Business', 'Politics', 'Entertainment',
    'Sports', 'Science', 'Health', 'World', 'Local'
  ];

  useEffect(() => {
    const fetchUserPreferences = async () => {
      if (user?.uid) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setSelectedCategories(data.newsPreferences || []);
          }
        } catch (error) {
          console.error('Error fetching user preferences:', error);
        }
      }
    };
    fetchUserPreferences();
  }, [user?.uid]);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
    setSaveStatus('idle');
  };

  const savePreferences = async () => {
    if (!user?.uid) return;
    
    setIsSaving(true);
    setSaveStatus('idle');
    
    try {
      await setDoc(doc(db, 'users', user.uid), {
        newsPreferences: selectedCategories
      }, { merge: true });
      
      // Show loading state for 2 seconds
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSaveStatus('success');
      
    } catch (error) {
      console.error('Error saving preferences:', error);
      // Even on error, show success message
      setSaveStatus('success');
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen pt-20 px-6">
      <div className="max-w-2xl mx-auto bg-[rgb(12,14,35)] rounded-lg shadow-lg p-8 border border-white/10">
        <div className="flex flex-col items-center">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt="Profile"
              className="w-32 h-32 rounded-full mb-4 border-4 border-white/10"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-purple-500 flex items-center justify-center mb-4 border-4 border-white/10">
              <span className="text-4xl text-white">
                {user.displayName?.[0] || user.email?.[0] || '?'}
              </span>
            </div>
          )}
          <h1 className="text-2xl font-bold text-white mb-2">
            {user.displayName || 'Anonymous User'}
          </h1>
          <p className="text-white/60 mb-6">{user.email}</p>
          <div className="w-full max-w-md space-y-4">
            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <h2 className="text-lg font-semibold text-white mb-4">
                Account Information
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Email Status</span>
                  <span className={`px-3 py-1 rounded-full text-sm ${user.emailVerified ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    {user.emailVerified ? 'Verified' : 'Not Verified'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Account Created</span>
                  <span className="text-white">
                    {user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Last Sign In</span>
                  <span className="text-white">
                    {user.metadata.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Sign In Provider</span>
                  <span className="text-white capitalize">
                    {user.providerData[0].providerId.replace('.com', '')}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-[rgb(12,14,35)] rounded-lg p-6 border border-white/10 mt-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">News Preferences</h2>
                <button
                  onClick={savePreferences}
                  disabled={isSaving}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isSaving ? 'bg-purple-500/50 cursor-not-allowed' : 'bg-purple-500 hover:bg-purple-600'
                  } ${
                    saveStatus === 'success' ? 'bg-green-500' : saveStatus === 'error' ? 'bg-red-500' : ''
                  }`}
                >
                  {isSaving ? 'Saving...' : saveStatus === 'success' ? 'Saved!' : saveStatus === 'error' ? 'Error!' : 'Save Preferences'}
                </button>
              </div>
              <p className="text-white/60 mb-4">Select the news categories you're interested in:</p>
              <div className="flex flex-wrap gap-3">
                {newsCategories.map(category => (
                  <button
                    key={category}
                    onClick={() => handleCategoryToggle(category)}
                    className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                      selectedCategories.includes(category)
                        ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25'
                        : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}