import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { db } from "@/lib/firebase";
import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";

interface Alert {
  id: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  fileName?: string;
}

const EXPO_OUT = [0.16, 1, 0.3, 1] as const;

export default function NetworkAlerts() {
  const { selectedNetwork, refreshTick } = useApp();
  const [alerts, setAlerts] = useState<Alert[]>([]);

  async function load() {
    if (!selectedNetwork) { setAlerts([]); return; }
    const snap = await getDocs(query(
      collection(db, "networkAlerts"),
      where("networkId", "==", selectedNetwork.id),
    ));
    setAlerts(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Alert, "id">) }))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [selectedNetwork, refreshTick]);

  async function markRead(id: string) {
    await updateDoc(doc(db, "networkAlerts", id), { isRead: true });
    // Animate out locally first for immediate feedback
    setAlerts(prev => prev.filter(a => a.id !== id));
  }

  return (
    <motion.div 
      whileHover={{ scale: 1.008 }}
      className="glass p-6 transition-[border-color,box-shadow] duration-300"
    >
      <div className="mb-4 flex items-center gap-2">
        <Bell size={16} className="text-[#00f6ff]" />
        <h3 className="font-display text-lg text-white">Alerts</h3>
      </div>
      {!selectedNetwork ? (
        <p className="text-sm text-[#A0A0B8]">Select a network to view alerts.</p>
      ) : alerts.length === 0 ? (
        <p className="text-xs text-[#555570]">No alerts.</p>
      ) : (
        <div className="max-h-64 space-y-2 overflow-auto pr-1">
          <AnimatePresence mode="popLayout">
            {alerts.map((a) => (
              <motion.button
                key={a.id} 
                onClick={() => !a.isRead && markRead(a.id)}
                initial={{ x: 16, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -32, opacity: 0 }}
                transition={{ duration: 0.3, ease: EXPO_OUT }}
                whileHover={{ backgroundColor: "rgba(0, 246, 255, 0.04)" }}
                className="flex w-full items-start justify-between gap-3 rounded-lg border border-[#1a1a3a] bg-black/20 px-3 py-3 text-left transition-colors duration-150"
              >
                <div className="flex items-start gap-2 text-left">
                  <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${a.isRead ? "bg-[#555570]" : "animate-pulse bg-[#00f6ff]"}`} />
                  <div>
                    <div className="text-sm text-[#f8f9fa]">
                      {a.type === "duplicate" ? "Duplicate upload blocked" : a.type}
                    </div>
                    <div className="text-[10px] text-[#555570]">
                      {a.fileName} · {new Date(a.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
                {!a.isRead && <span className="text-[10px] text-[#00f6ff] shrink-0">mark read</span>}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
