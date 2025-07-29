
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Shield, Wallet, Globe } from 'lucide-react';
import WalletSelector from '../components/WalletSelector';
import HeroSection from '../components/HeroSection';
import FeatureGrid from '../components/FeatureGrid';

const Index = () => {
  const [isWalletSelectorOpen, setIsWalletSelectorOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Animated background elements with bubbles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        
        {/* Floating bubbles */}
        <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-white/5 rounded-full animate-[float_6s_ease-in-out_infinite] blur-sm"></div>
        <div className="absolute top-3/4 right-1/4 w-8 h-8 bg-purple-400/10 rounded-full animate-[float_4s_ease-in-out_infinite_2s] blur-sm"></div>
        <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-cyan-400/5 rounded-full animate-[float_8s_ease-in-out_infinite_1s] blur-sm"></div>
        <div className="absolute bottom-1/4 left-1/3 w-10 h-10 bg-blue-400/8 rounded-full animate-[float_5s_ease-in-out_infinite_3s] blur-sm"></div>
        <div className="absolute top-1/6 right-1/6 w-6 h-6 bg-green-400/6 rounded-full animate-[float_7s_ease-in-out_infinite_1.5s] blur-sm"></div>
        <div className="absolute bottom-1/3 right-1/2 w-14 h-14 bg-pink-400/4 rounded-full animate-[float_6s_ease-in-out_infinite_2.5s] blur-sm"></div>
        
        {/* Additional bubbles */}
        <div className="absolute top-10 left-1/2 w-20 h-20 bg-yellow-400/3 rounded-full animate-[float_9s_ease-in-out_infinite] blur-md"></div>
        <div className="absolute bottom-10 left-1/5 w-7 h-7 bg-red-400/7 rounded-full animate-[float_3s_ease-in-out_infinite_1s] blur-sm"></div>
        <div className="absolute top-2/3 left-1/6 w-11 h-11 bg-indigo-400/6 rounded-full animate-[float_7s_ease-in-out_infinite_3s] blur-sm"></div>
        <div className="absolute top-1/3 right-1/5 w-9 h-9 bg-teal-400/8 rounded-full animate-[float_5s_ease-in-out_infinite_2s] blur-sm"></div>
        <div className="absolute bottom-1/5 right-1/3 w-13 h-13 bg-orange-400/5 rounded-full animate-[float_8s_ease-in-out_infinite_4s] blur-md"></div>
        <div className="absolute top-1/5 left-2/3 w-5 h-5 bg-violet-400/9 rounded-full animate-[float_4s_ease-in-out_infinite_1.5s] blur-sm"></div>
        <div className="absolute bottom-2/3 right-1/4 w-15 h-15 bg-emerald-400/4 rounded-full animate-[float_10s_ease-in-out_infinite_2s] blur-lg"></div>
        <div className="absolute top-3/4 left-1/3 w-4 h-4 bg-rose-400/8 rounded-full animate-[float_6s_ease-in-out_infinite_3s] blur-sm"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="flex justify-between items-center p-6 md:p-8">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Shield className="w-8 h-8 text-cyan-400" />
              <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-md"></div>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Oper8a
            </h1>
          </div>
          <Button 
            onClick={() => setIsWalletSelectorOpen(true)}
            className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105"
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
        <div className="text-center py-16">
          <div className="inline-flex items-center space-x-3 bg-white/5 backdrop-blur-sm rounded-full px-6 py-3 border border-white/10">
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
    </div>
  );
};

export default Index;
