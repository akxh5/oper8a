"use client";

import { useRef, useState, useEffect } from "react";
import { Upload, Check, Loader2, AlertCircle, FileText, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/context/AppContext";
import { uploadToPinata } from "@/utils/pinataUtils";
import { createDuplicateAlert, checkDuplicate, anchorOnChain, saveFileRecord, getUserNetworks } from "@/utils/networkUtils";
import { walletConnection } from "@/utils/walletConnection";
import { db, updateUserElo } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Step = "idle" | "ipfs" | "dup" | "solana" | "firebase" | "done" | "error";

const stepLabel: Record<string, string> = {
  idle: "",
  ipfs: "Uploading to IPFS...",
  dup: "Checking uniqueness...",
  solana: "Anchoring on Solana...",
  firebase: "Saving record...",
  done: "File verified!",
  error: "Error",
};

const EXPO_OUT = [0.16, 1, 0.3, 1] as const;

export default function FileUpload() {
  const { walletAddress, selectedNetwork, setSelectedNetwork, pinataConfigured, refreshFiles } = useApp();
  const [file, setFile] = useState<File | null>(null);
  const [step, setStep] = useState<Step>("idle");
  const [error, setError] = useState<string | null>(null);
  const [networks, setNetworks] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const effectiveWallet = walletAddress || (typeof window !== "undefined" ? localStorage.getItem('walletAddress') : null);
  const ready = !!(effectiveWallet && pinataConfigured && selectedNetwork);

  useEffect(() => {
    async function load() {
      if (!effectiveWallet) return;
      try {
        const list = await getUserNetworks(effectiveWallet);
        setNetworks(list);
      } catch (e) {
        console.warn("Failed to load networks for dropdown", e);
      }
    }
    load();
  }, [effectiveWallet]);
async function startUpload() {
  // Pre-flight checks
  if (!selectedNetwork) {
    toast.error('Please select a network first');
    return;
  }

  if (!effectiveWallet) {
    toast.error('Please connect your wallet first');
    return;
  }

  // @ts-ignore
  if (!window.solana?.isPhantom) {
    toast.error('Phantom wallet not found. Please install it.');
    return;
  }

  // Check if Phantom is actually connected (not just localStorage)
  // and hydrate the singleton
  try {
    await walletConnection.connect();
  } catch (e) {
    toast.error('Please reconnect your Phantom wallet');
    return;
  }

  if (!file) return;
  setError(null);
    try {
      // Step 1: "Uploading to IPFS..."
      setStep("ipfs");
      const fileRecord = await uploadToPinata(file);

      // Step 2: "Checking uniqueness..."
      setStep("dup");
      let duplicateInfo: any = null;
      try {
        const checkWithTimeout = Promise.race([
          checkDuplicate(fileRecord.IpfsHash, selectedNetwork.id),
          new Promise<any>((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 8000)
          )
        ]);
        duplicateInfo = await checkWithTimeout;
      } catch (e) {
        console.warn('Duplicate check failed, proceeding:', e);
      }

      if (duplicateInfo) {
        await createDuplicateAlert(selectedNetwork.id, {
          fileName: file.name,
          uploaderUsername: "User"
        });
        
        // Reward for duplicate detection
        if (effectiveWallet) {
          await updateUserElo(effectiveWallet, 5);
        }

        setStep("error");
        setError(`Duplicate file detected. Already verified by ${duplicateInfo.uploaderUsername || "another member"}.`);
        toast.error("Duplicate detected");
        refreshFiles();
        return;
      }

      // Step 3: "Anchoring on Solana..."
      setStep("solana");
      const walletObj = walletConnection.getWalletObject() as any;
      const blockchainTx = await anchorOnChain(
        selectedNetwork.id,
        fileRecord.IpfsHash,
        walletObj
      );

      // Step 4: "Saving record..."
      setStep("firebase");
      await saveFileRecord(
        selectedNetwork.id,
        {
          name: file.name,
          hash: fileRecord.IpfsHash,
          size: file.size,
          ipfsUrl: fileRecord.ipfsUrl
        },
        effectiveWallet,
        "User",
        blockchainTx
      );

      // Reward for unique upload
      if (effectiveWallet) {
        await updateUserElo(effectiveWallet, 15);
      }

      // Done: "File verified!"
      setStep("done");
      toast.success("File verified and anchored");
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
      refreshFiles();
      setTimeout(() => setStep("idle"), 2000);
    } catch (e) {
      setStep("error");
      const msg = e instanceof Error ? e.message : "Upload failed";
      setError(msg);
      toast.error(msg);
    }
  }

  const steps: Step[] = ["ipfs", "dup", "solana", "firebase"];
  const currentIdx = steps.indexOf(step);

  return (
    <motion.div 
      whileHover={{ scale: 1.008 }}
      className="glass p-4 sm:p-5 lg:p-6 transition-[border-color,box-shadow] duration-300 w-full"
    >
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Upload size={16} className="text-[#00f6ff]" />
          <h3 className="font-display text-lg text-white">Upload & Anchor</h3>
        </div>
        
        {/* Network Selector Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-md border border-[#1a1a3a] bg-black/30 px-3 py-1.5 text-[10px] uppercase tracking-wider text-[#A0A0B8] hover:border-[#00f6ff]/50 transition-colors">
              {selectedNetwork ? selectedNetwork.name : "Select Network"}
              <ChevronDown size={12} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[#050320] border-[#1a1a3a]">
            {networks.length === 0 && (
              <div className="px-3 py-2 text-[10px] text-[#555570]">No networks found</div>
            )}
            {networks.map((net) => (
              <DropdownMenuItem
                key={net.id}
                onClick={() => setSelectedNetwork(net)}
                className="text-xs text-[#A0A0B8] focus:text-white focus:bg-[#00f6ff]/10"
              >
                {net.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {!ready && (
        <p className="mb-4 rounded-lg border border-[#1a1a3a] bg-black/30 p-3 text-[10px] sm:text-xs text-[#A0A0B8]">
          {!effectiveWallet && "Connect wallet · "}
          {!pinataConfigured && "Configure IPFS · "}
          {!selectedNetwork && "Select a network"}
        </p>
      )}

      <label className="block w-full">
        <div className={`cursor-pointer rounded-xl border border-dashed p-6 md:p-8 text-center transition-all w-full ${ready ? "border-[#1a1a3a] bg-black/20 hover:border-[#00f6ff]" : "border-[#1a1a3a] opacity-50 cursor-not-allowed"}`}>
          <FileText size={28} className="mx-auto mb-2 text-[#555570]" />
          <div className="text-xs sm:text-sm text-white truncate max-w-[200px] mx-auto">
            {file ? file.name : "Click to choose a file"}
          </div>
          <div className="mt-1 text-[10px] sm:text-xs text-[#555570]">
            {file ? `${(file.size / 1024).toFixed(1)} KB` : "Any type, up to IPFS limit"}
          </div>
        </div>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          disabled={!ready}
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
      </label>

      <button
        onClick={startUpload}
        disabled={!file || !ready || (step !== "idle" && step !== "error" && step !== "done")}
        className="mt-4 w-full rounded-full bg-[#00f6ff] px-5 py-2.5 min-h-[44px] text-sm font-semibold text-black hover:bg-white active:scale-95 transition-all disabled:opacity-40"
      >
        {step === "idle" || step === "error" ? "Verify & Anchor" : stepLabel[step] + "…"}
      </button>

      <div className="mt-5 space-y-2 overflow-hidden">
        <AnimatePresence mode="popLayout">
          {step !== "idle" && step !== "error" && (
            <div className="space-y-2">
              {steps.map((s, i) => {
                const done = i < currentIdx || step === "done";
                const active = i === currentIdx && step !== "done";
                return (
                  <motion.div 
                    key={s} 
                    initial={{ x: 10, opacity: 0 }}
                    animate={{ x: 0, opacity: done ? 0.5 : active ? 1 : 0.3 }}
                    exit={{ x: -10, opacity: 0 }}
                    transition={{ duration: 0.3, ease: EXPO_OUT }}
                    className="flex items-center gap-3 text-xs"
                  >
                    <span className={`grid h-5 w-5 place-items-center rounded-full border transition-colors duration-300 ${done ? "border-[#00f6ff] bg-[#00f6ff]/20 text-[#00f6ff]" : active ? "border-[#00f6ff] text-[#00f6ff]" : "border-[#1a1a3a] text-[#555570]"}`}>
                      {done ? (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.2 }}>
                          <Check size={11} />
                        </motion.div>
                      ) : active ? <Loader2 size={11} className="animate-spin" /> : i + 1}
                    </span>
                    <span className={done || active ? "text-white" : "text-[#555570]"}>{stepLabel[s]}</span>
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex items-start gap-2 rounded-lg border border-[#7a00ff]/40 bg-[#7a00ff]/10 p-3 text-[10px] sm:text-xs text-[#f8f9fa]"
        >
          <AlertCircle size={14} className="mt-0.5 shrink-0 text-[#7a00ff]" />
          <span className="break-words">{error}</span>
        </motion.div>
      )}
    </motion.div>
  );
}
