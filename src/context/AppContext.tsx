import * as React from "react";
import { createContext, useContext, useEffect, useState, useCallback } from "react";

export interface NetworkMember {
  walletAddress: string;
  role: "admin" | "member";
  reputation: number;
  username?: string;
  joinedAt?: string;
}

export interface Network {
  id: string;
  name: string;
  adminWallet: string;
  joinKey: string;
  members: NetworkMember[];
  createdAt?: string;
}

interface AppContextValue {
  walletAddress: string | null;
  setWalletAddress: (addr: string | null) => void;
  selectedNetwork: Network | null;
  setSelectedNetwork: (n: Network | null) => void;
  pinataConfigured: boolean;
  setPinataConfigured: (b: boolean) => void;
  refreshTick: number;
  refreshFiles: () => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [walletAddress, setWalletAddressState] = useState<string | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null);
  const [pinataConfigured, setPinataConfigured] = useState(false);
  const [refreshTick, setRefreshTick] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    // Read on mount
    const savedAddress = localStorage.getItem("walletAddress");
    const savedConnected = localStorage.getItem("walletConnected");
    if (savedAddress && savedConnected === "true") {
      setWalletAddressState(savedAddress);
    }
    
    if (localStorage.getItem("pinata_api_key")) {
      setPinataConfigured(true);
    }

    // Also listen for storage changes (cross-tab)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'walletAddress' && e.newValue) {
        setWalletAddressState(e.newValue);
      }
      if (e.key === 'walletConnected' && e.newValue === 'false') {
        setWalletAddressState(null);
      }
    };
    
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const setWalletAddress = useCallback((addr: string | null) => {
    setWalletAddressState(addr);
    if (typeof window === "undefined") return;
    if (addr) {
      localStorage.setItem("walletAddress", addr);
      localStorage.setItem("walletConnected", "true");
    } else {
      localStorage.removeItem("walletAddress");
      localStorage.removeItem("walletConnected");
    }
  }, []);

  const refreshFiles = useCallback(() => setRefreshTick((t) => t + 1), []);

  return (
    <AppContext.Provider
      value={{
        walletAddress,
        setWalletAddress,
        selectedNetwork,
        setSelectedNetwork,
        pinataConfigured,
        setPinataConfigured,
        refreshTick,
        refreshFiles,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
