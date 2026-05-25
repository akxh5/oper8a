import { useEffect, useState } from "react";
import { ExternalLink, FileIcon } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { fetchPinataFiles, type FileRecord } from "@/utils/pinataUtils";
import { truncateAddress } from "@/utils/blockchainUtils";
import { motion, AnimatePresence } from "framer-motion";

function formatBytes(b: number) {
  if (!b) return "0 B";
  const u = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(b) / Math.log(1024));
  return `${(b / Math.pow(1024, i)).toFixed(1)} ${u[i]}`;
}

const EXPO_OUT = [0.16, 1, 0.3, 1] as const;

export default function PersonalFiles() {
  const { pinataConfigured, refreshTick, selectedNetwork } = useApp();
  const [rows, setRows] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchData() {
    if (!pinataConfigured) return;
    setLoading(true);
    try {
      const r = await fetchPinataFiles();
      setRows(r);
    } catch (err) {
      // ignore
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
        <FileIcon size={16} className="text-[#00f6ff]" />
        <h3 className="font-display text-lg text-white">Personal Files</h3>
      </div>
      {!pinataConfigured ? (
        <p className="text-sm text-[#A0A0B8]">Configure IPFS to see pinned files.</p>
      ) : loading ? (
        <p className="text-xs text-[#555570]">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="text-xs text-[#555570]">No files yet.</p>
      ) : (
        <div className="max-h-[320px] space-y-1 overflow-auto pr-1 custom-scrollbar">
          <AnimatePresence mode="popLayout">
            {rows.map((r, i) => (
              <motion.a
                key={r.IpfsHash}
                href={r.ipfsUrl}
                target="_blank" rel="noreferrer"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04, ease: EXPO_OUT }}
                whileHover={{ backgroundColor: "rgba(0, 246, 255, 0.04)" }}
                className="flex items-center justify-between rounded-lg px-3 py-3 text-sm transition-colors duration-150 gap-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[#f8f9fa] font-medium">{r.name ?? "untitled"}</div>
                  <div className="text-[10px] text-[#555570] flex flex-wrap items-center gap-x-2">
                    <span className="font-mono">{truncateAddress(r.IpfsHash, 4, 4)}</span>
                    <span className="hidden xs:inline opacity-40">•</span>
                    <span className="hidden xs:inline">{formatBytes(r.size)}</span>
                    <span className="hidden sm:inline opacity-40">•</span>
                    <span className="hidden sm:inline">{new Date(r.uploadDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex h-8 w-8 items-center justify-center text-[#555570] hover:text-[#00f6ff] transition-colors bg-white/5 rounded-full shrink-0">
                  <ExternalLink size={14} />
                </div>
              </motion.a>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
