'use client';

import React, { useState, useEffect } from "react";
import { Button } from "./ui/MovingBorders";
import { FaPlay, FaPause } from "react-icons/fa";

interface NewsItem {
  headline: string;
  summary: string;
  url: string;
  source: string;
  timestamp: string;
  category: string;
}

const Experience = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<{ [key: number]: boolean }>({});
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null);

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
      
      setNewsItems(data.slice(0, 8));
    } catch (error) {
      console.error('Error fetching news:', error);
      setError('Unable to load news. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleSpeech = (index: number, headline: string, summary: string) => {
    if (currentUtterance) {
      window.speechSynthesis.cancel();
    }

    const text = `${headline}. ${summary}`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onend = () => {
      setIsPlaying(prev => ({ ...prev, [index]: false }));
    };

    setCurrentUtterance(utterance);
    setIsPlaying(prev => ({ ...prev, [index]: !prev[index] }));

    if (!isPlaying[index]) {
      window.speechSynthesis.speak(utterance);
    } else {
      window.speechSynthesis.cancel();
    }
  };

  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, 60 * 1000);
    return () => {
      clearInterval(interval);
      if (currentUtterance) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div className="py-20 w-full">
      <h1 className="heading">
        Your Top <span className="text-purple">Picks</span>
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-400">{error}</div>
      ) : (
        <div className="w-full mt-12 grid lg:grid-cols-4 grid-cols-1 gap-10">
          {newsItems.map((item, index) => (
            <Button
              key={index}
              duration={Math.floor(Math.random() * 10000) + 10000}
              borderRadius="1.75rem"
              style={{
                background: "rgb(4,7,29)",
                backgroundColor:
                  "linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)",
                borderRadius: `calc(1.75rem* 0.96)`,
              }}
              className="flex-1 text-black dark:text-white border-neutral-200 dark:border-slate-800"
            >
              <div className="flex lg:flex-row flex-col lg:items-center p-3 py-6 md:p-5 lg:p-10 gap-2">
                <div className="lg:ms-5 w-full">
                  <div className="flex items-start justify-between gap-2">
                    <a 
                      href={item.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1 hover:text-purple transition-colors"
                    >
                      <h1 className="text-start text-xl md:text-2xl font-bold">
                        {item.headline}
                      </h1>
                    </a>
                    <button
                      onClick={() => toggleSpeech(index, item.headline, item.summary)}
                      className="p-2 rounded-full bg-purple/10 hover:bg-purple/20 transition-colors"
                      aria-label={isPlaying[index] ? "Pause" : "Play"}
                    >
                      {isPlaying[index] ? <FaPause /> : <FaPlay />}
                    </button>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-sm text-white/40">
                    <span>{item.source}</span>
                    <span>•</span>
                    <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Experience;
