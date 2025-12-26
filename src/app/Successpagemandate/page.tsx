"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

// Tick Icon Component
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

export default function DigiPage() {
  const [confetti, setConfetti] = useState(false);

  useEffect(() => {
    setConfetti(true);
    const timer = setTimeout(() => setConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full bg-white flex items-center justify-center overflow-hidden">
      {/* Confetti */}
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
                y: typeof window !== 'undefined' ? window.innerHeight + 100 : 1000,
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

      {/* Main Content */}
      <motion.div
        className="flex flex-col items-center text-center gap-16" // Increased gap
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Tick Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.1 }}
        >
          <TickIcon size={200} />
        </motion.div>

        {/* Success Text */}
        <motion.h1
          className="text-black font-extrabold"
          style={{ fontSize: "clamp(48px, 8vw, 96px)", letterSpacing: "-0.02em" }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Success!
        </motion.h1>

        {/* Description */}
        <motion.p
          className="text-black whitespace-nowrap" // No wrapping
          style={{ fontSize: "clamp(18px, 3vw, 28px)", lineHeight: 1.4 }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          UPI Mandate Setup Sucessfully. 🎉
        </motion.p>
      </motion.div>
    </div>
  );
}
