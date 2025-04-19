import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/lib/AuthContext";
<<<<<<< HEAD
import ClientLayout from "./ClientLayout";
=======
import Header from "@/components/Header";
import DelayedAuthPrompt from "@/components/DelayedAuthPrompt";
import { usePathname } from "next/navigation";
>>>>>>> 30a74b5b6ed1499b838acbb40724f91f773a96c0
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Global News Hub",
  description: "Your trusted source for global news and updates",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/news-icon.png" sizes="any" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <AuthProvider>
<<<<<<< HEAD
            <ClientLayout>
              {children}
            </ClientLayout>
=======
            <Header />
            {children}
>>>>>>> 30a74b5b6ed1499b838acbb40724f91f773a96c0
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
