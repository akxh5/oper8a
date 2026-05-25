import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Stats from "@/components/Stats";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import WalletSelector from "@/components/WalletSelector";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "oper8a — File Integrity, On-Chain" },
      {
        name: "description",
        content:
          "Oper8a anchors every file to the Solana blockchain. Tamper-proof, verifiable, permanent.",
      },
      { property: "og:title", content: "oper8a — File Integrity, On-Chain" },
      {
        property: "og:description",
        content: "Blockchain-Powered File Verification & Management on Solana + IPFS.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [walletOpen, setWalletOpen] = useState(false);
  return (
    <main className="min-h-screen bg-[#050320] text-[#f8f9fa] overflow-x-hidden w-full relative">
      <Navbar onConnect={() => setWalletOpen(true)} />
      <Hero onConnect={() => setWalletOpen(true)} />
      <Features />
      <Stats />
      <Testimonials />
      <Footer />
      <WalletSelector open={walletOpen} onClose={() => setWalletOpen(false)} />
    </main>
  );
}
