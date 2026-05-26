import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ShieldCheck } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useNavigate } from "@tanstack/react-router";

const Aurora = lazy(() => import("./Aurora"));

interface HeroProps {
  onConnect: () => void;
}

const EXPO_OUT = [0.16, 1, 0.3, 1] as const;

export default function Hero({ onConnect }: HeroProps) {
  const { walletAddress } = useApp();
  const navigate = useNavigate();

  const handleCtaClick = () => {
    if (walletAddress) {
      navigate({ to: "/dashboard" });
    } else {
      onConnect();
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden pt-24 pb-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <Suspense fallback={null}>
        <div className="absolute inset-0 z-0 h-full w-full">
          <Aurora />
        </div>
      </Suspense>
      <div className="pointer-events-none absolute inset-0 z-[1] hero-overlay pointer-events-none" />

      <div 
        className="relative z-10 mx-auto flex max-w-6xl flex-col items-center text-center w-full"
        style={{ willChange: 'transform', transform: 'translateZ(0)' }}
      >
        <motion.span
          initial={{ opacity: 0, y: 16 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0, ease: EXPO_OUT }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#1a1a3a] bg-[#0A0920]/60 px-4 py-1.5 text-[10px] sm:text-xs text-[#A0A0B8] backdrop-blur-md shrink-0"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#00f6ff]" />
          Blockchain-Powered File Verification
        </motion.span>

        <div className="overflow-hidden pb-4 md:pb-12 -mb-4 md:-mb-12 w-full">
          <motion.h1
            initial={{ opacity: 0, y: 16 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08, ease: EXPO_OUT }}
            className="font-display font-bold leading-[1.1] tracking-tight text-white break-words text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
          >
            File Integrity,
          </motion.h1>
        </div>
        <div className="overflow-hidden pb-4 md:pb-12 -mb-4 md:-mb-12 w-full">
          <motion.h1
            initial={{ opacity: 0, y: 16 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16, ease: EXPO_OUT }}
            className="font-display font-bold leading-[1.1] tracking-tight text-white break-words text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
          >
            <span className="text-gradient-cv">On-Chain.</span>
          </motion.h1>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 16 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.24, ease: EXPO_OUT }}
          className="mt-6 md:mt-8 max-w-2xl text-sm sm:text-base md:text-lg text-[#A0A0B8] px-4"
        >
          Oper8a anchors every file to the Solana blockchain. Tamper-proof, verifiable, permanent.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.32, ease: EXPO_OUT }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 w-full px-8 sm:px-0"
        >
          <button
            onClick={handleCtaClick}
            className="w-full sm:w-auto min-h-[48px] rounded-full bg-[#00f6ff] px-10 py-3 text-sm font-semibold text-black transition-all hover:bg-white active:scale-95"
          >
            {walletAddress ? "Open Dashboard" : "Connect Wallet →"}
          </button>
          <a href="#features" className="text-sm text-[#A0A0B8] transition-colors hover:text-white min-h-[44px] flex items-center px-4">
            See How It Works
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }} 
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.44, ease: EXPO_OUT }}
          className="glass mt-16 md:mt-20 w-full max-w-2xl p-4 md:p-6 text-left scale-75 origin-top md:scale-100 sm:scale-90"
        >
          <div className="flex items-center justify-between border-b border-[#1a1a3a] pb-4 gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg bg-[#00f6ff]/10 flex items-center justify-center shrink-0">
                <ShieldCheck size={16} className="text-[#00f6ff] md:size-[18px]" />
              </div>
              <div className="min-w-0">
                <div className="text-xs md:text-sm text-white truncate">contract_v4_final.pdf</div>
                <div className="text-[10px] text-[#555570]">2.4 MB · uploaded just now</div>
              </div>
            </div>
            <span className="rounded-full bg-[#00f6ff]/10 px-2 py-0.5 md:px-3 md:py-1 text-[10px] font-medium text-[#00f6ff] shrink-0">
              VERIFIED
            </span>
          </div>
          <div className="mt-4">
            <div className="text-[9px] md:text-[10px] uppercase tracking-wider text-[#555570]">SHA-256</div>
            <code className="mt-1 block break-all font-mono text-[10px] md:text-xs text-[#A0A0B8]">
              0x9f4a8b2e1c7d3f6a5b9e8c4d2f1a7b6e3c9d8a5f4b2e1c7d3f6a5b9e8c4d2f1a
            </code>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 1,
            y: [0, 8, 0]
          }}
          transition={{
            opacity: { duration: 0.5, delay: 0.9 },
            y: { 
              duration: 1.8, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 0.9
            }
          }}
          className="mt-12 md:mt-16 text-[#555570]"
        >
          <ChevronDown size={22} />
        </motion.div>
      </div>
    </section>
  );
}
