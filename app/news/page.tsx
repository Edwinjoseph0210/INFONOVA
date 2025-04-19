'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const categories = [
  {
    title: "Latest Headlines",
    description: "Stay informed with our curated selection of top stories from around the world.",
    image: "/first.jpg",
    color: "from-red-500 to-orange-500",
    slug: "latest-headlines"
  },
  {
    title: "Politics & Global Affairs",
    description: "Comprehensive coverage of political developments and international relations.",
    image: "/second.webp",
    color: "from-blue-500 to-purple-500",
    slug: "politics-global-affairs"
  },
  {
    title: "Business & Finance",
    description: "Market updates, economic trends, and financial insights.",
    image: "/third.jpg",
    color: "from-green-500 to-emerald-500",
    slug: "business-finance"
  },
  {
    title: "Technology & Innovation",
    description: "Latest in tech, digital trends, and breakthrough innovations.",
    image: "/forth.jpg",
    color: "from-indigo-500 to-violet-500",
    slug: "technology-innovation"
  }
];

export default function NewsPage() {
  const router = useRouter();

  const handleCategoryClick = (slug: string) => {
    router.push(`/news/categories/${slug}`);
  };

  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Global News Hub</h1>
          <p className="text-gray-600 dark:text-gray-400">Choose a category to explore</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((category) => (
            <motion.div
              key={category.title}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleCategoryClick(category.slug)}
              className="relative h-[320px] rounded-xl shadow-lg overflow-hidden group cursor-pointer
                bg-white dark:bg-[rgb(12,14,35)] border border-gray-200 dark:border-gray-800"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                style={{ 
                  backgroundImage: `url(${category.image})`,
                  opacity: 0.3
                }}
              />
              
              <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-40 group-hover:opacity-60 transition-opacity duration-300`} />
              
              <div className="relative z-10 p-8 flex flex-col h-full justify-between">
                <div>
                  <h3 className="text-3xl font-bold mb-4 text-white group-hover:scale-105 transition-transform duration-300">
                    {category.title}
                  </h3>
                  <p className="text-gray-100 text-lg">{category.description}</p>
                </div>
                <div className="mt-6">
                  <motion.span 
                    className="inline-flex items-center text-white text-lg font-medium group-hover:underline"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <span>View News</span>
                    <svg 
                      className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </motion.span>
                </div>
              </div>

              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 