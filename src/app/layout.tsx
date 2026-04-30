import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TechBackground from "@/components/TechBackground";
import WhatsAppButton from "@/components/WhatsAppButton";
import SoftwareHouseButton from "@/components/SoftwareHouseButton";
import { LanguageProvider } from "@/context/LanguageContext";
import LayoutContent from "@/components/LayoutContent";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BST HUB | Assignments, Projects & Thesis",
  description: "Your all-in-one hub for assignments, final year projects, thesis documentation, and academic assistance.",
  other: {
    "csp-header": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;",
    "x-frame-options": "DENY",
    "x-content-type-options": "nosniff",
    "referrer-policy": "strict-origin-when-cross-origin"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100"
      >
        <LanguageProvider>
          <LayoutContent>
            {children}
          </LayoutContent>
        </LanguageProvider>
      </body>
    </html>
  );
}
