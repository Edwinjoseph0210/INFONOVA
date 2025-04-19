'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaPlay, FaPause, FaEllipsisV } from 'react-icons/fa';
import Image from 'next/image';

interface NewsItem {
  id: number;
  headline: string;
  summary: string;
  source: string;
  timestamp: string;
  category: string;
  audio_url: string;
}

const categoryConfig = {
  'latest-headlines': {
    title: 'Latest Headlines',
    description: 'Breaking news and top stories from around the world',
    color: 'from-blue-600 to-blue-900',
    image: '/images/categories/latest.jpg',
    filter: (item: NewsItem) => true
  },
  'politics-global-affairs': {
    title: 'Politics & Global Affairs',
    description: 'Political developments and international relations',
    color: 'from-red-600 to-red-900',
    image: '/images/categories/politics.jpg',
    filter: (item: NewsItem) => item.category.toLowerCase().includes('politics') || item.category.toLowerCase().includes('world')
  },
  'business-finance': {
    title: 'Business & Finance',
    description: 'Financial markets, business news, and economic trends',
    color: 'from-green-600 to-green-900',
    image: '/images/categories/business.jpg',
    filter: (item: NewsItem) => item.category.toLowerCase().includes('business') || item.category.toLowerCase().includes('finance')
  },
  'technology-innovation': {
    title: 'Technology & Innovation',
    description: 'Latest in tech, innovation, and digital trends',
    color: 'from-purple-600 to-purple-900',
    image: '/images/categories/technology.jpg',
    filter: (item: NewsItem) => item.category.toLowerCase().includes('tech') || item.category.toLowerCase().includes('science')
  },
  'entertainment-lifestyle': {
    title: 'Entertainment & Lifestyle',
    description: 'Entertainment, culture, and lifestyle news',
    color: 'from-pink-600 to-pink-900',
    image: '/images/categories/entertainment.jpg',
    filter: (item: NewsItem) => item.category.toLowerCase().includes('entertainment') || item.category.toLowerCase().includes('lifestyle')
  }
};

export default function CategoryPage() {
  const { slug } = useParams();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playingAudio, setPlayingAudio] = useState<number | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  const category = categoryConfig[slug as keyof typeof categoryConfig];

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8003/news', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }

        const data = await response.json();
        const filteredNews = data.filter(category.filter);
        setNews(filteredNews);
        setError(null);
      } catch (err) {
        setError('Failed to load news');
        console.error('Error fetching news:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [slug]);

  const handleAudioToggle = (id: number, audioUrl: string) => {
    if (playingAudio === id) {
      audioElement?.pause();
      setPlayingAudio(null);
      setAudioElement(null);
    } else {
      audioElement?.pause();
      const newAudio = new Audio(audioUrl);
      newAudio.play();
      setPlayingAudio(id);
      setAudioElement(newAudio);
    }
  };

  if (!category) {
    return <div className="p-8 text-center">Category not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="relative h-64">
        <div className="absolute inset-0 overflow-hidden">
          <div className="relative w-full h-full">
            <Image
              src={category.image}
              alt={category.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
              quality={100}
              onError={(e) => {
                console.error('Image failed to load:', category.image);
                e.currentTarget.src = '/images/categories/fallback.jpg';
              }}
            />
          </div>
          <div className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-75`}></div>
        </div>
        <div className="absolute inset-0 flex flex-col justify-center px-8">
          <h1 className="text-4xl font-bold text-white mb-2">{category.title}</h1>
          <p className="text-xl text-white opacity-90">{category.description}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="flex items-center justify-center">
              <FaEllipsisV className="w-6 h-6 text-gray-900 dark:text-white" />
            </div>
          </div>
        ) : error ? (
          <div className="text-center text-red-600 dark:text-red-400">{error}</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {news.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
              >
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                    {item.headline}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{item.summary}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>{item.source}</span>
                    <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <button
                      onClick={() => handleAudioToggle(item.id, item.audio_url)}
                      className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      {playingAudio === item.id ? <FaPause /> : <FaPlay />}
                      <span>{playingAudio === item.id ? 'Pause' : 'Listen'}</span>
                    </button>
                    <div className="relative">
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === item.id ? null : item.id)}
                        className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                      >
                        <FaEllipsisV className="w-4 h-4" />
                      </button>
                      {activeDropdown === item.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50 border border-gray-200 dark:border-gray-700">
                          <a
                            href={`/news/${item.id}`}
                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            Read full article
                          </a>
                          <button
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                            onClick={() => {
                              // Add share functionality
                              console.log('Share:', item.headline);
                            }}
                          >
                            Share
                          </button>
                          <button
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                            onClick={() => {
                              // Add save functionality
                              console.log('Save:', item.headline);
                            }}
                          >
                            Save for later
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}