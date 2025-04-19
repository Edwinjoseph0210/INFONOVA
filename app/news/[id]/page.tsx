'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';

interface NewsItem {
  headline: string;
  summary: string;
  url: string;
  audio_url: string | null;
  source: string;
  timestamp: string;
  category: string;
}

export default function NewsDetailPage() {
  const params = useParams();
  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetchNewsItem();
  }, []);

  const fetchNewsItem = async () => {
    try {
      console.log('Fetching news item:', params.id);
      const response = await fetch(`http://localhost:8003/news/item/${params.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }
      const data = await response.json();
      console.log('Fetched news item:', data);
      setNews(data);
    } catch (err) {
      console.error('Error fetching news:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = () => {
    if (!news?.audio_url) return;

    if (audio) {
      audio.pause();
      setAudio(null);
      setIsPlaying(false);
      return;
    }

    const newAudio = new Audio(`http://localhost:8003${news.audio_url}`);
    newAudio.play();
    newAudio.onended = () => {
      setIsPlaying(false);
      setAudio(null);
    };
    setAudio(newAudio);
    setIsPlaying(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">Error: {error || 'News not found'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-white dark:bg-[rgb(12,14,35)] rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-800">
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <span className="px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm font-semibold">
                {news.category}
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                {new Date(news.timestamp).toLocaleDateString()}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
              {news.headline}
            </h1>

            <div className="mb-8">
              <span className="text-purple-600 dark:text-purple-400 font-medium">
                Source: {news.source}
              </span>
            </div>

            <div className="prose dark:prose-invert max-w-none mb-8">
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {news.summary}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <a
                href={news.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
              >
                Read Full Article →
              </a>
              {news.audio_url && (
                <button
                  onClick={handlePlay}
                  className="inline-flex items-center px-6 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  {isPlaying ? (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
                      </svg>
                      Pause Audio
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      </svg>
                      Listen to Summary
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}