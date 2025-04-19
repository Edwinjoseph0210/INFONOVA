'use client';

import { useState } from 'react';
import { BentoGrid, BentoGridItem } from '@/components/ui/BentoGrid';

interface Article {
  id: number;
  title: string;
  description: string;
  img: string;
}

const mockArticles: Article[] = [
  {
    id: 1,
    title: "Breaking News",
    description: "Stay updated with the latest breaking news and developments from around the world.",
    img: "/breaking.svg"
  },
  {
    id: 2,
    title: "Technology & Innovation",
    description: "Discover the latest technological advancements and innovative solutions.",
    img: "/tech.svg"
  },
  {
    id: 3,
    title: "Business & Finance",
    description: "Track market trends, business insights, and financial updates.",
    img: "/economics.svg"
  },
  {
    id: 4,
    title: "Sports",
    description: "Follow your favorite sports, teams, and athletes.",
    img: "/sports.svg"
  },
  {
    id: 5,
    title: "Health & Wellness",
    description: "Get the latest health news, medical breakthroughs, and wellness tips.",
    img: "/health.svg"
  },
  {
    id: 6,
    title: "Entertainment",
    description: "Stay up to date with movies, music, celebrities, and pop culture.",
    img: "/entertainment.svg"
  },
  {
    id: 7,
    title: "Environment",
    description: "Learn about climate change, sustainability, and environmental news.",
    img: "/environment.svg"
  },
  {
    id: 8,
    title: "Culture",
    description: "Explore art, literature, history, and cultural events.",
    img: "/culture.svg"
  }
];

export default function RecommendedArticles() {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-6 text-white">Your Top Picks</h2>
      <BentoGrid className="max-w-4xl mx-auto">
        {mockArticles.map((article) => (
          <BentoGridItem
            key={article.id}
            id={article.id}
            title={article.title}
            description={article.description}
            img={article.img}
            className="cursor-pointer"
          />
        ))}
      </BentoGrid>
    </div>
  );
} 