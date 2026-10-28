"use client";

import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import HomePage from "./pages/HomePage";
import DreamsPage from "./pages/DreamsPage";
import GoalsPage from "./pages/GoalsPage";
import HistoryPage from "./pages/HistoryPage";
import ProfilePage from "./pages/ProfilePage";
import KycPage from "./pages/KycPage";
import { getUserBankDetails, getUserDetails, getUserStage } from "../signup/lib/authApi";
import { isHomeKycComplete, isSignupComplete } from "../signup/lib/kycApi";
import { mapBankDetails, mapStageProfile, mapUserDetails } from "./lib/userProfile";
import { emailFromAdvisorPayload, getAdvisorAndRelationshipManager, mapRelationshipManager } from "./lib/crmApi";
const pages = {
  home: HomePage,
  kyc: KycPage,
  dreams: DreamsPage,
  goals: GoalsPage,
  history: HistoryPage,
  profile: ProfilePage,
};

export default function App() {
  const [activePage, setActivePage] = useState("home");
  const [showKyc, setShowKyc] = useState(false);
  const [user, setUser] = useState(undefined);
  const [pendingGoalSip, setPendingGoalSip] = useState(null);
  const [navOpen, setNavOpen] = useState(false);
  const Page = pages[activePage] || HomePage;

  const goToPage = (page, goal) => {
    if (goal) setPendingGoalSip(goal);
    setActivePage(page);
    setNavOpen(false);
  };

  useEffect(() => {
    if (!navOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [navOpen]);

  useEffect(() => {
    let cancelled = false;
    getUserStage()
      .then((stage) => {
        if (cancelled) return;
        setShowKyc(!isHomeKycComplete(stage) || !isSignupComplete(stage));
        setUser((current) => ({
          ...(current || {}),
          ...mapStageProfile(stage),
          email: current?.email || "",
          packageName: stage?.packageName ? String(stage.packageName) : "",
          isMfMandate: stage?.isMfMandate === true || stage?.isMfMandate === "true",
          mandateAmount: stage?.mandateAmount,
          bank: current?.bank ?? null,
        }));
      })
      .catch(() => {
        if (cancelled) return;
        setShowKyc(false);
        setUser((current) => current ?? null);
      });
    getUserDetails()
      .then(async (details) => {
        if (cancelled) return;
        const mapped = mapUserDetails(details);
        const userId = details?.data?.id;
        let email = mapped.email || "";
        let manager = null;
        if (userId) {
          try {
            const crm = await getAdvisorAndRelationshipManager(userId);
            email = emailFromAdvisorPayload(crm) || email;
            manager = mapRelationshipManager(crm);
          } catch {
            manager = null;
          }
        }
        if (cancelled) return;
        setUser((current) => ({
          ...mapped,
          ...(current?.name ? current : {}),
          id: userId || current?.id,
          email: email || current?.email || "",
          manager,
          packageName: current?.packageName || "",
          isMfMandate: current?.isMfMandate,
          mandateAmount: current?.mandateAmount,
          bank: current?.bank ?? null,
        }));
      })
      .catch(() => {
        if (!cancelled) setUser((current) => current ?? null);
      });
    getUserBankDetails()
      .then((details) => {
        if (cancelled) return;
        setUser((current) => ({
          ...(current || {}),
          bank: mapBankDetails(details),
        }));
      })
      .catch(() => {
        if (!cancelled) {
          setUser((current) => ({ ...(current || {}), bank: current?.bank ?? null }));
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex min-h-dvh bg-bg font-inter text-ink text-[15px] leading-normal antialiased overflow-x-hidden">
      <Sidebar
        activePage={activePage}
        setActivePage={goToPage}
        showKyc={showKyc}
        user={user}
        open={navOpen}
        onClose={() => setNavOpen(false)}
      />

      <main className="w-full lg:ml-[260px] 4xl:ml-[280px] flex-1 min-h-dvh min-w-0">
        <Topbar activePage={activePage} onMenuOpen={() => setNavOpen(true)} />
        <Page
          setActivePage={goToPage}
          user={user}
          pendingGoalSip={pendingGoalSip}
          clearPendingGoalSip={() => setPendingGoalSip(null)}
        />
      </main>
    </div>
  );
}
