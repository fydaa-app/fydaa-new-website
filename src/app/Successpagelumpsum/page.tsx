"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  captureLumpsumPayment,
  clearPendingLumpsumPayment,
  getPendingLumpsumPayment,
} from "../dashboard/lib/lumpsumApi";

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

function money(value: unknown) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "";
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

export default function LumpsumSuccessPage() {
  const router = useRouter();
  const [confetti, setConfetti] = useState(false);
  const [status, setStatus] = useState("Confirming payment…");
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);

  useEffect(() => {
    setConfetti(true);
    const confettiTimer = setTimeout(() => setConfetti(false), 3000);
    let cancelled = false;

    (async () => {
      const pending = getPendingLumpsumPayment();
      const paymentId = pending?.paymentId;
      if (!paymentId) {
        setStatus("Payment received");
        setOk(true);
        setTimeout(() => {
          if (!cancelled) router.replace("/dashboard");
        }, 2200);
        return;
      }

      setStatus("Confirming your payment…");
      const result = await captureLumpsumPayment(paymentId);
      if (cancelled) return;

      clearPendingLumpsumPayment();

      if (!result.ok || result.fail) {
        setOk(false);
        setError(result.reason || result.message || "Payment failed. You can try again from Home.");
        setStatus("Payment unsuccessful");
        setTimeout(() => {
          if (!cancelled) router.replace("/dashboard");
        }, 4000);
        return;
      }

      if (result.success) {
        setOk(true);
        setStatus(
          result.amount != null
            ? `Investment of ${money(result.amount)} successful`
            : "Investment successful",
        );
      } else {
        setOk(true);
        setStatus("Payment submitted — portfolio will update shortly");
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
      {confetti && ok && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(60)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                backgroundColor: `hsl(${Math.random() * 60 + 140}, 70%, 45%)`,
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
        className="flex flex-col items-center text-center gap-8 px-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {ok ? (
          <motion.div
            initial={{ scale: 0, rotate: -15 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 12 }}
          >
            <TickIcon size={96} />
          </motion.div>
        ) : (
          <div className="w-24 h-24 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-3xl font-bold">
            !
          </div>
        )}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">{status}</h1>
          {error ? <p className="text-sm text-red-600 max-w-md mx-auto">{error}</p> : null}
          <p className="text-sm text-slate-500 mt-3">Taking you back to the dashboard…</p>
        </div>
      </motion.div>
    </div>
  );
}
