import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./layout/Navbar";
import Footer from "./layout/Footer";

// Load Google fonts with CSS variable support
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Fydaa – Your money, your mission",
  description: "Track and manage your budget with Fydaa.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head><link rel="icon" href="/favicon.ico" sizes="any"/></head>
      
      <body
        className={`text-black font-sans m-0 p-0 ${geistSans.variable} ${geistMono.variable} ${inter.variable}`}
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}

