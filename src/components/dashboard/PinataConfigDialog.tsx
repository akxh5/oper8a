import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getPinataKeys, savePinataKeys, testPinataConnection } from "@/utils/pinataUtils";
import { useApp } from "@/context/AppContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function PinataConfigDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { setPinataConfigured } = useApp();
  const [apiKey, setApi] = useState("");
  const [secret, setSecret] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      const { apiKey: k, secretKey: s } = getPinataKeys();
      setApi(k || "");
      setSecret(s || "");
    }
  }, [open]);

  async function save() {
    if (!apiKey || !secret) {
      toast.error("Both API key and secret are required");
      return;
    }
    setSaving(true);
    try {
      const ok = await testPinataConnection(apiKey, secret);
      if (!ok) throw new Error("Auth failed");
      savePinataKeys(apiKey, secret);
      setPinataConfigured(true);
      toast.success("Pinata connected");
      onClose();
    } catch {
      toast.error("Could not authenticate with Pinata. Check your keys.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="z-[100] glass border-[#1a1a3a] max-w-md p-8 bg-[#050320]/95 backdrop-blur-2xl">
        <DialogHeader className="text-left">
          <DialogTitle className="font-display text-2xl text-white">Configure IPFS</DialogTitle>
          <DialogDescription className="text-sm text-[#A0A0B8]">
            Stored locally in your browser. Get keys from{" "}
            <a href="https://app.pinata.cloud/developers/api-keys" target="_blank" rel="noreferrer" className="text-[#00f6ff] hover:underline">
              Pinata
            </a>.
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          <label className="mb-1 block text-xs uppercase tracking-wider text-[#555570]">API Key</label>
          <input
            value={apiKey} onChange={(e) => setApi(e.target.value)}
            className="mb-4 w-full rounded-lg border border-[#1a1a3a] bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-[#00f6ff] transition-colors"
            placeholder="abc123..."
          />
          <label className="mb-1 block text-xs uppercase tracking-wider text-[#555570]">Secret Key</label>
          <input
            type="password" value={secret} onChange={(e) => setSecret(e.target.value)}
            className="mb-6 w-full rounded-lg border border-[#1a1a3a] bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-[#00f6ff] transition-colors"
            placeholder="••••••••"
          />
          <button
            onClick={save} disabled={saving}
            className="w-full rounded-full bg-[#00f6ff] px-5 py-2.5 text-sm font-semibold text-black hover:bg-white disabled:opacity-50 transition-all shadow-[0_0_20px_rgba(0,246,255,0.2)]"
          >
            {saving ? "Verifying…" : "Save & Verify"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
