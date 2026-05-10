import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-ui" });

export const metadata: Metadata = {
  title: "ZOO AI Platform - Autonomous AI Workforce",
  description: "Deploy AI agents that work for you 24/7. Chat, assign tasks, and mold your AI workforce.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="min-h-screen bg-[#06060a] text-white antialiased">{children}</body>
    </html>
  );
}
