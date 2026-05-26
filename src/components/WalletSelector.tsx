import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "@tanstack/react-router";
import { X } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/context/AppContext";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { walletConnection } from "@/utils/walletConnection";

interface Props {
  open: boolean;
  onClose: () => void;
}

const EXPO_OUT = [0.16, 1, 0.3, 1] as any;

export default function WalletSelector({ open, onClose }: Props) {
  const navigate = useNavigate();
  const { setWalletAddress } = useApp();
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  async function connectPhantom() {
    try {
      setConnecting(true);
      const resp = await (window as any).solana.connect();
      const address = resp.publicKey.toString();
      
      // 1. Save to localStorage immediately
      localStorage.setItem('walletConnected', 'true');
      localStorage.setItem('walletAddress', address);
      
      // 2. Update context immediately  
      setWalletAddress(address);
      
      // 3. Initialize Firebase user
      try {
        const userRef = doc(db, 'users', address);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
          await setDoc(userRef, { elo: 2701, lastUpdated: new Date().toISOString() });
        }
      } catch (e) {
        console.warn('User init failed, continuing:', e);
      }
      
      // 4. Close modal
      if (onClose) onClose();
      
      // 5. Hard redirect - no setTimeout needed
      window.location.href = '/dashboard';
      
    } catch (err: any) {
      if (err.code !== 4001) { // 4001 = user rejected
        toast.error('Connection failed. Please try again.');
      }
      setConnecting(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="glass relative w-full max-w-md p-8"
          >
            <button onClick={onClose} className="absolute right-4 top-4 text-[#A0A0B8] hover:text-white transition-colors">
              <X size={18} />
            </button>
            <h3 className="mb-2 font-display text-2xl text-white">Connect your wallet</h3>
            <p className="mb-6 text-sm text-[#A0A0B8]">Choose a wallet to access oper8a.</p>

            <motion.button
              onClick={connectPhantom}
              disabled={connecting}
              whileHover={{ scale: 1.01, borderColor: "rgba(0, 246, 255, 0.4)" }}
              whileTap={{ scale: 0.99 }}
              className="flex w-full items-center justify-between rounded-xl border border-[#1a1a3a] bg-[#0A0920]/80 px-5 py-4 transition-all disabled:opacity-50"
            >
              <span className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#AB9FF2]/10 p-2">
                  <svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
                    <path d="M256 128c0 70.692-57.308 128-128 128C57.308 256 0 198.692 0 128 0 57.308 57.308 0 128 0c70.692 0 128 57.308 128 128" fill="#AB9FF2"/>
                    <path d="M128 192.102c-35.669 0-62.412-29.18-62.412-66.203s26.743-66.202 62.412-66.202c35.67 0 62.412 29.179 62.412 66.202 0 37.023-26.743 66.203-62.412 66.203zm10.465-79.39c0-6.977-4.673-12.633-10.435-12.633s-10.435 5.656-10.435 12.633 4.673 12.633 10.435 12.633c5.762 0 10.435-5.656 10.435-12.633zm-18.368 0c0-6.977-4.673-12.633-10.435-12.633s-10.435 5.656-10.435 12.633 4.673 12.633 10.435 12.633c5.762 0 10.435-5.656 10.435-12.633z" fill="#FFF"/>
                  </svg>
                </span>
                <span className="text-left">
                  <div className="text-sm text-white font-medium">Phantom</div>
                  <div className="text-xs text-[#A0A0B8]">Solana wallet</div>
                </span>
              </span>
              <span className="text-[#00f6ff] font-bold">{connecting ? "…" : "→"}</span>
            </motion.button>

            <p className="mt-6 text-xs text-[#555570]">
              By connecting, you agree to oper8a's terms. Devnet only.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
