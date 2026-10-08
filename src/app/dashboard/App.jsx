"use client";

import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import HomePage from "./pages/HomePage";
import DreamsPage from "./pages/DreamsPage";
import HistoryPage from "./pages/HistoryPage";
import ProfilePage from "./pages/ProfilePage";
import KycPage from "./pages/KycPage";
import { getUserStage } from "../signup/lib/authApi";
import { isHomeKycComplete, isSignupComplete } from "../signup/lib/kycApi";
import { MessageSquare } from "lucide-react";

const pages = {
  home: HomePage,
  kyc: KycPage,
  dreams: DreamsPage,
  history: HistoryPage,
  profile: ProfilePage,
};

export default function App() {
  const [activePage, setActivePage] = useState("home");
  const [showKyc, setShowKyc] = useState(false);
  const Page = pages[activePage] || HomePage;

  useEffect(() => {
    let cancelled = false;
    getUserStage()
      .then((stage) => {
        if (!cancelled) setShowKyc(!isHomeKycComplete(stage) || !isSignupComplete(stage));
      })
      .catch(() => {
        if (!cancelled) setShowKyc(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-bg font-inter text-ink text-[15px] leading-normal antialiased">
      <Sidebar activePage={activePage} setActivePage={setActivePage} showKyc={showKyc} />

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
