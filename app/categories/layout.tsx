'use client';

export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[rgb(4,7,29)] transition-colors duration-300">
      {children}
    </div>
  );
}