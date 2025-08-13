import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Shield, Wallet, Globe } from 'lucide-react';
import WalletSelector from '../components/WalletSelector';
import HeroSection from '../components/HeroSection';
import FeatureGrid from '../components/FeatureGrid';
import Footer from '../components/Footer';

const Index = () => {
  const [isWalletSelectorOpen, setIsWalletSelectorOpen] = useState(false);

  return (
    <div className="min-h-screen text-white overflow-hidden animate-[auroraMove_30s_ease-in-out_infinite]">

      <div className="absolute inset-0 bg-black/40 z-0"></div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] z-10"></div>

      <div className="relative z-20">
        {/* Navigation */}
        <nav className="glass-panel flex justify-between items-center p-6 md:p-8 border border-white/20 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Shield className="w-8 h-8 text-cyan-400/90" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[var(--aurora-cyan)] to-[var(--aurora-violet)] bg-clip-text text-transparent">
              Oper8a
            </h1>
          </div>
          <Button 
            variant="aurora" 
            size="pill"
            onClick={() => setIsWalletSelectorOpen(true)}
          >
            <Wallet className="w-4 h-4 mr-2" />
            Connect Wallet
          </Button>
        </nav>

        {/* Hero Section */}
        <div className="mx-auto max-w-5xl p-4 mt-4">
          <HeroSection
            onConnectWallet={() => setIsWalletSelectorOpen(true)}
            title="Welcome to Oper8a"
          />
        </div>

        {/* Features Grid */}
        <div className="mx-auto max-w-6xl p-6 mt-4 -mt-6 relative z-10">
          <FeatureGrid />
        </div>

        {/* Powered by Solana */}
        <div className="text-center py-16">
          <div className="inline-flex items-center space-x-3 glass-panel px-6 py-3 border border-white/20">
            <Globe className="w-5 h-5 text-green-400" />
            <span className="text-sm font-medium">Powered by Solana Blockchain</span>
          </div>
        </div>
      </div>

      {/* Wallet Selector Modal */}
      <WalletSelector 
        isOpen={isWalletSelectorOpen} 
        onClose={() => setIsWalletSelectorOpen(false)} 
      />
      <Footer />
    </div>
  );
};

export default Index;
