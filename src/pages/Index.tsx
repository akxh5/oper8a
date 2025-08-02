
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Shield, Wallet, Globe } from 'lucide-react';
import WalletSelector from '../components/WalletSelector';
import HeroSection from '../components/HeroSection';
import FeatureGrid from '../components/FeatureGrid';

const Index = () => {
  const [isWalletSelectorOpen, setIsWalletSelectorOpen] = useState(false);

  return (
    <div className="min-h-screen bg-neo-cream text-neo-black overflow-hidden">
      {/* Neo-Brutalism background pattern */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Bold geometric shapes */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-neo-red transform rotate-12 border-4 border-neo-black shadow-neo-xl"></div>
        <div className="absolute bottom-40 left-10 w-24 h-24 bg-neo-blue transform rotate-[-15deg] border-4 border-neo-black shadow-neo-lg"></div>
        <div className="absolute top-1/2 right-1/3 w-20 h-20 bg-neo-yellow transform rotate-45 border-4 border-neo-black shadow-neo"></div>
        <div className="absolute bottom-20 right-1/4 w-16 h-16 bg-neo-green transform rotate-[-30deg] border-4 border-neo-black shadow-neo-lg"></div>
        <div className="absolute top-1/3 left-1/4 w-28 h-28 bg-neo-purple transform rotate-[25deg] border-4 border-neo-black shadow-neo-xl"></div>
        
        {/* Raw dots pattern */}
        <div className="absolute top-10 left-1/2 w-3 h-3 bg-neo-black"></div>
        <div className="absolute top-1/4 right-10 w-3 h-3 bg-neo-black"></div>
        <div className="absolute bottom-1/3 left-20 w-3 h-3 bg-neo-black"></div>
        <div className="absolute bottom-10 right-1/3 w-3 h-3 bg-neo-black"></div>
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="flex justify-between items-center p-6 md:p-8 relative z-10">
          <div className="flex items-center space-x-3">
            <div className="relative bg-neo-cyan border-3 border-neo-black p-2 transform rotate-[-5deg] shadow-neo">
              <Shield className="w-8 h-8 text-neo-black" />
            </div>
            <h1 className="text-2xl font-black text-neo-black transform rotate-[2deg]">
              Oper8a
            </h1>
          </div>
          <Button 
            onClick={() => setIsWalletSelectorOpen(true)}
            variant="brutal"
            className="bg-neo-purple border-neo-black text-neo-white hover:bg-neo-pink"
          >
            <Wallet className="w-4 h-4 mr-2" />
            Connect Wallet
          </Button>
        </nav>

        {/* Hero Section */}
        <HeroSection onConnectWallet={() => setIsWalletSelectorOpen(true)} />

        {/* Features Grid */}
        <FeatureGrid />

        {/* Powered by Solana */}
        <div className="text-center py-16 relative z-10">
          <div className="inline-flex items-center space-x-3 bg-neo-green border-3 border-neo-black px-6 py-3 transform rotate-[-1deg] shadow-neo-lg">
            <Globe className="w-5 h-5 text-neo-black" />
            <span className="text-sm font-black text-neo-black">Powered by Solana Blockchain</span>
          </div>
        </div>
      </div>

      {/* Wallet Selector Modal */}
      <WalletSelector 
        isOpen={isWalletSelectorOpen} 
        onClose={() => setIsWalletSelectorOpen(false)} 
      />
    </div>
  );
};

export default Index;
