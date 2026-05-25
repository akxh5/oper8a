import { useEffect, useState } from "react";
import { Users, Shield, Award } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { getUserElo } from "@/utils/networkUtils";
import { truncateAddress } from "@/utils/blockchainUtils";
import { motion, AnimatePresence } from "framer-motion";

interface MemberWithElo {
  wallet: string;
  role: "admin" | "member";
  reputation: number;
  elo: number;
}

const EXPO_OUT = [0.16, 1, 0.3, 1] as any;

export default function NetworkMembers() {
  const { selectedNetwork, refreshTick } = useApp();
  const [members, setMembers] = useState<MemberWithElo[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedNetwork) return;
    let cancelled = false;
    setLoading(true);

    const loadMembers = async () => {
      try {
        const results = await Promise.all(
          (selectedNetwork.members || []).map(async (m) => {
            const addr = m.walletAddress;
            let elo = 2701;
            try {
              elo = await getUserElo(addr);
            } catch (err) {
              console.warn(`Failed to fetch ELO for ${addr}`, err);
            }
            return {
              wallet: addr,
              role: m.role,
              reputation: m.reputation,
              elo
            };
          })
        );
        if (!cancelled) {
          setMembers(results);
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to load members:", err);
        if (!cancelled) setLoading(false);
      }
    };

    loadMembers();
    return () => { cancelled = true; };
  }, [selectedNetwork?.id, refreshTick]);

  return (
    <motion.div 
      whileHover={{ scale: 1.008 }}
      className="glass p-4 sm:p-5 lg:p-6 transition-[border-color,box-shadow] duration-300 w-full"
    >
      <div className="mb-4 flex items-center gap-2">
        <Users size={16} className="text-[#00f6ff]" />
        <h3 className="font-display text-lg text-white">Network Members</h3>
      </div>

      {!selectedNetwork ? (
        <p className="text-sm text-[#A0A0B8]">Select a network to see members.</p>
      ) : loading ? (
        <p className="text-xs text-[#555570]">Loading members...</p>
      ) : (
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {members.map((m, i) => (
              <motion.div 
                key={m.wallet} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05, ease: EXPO_OUT }}
                className="flex items-center justify-between rounded-lg bg-black/20 p-3 border border-[#1a1a3a] gap-3"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="grid h-8 w-8 place-items-center rounded-full bg-[#00f6ff]/10 text-[#00f6ff] shrink-0">
                    {m.role === "admin" ? <Shield size={14} /> : <Users size={14} />}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-mono text-white truncate">
                      {truncateAddress(m.wallet, 4, 4)}
                    </div>
                    <div className="text-[9px] uppercase tracking-wider text-[#555570] font-medium">{m.role}</div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="flex items-center gap-1 text-xs font-bold text-[#00f6ff]">
                    <Award size={10} /> {m.elo}
                  </div>
                  <div className="text-[9px] uppercase tracking-tighter text-[#555570]">ELO</div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
