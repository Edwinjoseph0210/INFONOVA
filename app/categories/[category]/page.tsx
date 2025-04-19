'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface NewsItem {
  headline: string;
  summary: string;
  url: string;
  source: string;
  timestamp: string;
  audio_url?: string;
}

const LoadingState = () => (
  <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
    <p className="text-white/70 text-sm animate-pulse">
      Loading news from multiple sources...
    </p>
  </div>
);

const NewsBox = ({ item }: { item: NewsItem }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const handleShare = async () => {
    try {
      await navigator.share({
        title: item.headline,
        text: item.summary,
        url: item.url
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
    setShowMenu(false);
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Save for later:', item.headline);
    setShowMenu(false);
  };

  // Remove these lines
  const [audioAvailable, setAudioAvailable] = useState<boolean | null>(null);
  
  // Remove the checkAudioAvailability function and its useEffect call
  const checkAudioAvailability = async () => {
    if (audioAvailable !== null) return; // Already checked
    
    const safeHeadline = item.headline
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');
    
    const audioUrl = `http://localhost:8003/static/${safeHeadline}.mp3`;
    
    try {
      const fileCheck = await fetch(audioUrl, { method: 'HEAD' });
      setAudioAvailable(fileCheck.ok);
    } catch (err) {
      setAudioAvailable(false);
    }
  };
  
  // Call this when component mounts
  useEffect(() => {
    checkAudioAvailability();
  }, []);
  
  // Simplify the audio handling
  const handleAudio = async () => {
    if (isAudioPlaying && audio) {
      audio.pause();
      setAudio(null);
      setIsAudioPlaying(false);
      return;
    }
    
    try {
      // Generate audio directly from the summary text using the Web Speech API
      const utterance = new SpeechSynthesisUtterance(item.summary);
      utterance.lang = 'en-US';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      
      // Set up event handlers
      utterance.onend = () => {
        setIsAudioPlaying(false);
      };
      
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setIsAudioPlaying(false);
      };
      
      // Start speaking
      window.speechSynthesis.speak(utterance);
      setIsAudioPlaying(true);
      
      // Store reference to cancel if needed
      setAudio({
        pause: () => {
          window.speechSynthesis.cancel();
        }
      } as any);
      
    } catch (err) {
      console.error('Failed to play audio:', err);
    }
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audio) {
        audio.pause();
        setAudio(null);
      }
    };
  }, [audio]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto mb-6 overflow-hidden"
    >
      <motion.div 
        whileHover={{ y: -5 }}
        className="backdrop-blur-md bg-white/[0.02] border border-white/[0.05] rounded-xl p-6 hover:bg-white/[0.04] transition-all duration-300 group relative shadow-lg"
      >
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold text-white/90 group-hover:text-white transition-colors duration-300">
            {item.headline}
          </h2>
          <div className="flex items-center gap-2">
            {/* Remove audio button from here */}
            <span className="text-sm text-white/40 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.05]">
              {item.source}
            </span>
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 hover:bg-white/10 rounded-full transition-colors duration-200"
              >
                <svg
                  className="w-5 h-5 text-white/60"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                </svg>
              </button>
              {showMenu && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-[rgb(12,14,35)] border border-white/10 z-50"
                >
                  <div className="py-1">
                    <button
                      onClick={handleShare}
                      className="w-full px-4 py-2 text-sm text-white/90 hover:bg-white/5 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      Share
                    </button>
                    <button
                      onClick={handleSave}
                      className="w-full px-4 py-2 text-sm text-white/90 hover:bg-white/5 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                      Save for later
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
        <p className="text-white/70 text-base leading-relaxed mb-4">
          {item.summary}
        </p>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            {/* Keep only this audio button */}
            <button
              onClick={handleAudio}
              className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors flex-shrink-0"
            >
              {isAudioPlaying ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                </svg>
              )}
            </button>
            <motion.a 
              whileHover={{ x: 3 }}
              href={item.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 transition-colors duration-300 text-sm flex items-center gap-2"
            >
              Read full article
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </motion.a>
            {/* Remove the conditional audio button that uses item.audio_url */}
          </div>
          <span className="text-white/30 text-sm">
            {new Date(item.timestamp).toLocaleDateString()}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
};

// REMOVE THE SERVER COMPONENT IMPLEMENTATION (lines 197-232)
// Delete this section:
// import React from 'react';
// import { fetchNewsByCategory } from '@/lib/api';
// import { Card, CardContent } from '@/components/ui/card';
// import Link from 'next/link';
// import AudioButton from '@/components/AudioButton';
// 
// export default async function CategoryPage({ params }: { params: { category: string } }) {
//   ...
// }

const CategoryPage = () => {
  const params = useParams();
  const category = decodeURIComponent(params.category as string);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      // Add proper error handling with retry logic
      let response;
      let retries = 3;
      
      while (retries > 0) {
        try {
          response = await fetch(`http://localhost:8003/news/${category}`, {
            signal: controller.signal,
            headers: {
              'Cache-Control': 'no-cache',
              'Pragma': 'no-cache'
            }
          });
          
          if (response.ok) break;
          retries--;
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retrying
        } catch (err) {
          retries--;
          if (retries === 0) throw err;
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      clearTimeout(timeoutId);
      
      if (!response || !response.ok) throw new Error('Failed to fetch news');
      const data = await response.json();
      
      // Ensure data is an array before setting it to state
      if (!Array.isArray(data)) {
        throw new Error('Invalid data format received from server');
      }
      
      setNewsItems(data);
      
      // Cache the data in localStorage with timestamp
      localStorage.setItem(`news-${category}`, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('Error fetching news:', error);
      setError('Unable to load news. Please try again.');
      setNewsItems([]); // Reset to empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Try to get cached data first
    const cached = localStorage.getItem(`news-${category}`);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      const age = Date.now() - timestamp;
      if (age < 30000) { // Use cache if less than 30 seconds old
        setNewsItems(data);
        setLoading(false);
      }
    }
    
    fetchNews();
    // Refresh every 1 minute
    const interval = setInterval(fetchNews, 60 * 1000);
    return () => clearInterval(interval);
  }, [category]);

  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 bg-[rgb(4,7,29)]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold mb-4 text-white"
          >
            {category}
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="h-1 w-24 bg-purple-500 mx-auto mb-6"></div>
            <p className="text-white/60 max-w-2xl mx-auto">
              Stay informed with the latest news and updates from {category}.
            </p>
          </motion.div>
        </div>

        {loading ? (
          <LoadingState />
        ) : error ? (
          <div className="text-center p-8 bg-red-500/10 rounded-lg border border-red-500/20">
            <p className="text-red-400">{error}</p>
            <button 
              onClick={fetchNews}
              className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : newsItems.length === 0 ? (
          <div className="text-center p-8">
            <p className="text-white/60">No news available for this category at the moment.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {newsItems.map((item, index) => (
              <NewsBox key={index} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;