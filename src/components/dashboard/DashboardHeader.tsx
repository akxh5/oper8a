"use client";

import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Copy, LogOut, Settings, ChevronDown, Trophy, Edit2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/context/AppContext";
import { truncateAddress } from "@/utils/blockchainUtils";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { walletConnection } from "@/utils/walletConnection";
import PinataConfigDialog from "./PinataConfigDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export default function DashboardHeader() {
  const { walletAddress, setWalletAddress, pinataConfigured, setPinataConfigured, refreshTick } = useApp();
  const navigate = useNavigate();
  const [pinataOpen, setPinataOpen] = useState(false);
  const [elo, setElo] = useState<number | null>(null);

  useEffect(() => {
    const key = localStorage.getItem("pinata_api_key");
    if (key) {
      setPinataConfigured(true);
    }
    
    const wallet = localStorage.getItem("walletAddress");
    if (wallet && key) {
      toast.success(`Welcome back ${truncateAddress(wallet)}`);
    }
  }, [setPinataConfigured]);

  async function fetchUserElo(retries = 3) {
    const walletAddr = walletAddress || localStorage.getItem('walletAddress');
    if (!walletAddr) return;

    for (let i = 0; i < retries; i++) {
      try {
        const snap = await getDoc(doc(db, "users", walletAddr));
        if (snap.exists()) {
          const data = snap.data() as { elo?: number };
          setElo(data.elo ?? 2701);
          return;
        }
      } catch (e) {
        if (i === retries - 1) {
          console.warn("ELO fetch failed after retries:", e);
        } else {
          await new Promise(r => setTimeout(r, 1000 * (i + 1)));
        }
      }
    }
  }

  useEffect(() => {
    fetchUserElo();
  }, [refreshTick, walletAddress]);

  async function disconnect() {
    walletConnection.disconnect();
    setWalletAddress(null);
    navigate({ to: "/" });
  }

  function copyAddr() {
    if (!walletAddress) return;
    navigator.clipboard.writeText(walletAddress);
    toast.success("Address copied");
  }

  return (
    <header className="glass mb-4 flex items-center justify-between gap-4 px-4 md:px-6 py-4 text-left w-full overflow-hidden">
      <Link to="/" className="flex items-center gap-2 md:gap-3 hover:opacity-80 transition-opacity shrink-0">
        <span className="font-display text-lg md:text-xl font-bold text-white uppercase tracking-tighter">oper8a</span>
        <span className="hidden sm:inline-block rounded-md border border-[#1a1a3a] px-2 py-0.5 text-[10px] uppercase tracking-wider text-[#A0A0B8]">
          Dashboard
        </span>
      </Link>

      <div className="hidden lg:flex items-center gap-2 text-xs text-[#A0A0B8] shrink-0">
        <span className="h-1.5 w-1.5 rounded-full bg-[#00f6ff]" />
        Solana Devnet
      </div>

      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        {elo !== null && (
          <span className="hidden xs:inline-flex items-center gap-1.5 rounded-full border border-[#1a1a3a] bg-[#0A0920]/60 px-3 py-1.5 text-xs text-white">
            <Trophy size={12} className="text-[#00f6ff]" /> {elo}
          </span>
        )}
        
        <div className="hidden md:block">
          <button
            onClick={() => setPinataOpen(true)}
            className={cn(
              "flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition-all",
              pinataConfigured 
                ? "border-[#00f6ff]/30 bg-[#00f6ff]/5 text-[#00f6ff] hover:bg-[#00f6ff]/10" 
                : "border-[#1a1a3a] bg-transparent text-[#f8f9fa] hover:border-[#00f6ff] hover:text-[#00f6ff]"
            )}
          >
            {pinataConfigured ? (
              <>
                <CheckCircle2 size={12} />
                <span className="hidden lg:inline">IPFS Configured</span>
                <Edit2 size={10} className="opacity-60" />
              </>
            ) : (
              <>
                <Settings size={14} />
                <span>IPFS Config</span>
              </>
            )}
          </button>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-full border border-[#1a1a3a] bg-[#0A0920]/60 px-3 py-1.5 text-xs text-white transition-all hover:border-[#00f6ff] outline-none min-h-[40px]">
              <span className="h-2 w-2 rounded-full bg-[#00f6ff]" />
              <span className="font-mono">
                {walletAddress ? truncateAddress(walletAddress, isMobile ? 3 : 4, isMobile ? 3 : 4) : "—"}
              </span>
              <ChevronDown size={12} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuPortal>
            <DropdownMenuContent 
              align="end" 
              className="z-[150] w-48 overflow-hidden p-1 text-sm border-[#00f6ff]/15 bg-[#0A0920]/95 backdrop-blur-[20px] rounded-[12px] shadow-2xl"
            >
              <div className="md:hidden border-b border-white/5 mb-1 px-1 py-1">
                <DropdownMenuItem 
                  onClick={() => setPinataOpen(true)}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-[#f8f9fa] focus:bg-[#1a1a3a]/60 outline-none"
                >
                  <Settings size={14} /> IPFS Settings
                </DropdownMenuItem>
              </div>
              <DropdownMenuItem 
                onClick={copyAddr}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-[#f8f9fa] hover:bg-[#1a1a3a]/60 cursor-pointer focus:bg-[#1a1a3a]/60 focus:text-white outline-none"
              >
                <Copy size={14} /> Copy Address
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={disconnect}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-[#f8f9fa] hover:bg-[#1a1a3a]/60 cursor-pointer focus:bg-[#1a1a3a]/60 focus:text-white outline-none"
              >
                <LogOut size={14} /> Disconnect
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenu>
      </div>

      <PinataConfigDialog open={pinataOpen} onClose={() => setPinataOpen(false)} />
    </header>
  );
}

// Simple internal hook for mobile detection
const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
