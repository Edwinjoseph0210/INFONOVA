import { useEffect, useRef } from 'react';
import { readingTracker } from '../readingTracker';

export const useReadingTracker = (
  articleId: string,
  category: string,
  title: string
) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Start tracking when component mounts
    readingTracker.startReading();

    // Calculate scroll percentage
    const calculateReadingProgress = () => {
      if (!scrollRef.current) return 0;
      
      const element = scrollRef.current;
      const totalHeight = element.scrollHeight - element.clientHeight;
      const scrollPosition = element.scrollTop;
      
      return Math.min((scrollPosition / totalHeight) * 100, 100);
    };

    // Track scroll events
    const handleScroll = () => {
      const completionPercentage = calculateReadingProgress();
      readingTracker.trackArticleView(articleId, category, title, completionPercentage);
    };

    const element = scrollRef.current;
    if (element) {
      element.addEventListener('scroll', handleScroll);
      
      // Track initial view
      readingTracker.trackArticleView(articleId, category, title, 0);
    }

    return () => {
      if (element) {
        element.removeEventListener('scroll', handleScroll);
      }
    };
  }, [articleId, category, title]);

  return {
    scrollRef,
    getReadingHistory: readingTracker.getReadingHistory.bind(readingTracker),
    getCategoryPreferences: readingTracker.getCategoryPreferences.bind(readingTracker)
  };
}; 