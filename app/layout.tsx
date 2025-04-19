import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/lib/AuthContext";
import ClientLayout from "./ClientLayout";
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
            <ClientLayout>
              {children}
            </ClientLayout>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
