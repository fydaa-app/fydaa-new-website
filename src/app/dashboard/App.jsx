"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import HomePage from "./pages/HomePage";
import DreamsPage from "./pages/DreamsPage";
import GoalsPage from "./pages/GoalsPage";
import HistoryPage from "./pages/HistoryPage";
import ProfilePage from "./pages/ProfilePage";
import KycPage from "./pages/KycPage";
import { getUserBankDetails, getUserDetails, getUserStage } from "../signup/lib/authApi";
import { isSignupComplete } from "../signup/lib/kycApi";
import { mapBankDetails, mapStageProfile, mapUserDetails } from "./lib/userProfile";
import { emailFromAdvisorPayload, getAdvisorAndRelationshipManager, mapRelationshipManager } from "./lib/crmApi";
import { captureEvent, identifyUser } from "../../lib/posthog";
const pages = {
  home: HomePage,
  kyc: KycPage,
  dreams: DreamsPage,
  goals: GoalsPage,
  history: HistoryPage,
  profile: ProfilePage,
};

function DashboardShell() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activePage, setActivePage] = useState("home");
  const [showKyc, setShowKyc] = useState(false);
  const [user, setUser] = useState(undefined);
  const [pendingGoalSip, setPendingGoalSip] = useState(null);
  const [kycStart, setKycStart] = useState("kyc");
  const [kycReturnPage, setKycReturnPage] = useState("home");
  const [resumeInvestDraft, setResumeInvestDraft] = useState(null);
  const [navOpen, setNavOpen] = useState(false);
  const Page = pages[activePage] || HomePage;

  const refreshKycVisibility = () => {
    getUserStage()
      .then((stage) => {
        const needsKyc = !isSignupComplete(stage);
        setShowKyc(needsKyc);
        return needsKyc;
      })
      .catch(() => {
        setShowKyc(false);
      });
  };

  const goToPage = (page, goalOrOpts) => {
    if (page === "kyc") {
      const opts = goalOrOpts && typeof goalOrOpts === "object" ? goalOrOpts : {};
      const start = opts.start === "risk" ? "risk" : "kyc";
      setKycStart(start);
      if (opts.returnDraft) {
        setResumeInvestDraft({ ...opts.returnDraft, resumeReview: true });
        setKycReturnPage(opts.returnPage || "home");
      } else if (!opts.keepReturn) {
        setResumeInvestDraft(null);
        setKycReturnPage("home");
      }
    } else if (goalOrOpts && !(goalOrOpts && goalOrOpts.start)) {
      setPendingGoalSip(goalOrOpts);
    }
    captureEvent("webapp_nav_click", { page });
    setActivePage(page);
    setNavOpen(false);
  };

  useEffect(() => {
    captureEvent("webapp_page_view", { page: activePage });
  }, [activePage]);

  useEffect(() => {
    if (!user) return;
    const id = user.email || user.phone || user.name;
    if (!id) return;
    identifyUser(String(id), {
      email: user.email || undefined,
      name: user.name || undefined,
      phone: user.phone || undefined,
    });
  }, [user]);

  /** User tapped "Back to dashboard" — leave KYC and clear any pending invest resume. */
  const exitKycToDashboard = () => {
    setResumeInvestDraft(null);
    setKycReturnPage("home");
    getUserStage()
      .then((stage) => setShowKyc(!isSignupComplete(stage)))
      .catch(() => setShowKyc(false))
      .finally(() => setActivePage("home"));
  };

  /** KYC steps finished successfully — resume invest review if we came from there. */
  const finishKycFlow = () => {
    const returnPage = resumeInvestDraft
      ? (kycReturnPage === "goals" ? "goals" : "home")
      : "home";
    getUserStage()
      .then((stage) => {
        setShowKyc(!isSignupComplete(stage));
      })
      .catch(() => {
        setShowKyc(false);
      })
      .finally(() => {
        setActivePage(returnPage);
        setKycReturnPage("home");
      });
  };

  // Open embedded KYC when arriving as /dashboard?start=kyc|risk
  useEffect(() => {
    const start = searchParams?.get("start");
    if (start !== "kyc" && start !== "risk") return;
    setKycStart(start);
    setActivePage("kyc");
    router.replace("/dashboard", { scroll: false });
  }, [searchParams, router]);

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
        setShowKyc(!isSignupComplete(stage));
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
          kycStart={kycStart}
          onKycFinished={finishKycFlow}
          onKycExit={exitKycToDashboard}
          resumeInvestDraft={resumeInvestDraft}
          clearResumeInvestDraft={() => setResumeInvestDraft(null)}
          refreshKycVisibility={refreshKycVisibility}
        />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-bg" />}>
      <DashboardShell />
    </Suspense>
  );
}
