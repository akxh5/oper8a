"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Hash, Zap, Network as NetworkIcon, AlertTriangle, Database } from "lucide-react";

function CyclingHash() {
  const [hash, setHash] = useState("9f4a8b2e1c7d3f6a5b9e8c4d2f1a7b6e");
  useEffect(() => {
    const id = setInterval(() => {
      const chars = "0123456789abcdef";
      let next = "";
      for (let i = 0; i < 32; i++) next += chars[Math.floor(Math.random() * 16)];
      setHash(next);
    }, 220);
    return () => clearInterval(id);
  }, []);
  return (
    <code className="font-mono text-[10px] md:text-xs leading-relaxed text-[#00f6ff]/80 break-all">
      0x{hash}
    </code>
  );
}

const EXPO_OUT = [0.16, 1, 0.3, 1] as const;

export default function Features() {
  const cardVariants = (index: number) => ({
    initial: { opacity: 0, y: 32 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { 
      duration: 0.5, 
      ease: EXPO_OUT, 
      delay: index * 0.08 
    },
    whileHover: { 
      scale: 1.015,
      transition: { duration: 0.2, ease: EXPO_OUT }
    },
  });

  return (
    <section id="features" className="relative px-4 sm:px-6 lg:px-8 py-20 md:py-32 overflow-hidden w-full">
      <div className="mx-auto max-w-7xl w-full">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EXPO_OUT }}
          viewport={{ once: true, margin: "-80px" }}
          className="mb-12 md:mb-16 max-w-3xl font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-white break-words"
        >
          Your verification engine.
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3 md:gap-4 w-full">
          {/* Immutable Hashing */}
          <motion.div 
            {...cardVariants(0)} 
            className="glass col-span-1 md:col-span-1 lg:col-span-7 p-4 sm:p-5 lg:p-8 transition-[border-color] duration-300 hover:border-[#00f6ff]/25 w-full overflow-hidden"
          >
            <Hash size={20} className="mb-4 md:mb-6 text-[#00f6ff]" />
            <h3 className="mb-2 md:mb-3 font-display text-xl sm:text-2xl text-white">Immutable Hashing</h3>
            <p className="mb-4 md:mb-6 text-xs sm:text-sm text-[#A0A0B8]">
              Every file generates a unique cryptographic fingerprint. Change one byte, get a new hash.
            </p>
            <div className="rounded-lg border border-[#1a1a3a] bg-black/30 p-3 sm:p-4">
              <CyclingHash />
            </div>
          </motion.div>

          {/* Solana Speed */}
          <motion.div 
            {...cardVariants(1)} 
            className="glass col-span-1 md:col-span-1 lg:col-span-5 p-4 sm:p-5 lg:p-8 transition-[border-color] duration-300 hover:border-[#00f6ff]/25 w-full overflow-hidden"
          >
            <Zap size={20} className="mb-4 md:mb-6 text-[#00f6ff]" />
            <h3 className="mb-2 md:mb-3 font-display text-xl sm:text-2xl text-white">Solana Speed</h3>
            <p className="mb-4 md:mb-6 text-xs sm:text-sm text-[#A0A0B8]">Finality you can ship around.</p>
            <div className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tighter whitespace-nowrap overflow-hidden transform-gpu md:scale-95 lg:scale-100 origin-left">
              &lt;400ms
            </div>
          </motion.div>

          {/* IPFS Storage */}
          <motion.div 
            {...cardVariants(2)} 
            className="glass col-span-1 md:col-span-1 lg:col-span-5 p-4 sm:p-5 lg:p-8 transition-[border-color] duration-300 hover:border-[#00f6ff]/25 w-full overflow-hidden"
          >
            <Database size={20} className="mb-4 md:mb-6 text-[#00f6ff]" />
            <h3 className="mb-2 md:mb-3 font-display text-xl sm:text-2xl text-white">IPFS Storage</h3>
            <p className="mb-4 md:mb-6 text-xs sm:text-sm text-[#A0A0B8]">
              Files live on a global distributed network. No single point of failure.
            </p>
            <pre className="rounded-lg border border-[#1a1a3a] bg-black/30 p-3 sm:p-4 font-mono text-[10px] sm:text-xs text-[#A0A0B8] overflow-x-auto whitespace-pre">
{`/network
├── contracts/
│   ├── v4_final.pdf
│   └── addendum.pdf
└── audits/
    └── q4_report.xlsx`}
            </pre>
          </motion.div>

          {/* Tamper Detection */}
          <motion.div 
            {...cardVariants(3)} 
            className="glass col-span-1 md:col-span-1 lg:col-span-7 p-4 sm:p-5 lg:p-8 transition-[border-color] duration-300 hover:border-[#00f6ff]/25 w-full overflow-hidden"
          >
            <AlertTriangle size={20} className="mb-4 md:mb-6 text-[#00f6ff]" />
            <h3 className="mb-2 md:mb-3 font-display text-xl sm:text-2xl text-white">Tamper Detection</h3>
            <p className="mb-4 md:mb-6 text-xs sm:text-sm text-[#A0A0B8]">
              Any change to a file produces a different hash — and we notice immediately.
            </p>
            <div className="space-y-2">
              {[
                { msg: "Duplicate upload blocked", time: "2s ago", color: "#00f6ff" },
                { msg: "Hash mismatch on q3_report.pdf", time: "1m ago", color: "#7a00ff" },
                { msg: "Verified: contract_v4_final.pdf", time: "5m ago", color: "#00f6ff" },
              ].map((a) => (
                <div key={a.msg} className="flex items-center justify-between rounded-lg border border-[#1a1a3a] bg-black/20 px-3 sm:px-4 py-2 sm:py-3 gap-2">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: a.color }} />
                    <span className="text-xs sm:text-sm text-white truncate">{a.msg}</span>
                  </div>
                  <span className="text-[10px] text-[#555570] shrink-0">{a.time}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Decentralized by Design */}
          <motion.div 
            {...cardVariants(4)} 
            id="security" 
            className="glass col-span-1 md:col-span-2 lg:col-span-12 p-6 sm:p-8 lg:p-10 transition-[border-color] duration-300 hover:border-[#00f6ff]/25 w-full overflow-hidden"
          >
            <NetworkIcon size={20} className="mb-4 md:mb-6 text-[#00f6ff]" />
            <h3 className="mb-2 md:mb-3 font-display text-xl sm:text-2xl text-white">Decentralized by Design</h3>
            <p className="mb-6 md:mb-8 max-w-xl text-xs sm:text-sm text-[#A0A0B8]">
              Your team's verification network spans nodes worldwide. No central authority. No vendor lock.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6">
              {["Client", "IPFS", "Solana", "Network", "Verified"].map((label, i, arr) => (
                <div key={label} className="flex items-center gap-3 md:gap-6">
                  <div className="rounded-full border border-[#00f6ff]/30 bg-[#00f6ff]/5 px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs text-white">
                    {label}
                  </div>
                  {i < arr.length - 1 && (
                    <div className="h-px w-4 sm:w-8 md:w-12 bg-gradient-to-r from-[#00f6ff]/40 to-[#7a00ff]/40" />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
