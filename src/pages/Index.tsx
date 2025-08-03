import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Shield, Wallet, Globe, Zap, Lock, Network } from 'lucide-react';
import WalletSelector from '../components/WalletSelector';
import HeroSection from '../components/HeroSection';
import FeatureGrid from '../components/FeatureGrid';

const Index = () => {
  const [isWalletSelectorOpen, setIsWalletSelectorOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0b2e] via-[#0a0a0a] to-[#16213e] text-white overflow-hidden relative">
      {/* Neo-Brutalism Grid Background */}
      <div className="absolute inset-0 brutal-grid opacity-30"></div>
      
      {/* Animated background elements with neo-brutal styling */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large geometric shapes */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-600 to-emerald-400 opacity-20 transform rotate-45 brutal-bounce"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-emerald-400 to-purple-600 opacity-20 transform rotate-12"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 border-4 border-emerald-400 opacity-10 rotate-45"></div>
        
        {/* Floating brutal elements */}
        <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-emerald-400 shadow-[4px_4px_0px_0px_#000000] animate-[float_6s_ease-in-out_infinite]"></div>
        <div className="absolute top-3/4 right-1/4 w-12 h-12 bg-purple-600 border-4 border-white shadow-[4px_4px_0px_0px_#ffffff] animate-[float_4s_ease-in-out_infinite_2s]"></div>
        <div className="absolute top-1/2 right-1/3 w-20 h-20 border-4 border-emerald-400 animate-[float_8s_ease-in-out_infinite_1s]"></div>
        <div className="absolute bottom-1/4 left-1/3 w-14 h-14 bg-gradient-to-br from-purple-600 to-emerald-400 shadow-[6px_6px_0px_0px_#000000] animate-[float_5s_ease-in-out_infinite_3s]"></div>
        
        {/* Additional geometric elements */}
        <div className="absolute top-1/6 right-1/6 w-8 h-8 bg-emerald-400 transform rotate-45 animate-[float_7s_ease-in-out_infinite_1.5s]"></div>
        <div className="absolute bottom-1/3 right-1/2 w-24 h-6 bg-purple-600 border-2 border-white shadow-[4px_4px_0px_0px_#ffffff] animate-[float_6s_ease-in-out_infinite_2.5s]"></div>
        <div className="absolute top-10 left-1/2 w-32 h-32 border-4 border-purple-600 opacity-20 transform rotate-12 animate-[float_9s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-10 left-1/5 w-10 h-10 bg-emerald-400 shadow-[2px_2px_0px_0px_#000000] animate-[float_3s_ease-in-out_infinite_1s]"></div>
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="flex justify-between items-center p-6 md:p-8 border-b-4 border-emerald-400 bg-black/80 backdrop-blur-sm">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-emerald-400 border-4 border-black shadow-[4px_4px_0px_0px_#000000] flex items-center justify-center">
                <Shield className="w-6 h-6 text-black" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold neon-text font-mono tracking-wider">
                OPER8A
              </h1>
              <p className="text-xs text-emerald-400 font-mono uppercase tracking-widest">
                BLOCKCHAIN VERIFIED
              </p>
            </div>
          </div>
          <Button 
            onClick={() => setIsWalletSelectorOpen(true)}
            className="brutal-button text-lg px-8 py-4 uppercase tracking-wider font-bold"
          >
            <Wallet className="w-5 h-5 mr-3" />
            CONNECT WALLET
          </Button>
        </nav>

        {/* Hero Section */}
        <div className="container mx-auto px-6 py-20 text-center">
          <div className="max-w-6xl mx-auto">
            {/* Main Title */}
            <div className="mb-12">
              <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight uppercase tracking-wider">
                <span className="block text-white">SECURE YOUR</span>
                <span className="block neon-text glitch-text">FILES WITH</span>
                <span className="block bg-gradient-to-r from-purple-400 to-emerald-400 bg-clip-text text-transparent">
                  BLOCKCHAIN
                </span>
              </h1>
              
              <div className="w-full h-2 bg-emerald-400 shadow-[0_4px_0px_0px_#000000] mb-8"></div>
              
              <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed max-w-4xl mx-auto font-mono">
                CONNECT YOUR WALLET TO START MANAGING AND VERIFYING FILES ACROSS YOUR TRUSTED NETWORKS 
                WITH <span className="neon-text font-bold">ENHANCED SECURITY</span> AND <span className="text-purple-400 font-bold">RELIABILITY</span>.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Button 
                onClick={() => setIsWalletSelectorOpen(true)}
                className="brutal-button text-xl px-12 py-6 uppercase tracking-wider font-black"
              >
                <Wallet className="w-6 h-6 mr-4" />
                SELECT WALLET
              </Button>
              <Button 
                className="brutal-button-secondary text-xl px-12 py-6 uppercase tracking-wider font-black"
              >
                <Shield className="w-6 h-6 mr-4" />
                LEARN MORE
              </Button>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="brutal-card p-8 text-center">
                <div className="text-4xl font-black neon-text mb-2">100%</div>
                <div className="text-emerald-400 font-mono uppercase tracking-wider">SECURE</div>
              </div>
              <div className="brutal-card p-8 text-center">
                <div className="text-4xl font-black text-purple-400 mb-2">INSTANT</div>
                <div className="text-purple-400 font-mono uppercase tracking-wider">VERIFICATION</div>
              </div>
              <div className="brutal-card p-8 text-center">
                <div className="text-4xl font-black text-white mb-2">ZERO</div>
                <div className="text-white font-mono uppercase tracking-wider">DOWNTIME</div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <FeatureGrid />

        {/* Powered by Solana */}
        <div className="text-center py-16 border-t-4 border-emerald-400 bg-black/80">
          <div className="inline-flex items-center space-x-4 brutal-card p-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-emerald-400 border-4 border-white shadow-[4px_4px_0px_0px_#000000] flex items-center justify-center">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <div className="text-2xl font-black text-white uppercase tracking-wider">POWERED BY</div>
              <div className="text-xl font-bold neon-text font-mono">SOLANA BLOCKCHAIN</div>
            </div>
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