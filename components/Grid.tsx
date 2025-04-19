"use client";

import { useState, useEffect } from 'react';
import { BentoGrid, BentoGridItem } from "./ui/BentoGrid";

interface NewsItem {
  headline: string;
  summary: string;
  url: string;
  source: string;
  timestamp: string;
  category: string;
}

const Grid = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:8003/news/latest-headlines', {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch news');
      const data = await response.json();
      
      // Ensure data is an array and matches NewsItem interface
      if (!Array.isArray(data) || !data.every(item => 
        typeof item === 'object' && item !== null &&
        typeof item.headline === 'string' &&
        typeof item.summary === 'string' &&
        typeof item.url === 'string' &&
        typeof item.source === 'string' &&
        typeof item.timestamp === 'string'
      )) {
        throw new Error('Invalid data format received from server');
      }
      
      setNewsItems(data);
    } catch (error) {
      console.error('Error fetching news:', error);
      setError('Unable to load news. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, 60 * 1000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="headlines" className="min-h-[400px]">
      <BentoGrid className="max-w-7xl mx-auto py-20">
        {loading ? (
          <div className="col-span-full flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : error ? (
          <div className="col-span-full text-center text-red-400">{error}</div>
        ) : (
<<<<<<< HEAD
          newsItems.slice(0, 5).map((item, i) => (
=======
          newsItems.slice(0, 4).map((item, i) => (
>>>>>>> 30a74b5b6ed1499b838acbb40724f91f773a96c0
            <BentoGridItem
              key={i}
              id={i}
              title={
                <div className="flex justify-between items-start gap-4">
                  <div>{item.headline}</div>
<<<<<<< HEAD
                   
=======
                  <button
                    onClick={() => {
                      const audio = new Audio(`http://localhost:8003/static/${item.headline.replace(/[^a-zA-Z0-9]/g, '_')}.mp3`);
                      audio.play();
                    }}
                    className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors flex-shrink-0"
                  >
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white">
  <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
</svg>
                  </button>
>>>>>>> 30a74b5b6ed1499b838acbb40724f91f773a96c0
                </div>
              }
              description={item.summary}
              className={`${i === 0 ? 'md:col-span-2' : ''}`}
              titleClassName="justify-start"
            />
          ))
        )}
      </BentoGrid>
    </section>
  );
};

export default Grid;
