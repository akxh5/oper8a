
import React from 'react';
import { Button } from "@/components/ui/button";
import { Wallet, ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onConnectWallet: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onConnectWallet }) => {
  return (
    <div className="container mx-auto px-6 py-20 text-center">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
          Welcome to{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
            Operata
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto">
          Connect your wallet to start managing and verifying files across your trusted networks 
          with enhanced security and reliability.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            onClick={onConnectWallet}
            size="lg"
            className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-cyan-500/25"
          >
            <Wallet className="w-5 h-5 mr-3" />
            Select Wallet
            <ArrowRight className="w-5 h-5 ml-3" />
          </Button>
        </div>

        {/* Floating elements */}
        <div className="mt-16 relative">
          <div className="absolute top-0 left-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
          <div className="absolute top-8 right-1/4 w-1 h-1 bg-purple-400 rounded-full animate-ping delay-1000"></div>
          <div className="absolute bottom-0 left-1/3 w-1.5 h-1.5 bg-pink-400 rounded-full animate-ping delay-2000"></div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
