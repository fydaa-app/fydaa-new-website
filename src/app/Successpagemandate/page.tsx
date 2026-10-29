"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getPendingSipFirstDebit, runPendingSipFirstDebit } from "../dashboard/lib/sipInvestApi";

const TickIcon = ({ size = 128 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 128 128">
    <circle
      cx="64"
      cy="64"
      r="64"
      fill="#10b981"
      style={{ filter: "drop-shadow(0 20px 25px rgb(16 185 129 / 0.4))" }}
    />
    <motion.path
      d="M38 64l16 16 36-36"
      stroke="white"
      strokeWidth="8"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
    />
  </svg>
);

export default function MandateSuccessPage() {
  const router = useRouter();
  const [confetti, setConfetti] = useState(false);
  const [status, setStatus] = useState("Mandate approved");
  const [error, setError] = useState("");

  useEffect(() => {
    setConfetti(true);
    const confettiTimer = setTimeout(() => setConfetti(false), 3000);
    let cancelled = false;

    (async () => {
      const pending = getPendingSipFirstDebit();
      if (pending?.sipId) {
        setStatus("Activating your SIP and debiting the first installment…");
        const result = await runPendingSipFirstDebit((msg: string) => {
          if (!cancelled && msg) setStatus(msg);
        });
        if (cancelled) return;
        if (!result.ok && !("skipped" in result && result.skipped)) {
          setError(result.message || "First debit failed. Open the dashboard and retry from Dreams if needed.");
          setStatus("Mandate set — first debit needs a retry");
          setTimeout(() => router.replace("/dashboard"), 4000);
          return;
        }
        setStatus("SIP setup successful");
      } else {
        setStatus("UPI Mandate Setup Successfully");
      }
      setTimeout(() => {
        if (!cancelled) router.replace("/dashboard");
      }, 2200);
    })();

    return () => {
      cancelled = true;
      clearTimeout(confettiTimer);
    };
  }, [router]);

  return (
    <div className="fixed inset-0 w-full h-full bg-white flex items-center justify-center overflow-hidden">
      {confetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(60)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                backgroundColor: `hsl(${Math.random() * 60 + 300}, 70%, 60%)`,
                left: `${Math.random() * 100}%`,
                top: "-10px",
              }}
              initial={{ y: 0, x: 0, opacity: 1, scale: 0 }}
              animate={{
                y: typeof window !== "undefined" ? window.innerHeight + 100 : 1000,
                x: (Math.random() - 0.5) * 200,
                opacity: 0,
                scale: 1,
                rotate: Math.random() * 360,
              }}
              transition={{
                duration: Math.random() * 2 + 2,
                delay: Math.random() * 2,
                ease: "easeOut",
              }}
            />
          ))}
        </div>
      )}

      <motion.div
        className="flex flex-col items-center text-center gap-10 px-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.1 }}
        >
          <TickIcon size={160} />
        </motion.div>

        <motion.h1
          className="text-black font-extrabold"
          style={{ fontSize: "clamp(36px, 7vw, 72px)", letterSpacing: "-0.02em" }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Success!
        </motion.h1>

        <motion.p
          className="text-black max-w-md"
          style={{ fontSize: "clamp(16px, 2.5vw, 22px)", lineHeight: 1.4 }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          {status}
        </motion.p>

        {error ? (
          <p className="text-red-600 text-sm max-w-md">{error}</p>
        ) : (
          <p className="text-black/50 text-sm">Taking you to your dashboard…</p>
        )}
      </motion.div>
    </div>
  );
}
