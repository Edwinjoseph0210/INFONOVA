'use client';

import { useRouter } from 'next/navigation';
import ThemeToggle from './ThemeToggle';
import AuthButton from './AuthButton';
import Link from 'next/link';

export default function Header() {
  const router = useRouter();

  return (
    <header className="fixed top-0 left-0 right-0 h-20 flex items-center justify-between px-6 z-50 text-gray-900 dark:text-white">
      <div className="flex items-center gap-6">
        <Link href="/" className="text-xl font-bold text-white hover:text-purple-400 transition-colors duration-300">
          Infonova
        </Link>
        {/* Navigation links removed as requested */}
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <AuthButton />
      </div>
    </header>
  );
}