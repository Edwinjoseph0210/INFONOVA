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
          newsItems.slice(0, 5).map((item, i) => (
            <BentoGridItem
              key={i}
              id={i}
              title={
                <div className="flex justify-between items-start gap-4">
                  <div>{item.headline}</div>
                   
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
