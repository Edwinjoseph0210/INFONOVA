'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import DelayedAuthPrompt from '@/components/DelayedAuthPrompt';
import { useAuth } from '@/lib/AuthContext';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const isCategoryPage = pathname?.startsWith('/categories');
  const isAuthPage = pathname === '/auth';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[rgb(4,7,29)] transition-colors duration-300 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[rgb(4,7,29)] transition-colors duration-300">
      {!isCategoryPage && !isAuthPage && <Header />}
      <main className="pt-20">
        {children}
      </main>
      {!isAuthPage && !user && <DelayedAuthPrompt />}
    </div>
  );
}