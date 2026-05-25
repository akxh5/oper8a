import { useEffect, useState } from "react";
import { ExternalLink, ShieldCheck, FolderOpen } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { getNetworkFilesByNetworkId, type NetworkFileRecord } from "@/utils/networkUtils";
import { solanaExplorerTx } from "@/utils/blockchainUtils";
import { motion, AnimatePresence } from "framer-motion";

const EXPO_OUT = [0.16, 1, 0.3, 1] as const;

export default function NetworkFiles() {
  const { selectedNetwork, refreshTick } = useApp();
  const [rows, setRows] = useState<NetworkFileRecord[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchData() {
    if (!selectedNetwork) {
      setRows([]);
      return;
    }
    setLoading(true);
    try {
      const r = await getNetworkFilesByNetworkId(selectedNetwork.id);
      setRows(r);
    } catch (err) {
      console.error("Failed to fetch network files:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [refreshTick, selectedNetwork?.id]);

  return (
    <motion.div 
      whileHover={{ scale: 1.008 }}
      className="glass p-4 sm:p-5 lg:p-6 transition-[border-color,box-shadow] duration-300 w-full"
    >
      <div className="mb-4 flex items-center gap-2">
        <FolderOpen size={16} className="text-[#00f6ff]" />
        <h3 className="font-display text-lg text-white">Network Files</h3>
      </div>
      {!selectedNetwork ? (
        <p className="text-sm text-[#A0A0B8]">Select a network to view shared files.</p>
      ) : loading ? (
        <p className="text-xs text-[#555570]">Loading files...</p>
      ) : rows.length === 0 ? (
        <p className="text-xs text-[#555570]">No files anchored yet.</p>
      ) : (
        <div className="max-h-[320px] space-y-1 overflow-auto pr-1 custom-scrollbar">
          <AnimatePresence mode="popLayout">
            {rows.map((r, i) => (
              <motion.div 
                key={r.id} 
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04, ease: EXPO_OUT }}
                whileHover={{ backgroundColor: "rgba(0, 246, 255, 0.04)" }}
                className="flex items-center justify-between rounded-lg px-3 py-3 text-sm transition-colors duration-150 gap-4"
              >
                <div className="min-w-0 flex-1 text-left">
                  <div className="truncate text-[#f8f9fa] font-medium">{r.fileName}</div>
                  <div className="text-[10px] text-[#555570] flex flex-wrap items-center gap-x-2">
                    <span className="truncate">{r.uploaderUsername}</span>
                    <span className="hidden sm:inline opacity-40">•</span>
                    <span className="hidden xs:inline">{new Date(r.uploadDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2 md:gap-3">
                  {r.blockchainTx && (
                    <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-[#00f6ff]/10 px-2 py-0.5 text-[9px] text-[#00f6ff] border border-[#00f6ff]/20">
                      <ShieldCheck size={10} /> On-Chain
                    </span>
                  )}
                  <div className="flex items-center gap-2">
                    {r.ipfsUrl && (
                      <a href={r.ipfsUrl} target="_blank" rel="noreferrer" className="flex h-8 w-8 items-center justify-center text-[#555570] hover:text-[#00f6ff] transition-colors bg-white/5 rounded-full">
                        <FolderOpen size={14} />
                      </a>
                    )}
                    {r.blockchainTx && (
                      <a href={solanaExplorerTx(r.blockchainTx)} target="_blank" rel="noreferrer" className="flex h-8 w-8 items-center justify-center text-[#555570] hover:text-[#00f6ff] transition-colors bg-white/5 rounded-full">
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
