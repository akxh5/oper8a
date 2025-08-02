
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Shield, Wallet, Globe } from 'lucide-react';
import WalletSelector from '../components/WalletSelector';
import HeroSection from '../components/HeroSection';
import FeatureGrid from '../components/FeatureGrid';

const Index = () => {
  const [isWalletSelectorOpen, setIsWalletSelectorOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FFE5E5] relative overflow-hidden">
      {/* Neo-brutalist background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF4F4F] rotate-12 transform -translate-y-24 translate-x-24" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#00FF8C] -rotate-6 transform translate-y-24 -translate-x-24" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-[#FFD23F] rotate-45 transform -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-16">
          {/* Hero section */}
          <div className="border-4 border-black bg-white p-8 transform hover:-rotate-1 transition-transform duration-300 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h1 className="text-6xl font-black mb-6 text-black tracking-tight leading-none">
              Welcome to OPER8A
            </h1>
            <p className="text-2xl font-bold text-black/80 mb-8 max-w-2xl">
              Your gateway to decentralized operations and secure network management.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={() => setIsWalletSelectorOpen(true)}
                className="bg-[#FF4F4F] text-white text-xl px-8 py-6 border-4 border-black transform hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
              >
                <Wallet className="mr-2 h-6 w-6" />
                Connect Wallet
              </Button>
              <Button 
                variant="outline"
                className="bg-[#00FF8C] text-black text-xl px-8 py-6 border-4 border-black transform hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
              >
                <Globe className="mr-2 h-6 w-6" />
                Explore Networks
              </Button>
            </div>
          </div>

          {/* Feature grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature cards */}
            <div className="border-4 border-black bg-[#FFD23F] p-6 transform rotate-2 hover:rotate-0 transition-transform duration-300 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <Shield className="h-12 w-12 mb-4 text-black" />
              <h3 className="text-2xl font-bold text-black mb-2">Secure Networks</h3>
              <p className="text-black/80 font-medium">
                Create and manage secure decentralized networks with confidence.
              </p>
            </div>
            
            <div className="border-4 border-black bg-[#FF4F4F] p-6 transform -rotate-1 hover:rotate-0 transition-transform duration-300 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <Wallet className="h-12 w-12 mb-4 text-white" />
              <h3 className="text-2xl font-bold text-white mb-2">Easy Integration</h3>
              <p className="text-white/80 font-medium">
                Connect your wallet and start managing your decentralized operations instantly.
              </p>
            </div>
            
            <div className="border-4 border-black bg-[#00FF8C] p-6 transform rotate-1 hover:rotate-0 transition-transform duration-300 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <Globe className="h-12 w-12 mb-4 text-black" />
              <h3 className="text-2xl font-bold text-black mb-2">Global Network</h3>
              <p className="text-black/80 font-medium">
                Join a worldwide network of operators building the future of decentralization.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Wallet selector modal */}
      <WalletSelector
        isOpen={isWalletSelectorOpen}
        onClose={() => setIsWalletSelectorOpen(false)}
      />
    </div>
  );
};

export default Index;
