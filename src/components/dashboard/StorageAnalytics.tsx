import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { HardDrive } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { getPinataStorageStats } from "@/utils/pinataUtils";
import { motion } from "framer-motion";

function formatBytes(b: number) {
  if (!b) return "0 B";
  const u = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(b) / Math.log(1024));
  return `${(b / Math.pow(1024, i)).toFixed(1)} ${u[i]}`;
}

export default function StorageAnalytics() {
  const { pinataConfigured, refreshTick } = useApp();
  const [used, setUsed] = useState(0);
  const [limit, setLimit] = useState(1024 * 1024 * 1024); // 1 GB default
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!pinataConfigured) return;
    let cancelled = false;
    setLoading(true);
    getPinataStorageStats()
      .then((d) => {
        if (cancelled) return;
        setUsed(d.used ?? 0);
        setLimit(d.limit ?? 1024 * 1024 * 1024);
      })
      .catch(() => { /* ignore */ })
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [pinataConfigured, refreshTick]);

  if (!pinataConfigured) {
    return (
      <div className="glass p-4 sm:p-5 lg:p-6 w-full">
        <div className="mb-2 flex items-center gap-2">
          <HardDrive size={16} className="text-[#00f6ff]" />
          <h3 className="font-display text-lg text-white">Storage</h3>
        </div>
        <p className="text-sm text-[#A0A0B8]">Configure IPFS to view analytics.</p>
      </div>
    );
  }

  const free = Math.max(limit - used, 0);
  const data = [
    { name: "Used", value: used || 1 },
    { name: "Free", value: free || limit },
  ];

  return (
    <motion.div 
      whileHover={{ scale: 1.008 }}
      style={{ overflow: "visible" }}
      className="glass p-4 sm:p-5 lg:p-6 transition-[border-color,box-shadow] duration-300 w-full"
    >
      <div className="mb-4 flex items-center gap-2">
        <HardDrive size={16} className="text-[#00f6ff]" />
        <h3 className="font-display text-lg text-white">Storage</h3>
      </div>
      <div className="flex flex-col xs:flex-row items-center gap-6">
        <div className="relative shrink-0" style={{ width: "100%", minHeight: "200px" }}>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={data} dataKey="value" innerRadius={42} outerRadius={60} startAngle={90} endAngle={-270} stroke="none">
                <Cell fill="#00f6ff" />
                <Cell fill="#1a1a3a" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 grid place-items-center text-center">
            <HardDrive size={20} className="text-[#00f6ff]" />
          </div>
        </div>
        <div className="flex-1 space-y-3 text-center xs:text-left w-full min-w-0">
          <div className="w-full">
            <div className="text-[10px] sm:text-xs text-[#A0A0B8] uppercase tracking-wider">Pinned Storage</div>
            <div className="font-display text-xl sm:text-2xl text-[#f8f9fa] truncate">
              {loading ? "…" : formatBytes(used)}
            </div>
          </div>
          <div className="w-full">
            <div className="text-[10px] sm:text-xs text-[#A0A0B8] uppercase tracking-wider">Account Limit</div>
            <div className="text-xs sm:text-sm text-[#f8f9fa] truncate">{formatBytes(limit)}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
