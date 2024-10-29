import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { CombinedStatsProvider } from './context/CombinedStatsContext';
import React from "react"; // Import React to use React.ReactNode

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "LiveStats App",
  description: "Application pour suivre les statistiques en direct des matchs.",
};

// Define props with React.ReactNode type for children
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans`}>
        <CombinedStatsProvider>
          <header className="fixed top-0 w-full bg-gray-900 text-white p-4 flex justify-between items-center z-10">
            <h1 className="text-lg font-semibold">LiveStats</h1>
            <a href="/" className="text-sm hover:underline">Accueil</a>
          </header>
          <main className="pt-16">{children}</main> {/* Décalage pour le header */}
        </CombinedStatsProvider>
      </body>
    </html>
  );
}
