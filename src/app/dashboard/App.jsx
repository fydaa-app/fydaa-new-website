"use client";

import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import HomePage from "./pages/HomePage";
import DreamsPage from "./pages/DreamsPage";
import HistoryPage from "./pages/HistoryPage";
import ProfilePage from "./pages/ProfilePage";
import { MessageSquare } from "lucide-react";

const pages = {
  home:    HomePage,
  dreams:  DreamsPage,
  history: HistoryPage,
  profile: ProfilePage,
};

export default function App() {
  const [activePage, setActivePage] = useState("home");
  const Page = pages[activePage] || HomePage;

  return (
    <div className="flex min-h-screen bg-bg font-inter text-ink text-[15px] leading-normal antialiased">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      <main className="ml-[260px] flex-1 min-h-screen">
        <Topbar />
        <Page setActivePage={setActivePage} />
      </main>

      {/* Chatbot FAB */}
      <button className="fixed bottom-7 right-7 z-50 w-14 h-14 rounded-full bg-jade text-white shadow-[0_4px_16px_rgba(12,74,62,.3)] hover:scale-105 hover:shadow-[0_6px_24px_rgba(12,74,62,.35)] transition-all flex items-center justify-center">
        <MessageSquare size={24} strokeWidth={1.8} />
      </button>
    </div>
  );
}
