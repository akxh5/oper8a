import { motion } from "framer-motion";
import { Github, Twitter } from "lucide-react";

const EXPO_OUT = [0.16, 1, 0.3, 1] as any;

export default function Footer() {
  return (
    <footer className="relative w-full overflow-hidden bg-[#030218] px-4 py-12 md:px-8 md:py-16 lg:px-16 lg:py-20 border-t border-[#00f6ff]/8">
      {/* Primary Brand Area — Wordmark + Socials on the Right */}
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-12 w-full overflow-hidden">
        
        {/* Left: Giant lowercase wordmark */}
        <div className="relative overflow-visible flex-1">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EXPO_OUT }}
            className="relative py-8 md:py-12 -my-8 md:-my-12 overflow-hidden"
          >
            <motion.h2 
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              whileInView={{ clipPath: "inset(0 0% 0 0)" }}
              viewport={{ once: true }}
              className="font-display font-bold tracking-[-0.04em] leading-[1.2] whitespace-nowrap select-none lowercase relative z-10 text-center md:text-left text-[clamp(2.5rem,12vw,16rem)] overflow-visible"
              style={{ 
                background: "linear-gradient(110deg, #003a3f 10%, #00f6ff 30%, #7a00ff 50%, #00f6ff 70%, #003a3f 90%)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
              animate={{
                backgroundPosition: ["-100% center", "100% center"],
              }}
              transition={{
                backgroundPosition: { duration: 6, repeat: Infinity, ease: "linear" },
                clipPath: { duration: 1.4, delay: 0.2, ease: EXPO_OUT }
              }}
            >
              oper8a
            </motion.h2>
            
            {/* Subtle glow layer */}
            <motion.div 
              className="absolute inset-0 -z-10 blur-[60px] md:blur-[100px] opacity-20 pointer-events-none"
              animate={{
                background: [
                  "radial-gradient(circle at 20% 50%, #00f6ff 0%, transparent 50%)",
                  "radial-gradient(circle at 80% 50%, #7a00ff 0%, transparent 50%)",
                  "radial-gradient(circle at 20% 50%, #00f6ff 0%, transparent 50%)",
                ]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        </div>

        {/* Right: Social Icons & Partner — Vertically centered with wordmark */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8, ease: EXPO_OUT }}
          className="flex items-center gap-6 md:ml-auto md:translate-y-2" // Tiny translate to account for lowercase descenders visual weight
        >
          <div className="flex items-center gap-4">
            <a 
              href="https://github.com/akxh5/oper8a" 
              target="_blank" 
              rel="noreferrer" 
              className="group relative flex h-12 w-12 items-center justify-center rounded-full border border-white/5 bg-white/5 transition-all hover:border-[#00f6ff]/50 hover:bg-[#00f6ff]/10"
              aria-label="GitHub"
            >
              <Github size={20} className="text-[#555570] transition-colors group-hover:text-[#00f6ff]" />
            </a>
            <a 
              href="https://x.com/akxh_5" 
              target="_blank" 
              rel="noreferrer" 
              className="group relative flex h-12 w-12 items-center justify-center rounded-full border border-white/5 bg-white/5 transition-all hover:border-[#00f6ff]/50 hover:bg-[#00f6ff]/10"
              aria-label="Twitter"
            >
              <Twitter size={20} className="text-[#555570] transition-colors group-hover:text-[#00f6ff]" />
            </a>
          </div>
          
          {/* Fueled By Solana Logo — Integrated with vertical divider */}
          <div className="flex items-center gap-8 border-l border-white/10 pl-8 h-10">
            <div className="flex flex-col items-center md:items-start gap-1">
              <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#555570]">Fueled By</span>
              <img 
                src="/assets/logo.png" 
                alt="Solana Foundation" 
                className="h-5 w-auto brightness-0 invert opacity-60 transition-opacity hover:opacity-100" 
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4, ease: EXPO_OUT }}
        className="mx-auto mt-8 flex flex-col md:flex-row max-w-7xl items-center justify-between gap-6 border-t border-white/5 pt-8 w-full"
      >
        <div className="text-[10px] md:text-xs text-[#555570] text-center md:text-left">
          © 2025-26 oper8a. All rights reserved.
        </div>

        <div className="text-xs text-[#A0A0B8] text-center order-first md:order-none">
          built & managed by{" "}
          <a 
            href="https://akxh5.me" 
            target="_blank" 
            rel="noreferrer"
            className="group relative inline-block text-[#f8f9fa] transition-colors"
          >
            <span className="relative z-10 transition-all group-hover:text-[#00f6ff]">Aksh</span>
            <span className="absolute inset-0 -z-0 scale-0 rounded-full bg-[#00f6ff]/20 blur-md transition-transform duration-300 group-hover:scale-150" />
          </a>
        </div>

        <div className="flex gap-6 text-[10px] md:text-xs text-[#555570] items-center justify-center">
          <button className="transition-colors hover:text-[#A0A0B8]">Privacy Policy</button>
          <button className="transition-colors hover:text-[#A0A0B8]">Terms of Service</button>
        </div>
      </motion.div>
    </footer>
  );
}
