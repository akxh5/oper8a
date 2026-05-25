"use client";

import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { truncateAddress } from "@/utils/blockchainUtils";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface NavbarProps {
  onConnect: () => void;
}

const EXPO_OUT = [0.16, 1, 0.3, 1] as any;

export default function Navbar({ onConnect }: NavbarProps) {
  const { walletAddress } = useApp();
  const [open, setOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "Security", href: "#security" },
    { label: "About", href: "#about" },
  ];

  const isActive = (href: string) => {
    if (!mounted || typeof window === "undefined") return false;
    return window.location.hash === href;
  };

  const handleCtaClick = () => {
    if (walletAddress) {
      navigate({ to: "/dashboard" });
    } else {
      onConnect();
    }
  };

  return (
    <>
      <motion.div
        initial={{ y: -20, opacity: 0, x: "-50%" }}
        animate={{ y: 0, opacity: 1, x: "-50%" }}
        transition={{ duration: 0.5, delay: 0.2, ease: EXPO_OUT }}
        className="fixed top-6 left-1/2 z-[100] w-auto"
      >
        <nav className="flex items-center justify-center gap-1 rounded-full border border-white/10 bg-white/5 p-1.5 shadow-2xl backdrop-blur-2xl saturate-[180%] md:gap-2 px-2 md:px-1.5">
          {/* Logo Mark */}
          <Link 
            to="/" 
            className="flex h-11 md:h-8 px-4 shrink-0 items-center justify-center rounded-full bg-[#00f6ff]/15 text-sm font-display font-bold text-[#00f6ff] transition-transform hover:scale-105 active:scale-95"
          >
            oper8a
          </Link>

          {/* Desktop/Tablet Nav Links */}
          <div 
            className="hidden md:flex items-center gap-0.5 lg:gap-1"
            onMouseLeave={() => setHoveredLink(null)}
          >
            {navLinks.map((link) => {
              const active = isActive(link.href);
              const hovered = hoveredLink === link.label;

              return (
                <a
                  key={link.label}
                  href={link.href}
                  onMouseEnter={() => setHoveredLink(link.label)}
                  className={cn(
                    "relative rounded-full px-3 py-1.5 lg:px-4 lg:py-2 text-xs lg:text-sm font-medium transition-colors duration-200",
                    active || hovered ? "text-white" : "text-[#A0A0B8]"
                  )}
                >
                  {(hovered || active) && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-[#00f6ff]/12"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </a>
              );
            })}
          </div>

          <div className="flex items-center gap-1 md:gap-2">
            {/* CTA Button */}
            <button
              onClick={handleCtaClick}
              className="hidden md:flex items-center rounded-full border border-white/15 bg-[#646478]/30 px-4 py-1.5 lg:px-5 lg:py-2 text-xs lg:text-sm font-medium text-white transition-all duration-200 hover:border-[#00f6ff]/40 hover:bg-[#00f6ff]/20 md:ml-1 whitespace-nowrap min-h-[40px] lg:min-h-[44px]"
            >
              {walletAddress ? "Open Dashboard" : "Connect Wallet"}
            </button>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setOpen(true)}
              className="flex h-11 w-11 md:hidden items-center justify-center text-[#A0A0B8] rounded-full hover:bg-white/5 transition-colors"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </nav>
      </motion.div>

      {/* Mobile Overlay Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EXPO_OUT }}
            className="fixed inset-0 z-[110] bg-[#050320] flex flex-col items-center justify-center gap-8"
          >
            <button 
              onClick={() => setOpen(false)} 
              className="absolute top-8 right-8 flex h-11 w-11 items-center justify-center text-[#A0A0B8] hover:text-white transition-colors rounded-full"
              aria-label="Close menu"
            >
              <X size={32} />
            </button>
            
            <div className="flex flex-col items-center gap-8 text-2xl font-display font-medium">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.1, ease: EXPO_OUT }}
                  onClick={() => setOpen(false)}
                  className="text-white hover:text-[#00f6ff] transition-colors min-h-[44px] flex items-center"
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, ease: EXPO_OUT }}
                onClick={() => { 
                  setOpen(false); 
                  handleCtaClick();
                }}
                className="mt-4 rounded-full bg-[#00f6ff] px-10 py-4 min-h-[56px] text-lg font-semibold text-black active:scale-95 transition-transform w-full max-w-[280px]"
              >
                {walletAddress ? "Open Dashboard" : "Connect Wallet"}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
