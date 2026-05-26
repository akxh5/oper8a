"use client";

import { useEffect, useState } from "react";
import { Plus, KeyRound, Users } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/context/AppContext";
import { 
  createNetwork, 
  joinNetwork, 
  getUserNetworks, 
  type Network as BackendNetwork 
} from "@/utils/networkUtils";
import { type Network } from "@/context/AppContext";
import { motion } from "framer-motion";

const EXPO_OUT = [0.16, 1, 0.3, 1] as any;

export default function NetworkManager() {
  const { walletAddress, selectedNetwork, setSelectedNetwork, refreshFiles } = useApp();
  const [networks, setNetworks] = useState<Network[]>([]);
  const [createName, setCreateName] = useState("");
  const [joinKey, setJoinKey] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    if (!walletAddress) return;
    try {
      const list = await getUserNetworks(walletAddress) as unknown as Network[];
      setNetworks(list);
      if (!selectedNetwork && list[0]) setSelectedNetwork(list[0]);
    } catch (e) {
      console.error("Failed to load networks:", e);
    }
  }

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [walletAddress]);

  async function create() {
    if (!walletAddress) return;
    if (!createName.trim()) return toast.error("Network name required");
    setLoading(true);
    try {
      const newNet = await createNetwork(createName.trim(), walletAddress, "User") as unknown as Network;
      toast.success("Network created");
      setCreateName("");
      refreshFiles();
      setNetworks(prev => [...prev, newNet]);
      setSelectedNetwork(newNet);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Create failed");
    } finally { setLoading(false); }
  }

  async function join() {
    if (!walletAddress) return;
    if (!joinKey.trim()) return toast.error("Join key required");
    setLoading(true);
    try {
      const joinedNet = await joinNetwork(joinKey.trim(), walletAddress, "User") as unknown as Network;
      toast.success("Joined network");
      setJoinKey("");
      refreshFiles();
      await load();
      setSelectedNetwork(joinedNet);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Join failed");
    } finally { setLoading(false); }
  }

  return (
    <motion.div 
      whileHover={{ scale: 1.008 }}
      className="glass p-4 sm:p-5 lg:p-6 transition-[border-color,box-shadow] duration-300 w-full"
    >
      <div className="mb-4 flex items-center gap-2">
        <Users size={16} className="text-[#00f6ff]" />
        <h3 className="font-display text-lg text-white">Networks</h3>
      </div>

      <div className="mb-5 space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            value={createName} onChange={(e) => setCreateName(e.target.value)}
            placeholder="New network name"
            className="flex-1 rounded-lg border border-[#1a1a3a] bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-[#00f6ff] min-h-[40px]"
          />
          <button onClick={create} disabled={loading}
            className="flex items-center justify-center gap-1 rounded-lg bg-[#00f6ff] px-4 py-2 text-xs font-semibold text-black hover:bg-white disabled:opacity-50 min-h-[40px]">
            <Plus size={14} /> Create
          </button>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            value={joinKey} onChange={(e) => setJoinKey(e.target.value)}
            placeholder="Join key (e.g. AB12CD34)"
            className="flex-1 rounded-lg border border-[#1a1a3a] bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-[#00f6ff] min-h-[40px]"
          />
          <button onClick={join} disabled={loading}
            className="flex items-center justify-center gap-1 rounded-lg border border-[#1a1a3a] px-4 py-2 text-xs text-[#f8f9fa] hover:border-[#00f6ff] hover:text-[#00f6ff] disabled:opacity-50 min-h-[40px]">
            <KeyRound size={14} /> Join
          </button>
        </div>
      </div>

      <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
        {networks.length === 0 && (
          <p className="text-xs text-[#555570]">No networks yet. Create one or join with a key.</p>
        )}
        {networks.map((n) => {
          const active = selectedNetwork?.id === n.id;
          return (
            <motion.button
              key={n.id}
              onClick={() => setSelectedNetwork(n)}
              whileHover={{ scale: 1.01 }}
              className={`relative flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left transition-all duration-300 min-h-[56px] ${
                active
                  ? "border-[#00f6ff] bg-[#00f6ff]/5"
                  : "border-[#1a1a3a] bg-black/20 hover:border-[#00f6ff]/50"
              }`}
            >
              {active && (
                <motion.div 
                  layoutId="active-network-indicator"
                  className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#00f6ff]"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.2, ease: EXPO_OUT }}
                  style={{ originY: 1 }}
                />
              )}
              <div className="min-w-0 pr-2">
                <div className="text-sm text-white truncate font-medium">{n.name}</div>
                <div className="text-[10px] text-[#555570] flex items-center gap-2 flex-wrap">
                  <span>Key: {n.joinKey} · {n.members?.length ?? 0} members</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.clipboard.writeText(n.joinKey);
                      toast.success('Join key copied!');
                    }}
                    className="text-xs text-accent-cyan hover:text-white transition-colors cursor-pointer"
                  >
                    Copy Key
                  </button>
                </div>
              </div>
              {active && <span className="text-[10px] text-[#00f6ff] shrink-0 font-bold uppercase tracking-tighter">Active</span>}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
