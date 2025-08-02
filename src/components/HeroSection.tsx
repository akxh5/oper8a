
import React from 'react';
import { Button } from "@/components/ui/button";
import { Wallet, ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onConnectWallet: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onConnectWallet }) => {
  return (
    <div className="container mx-auto px-6 py-20 text-center relative z-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight text-neo-black">
          Welcome to{' '}
          <span className="bg-neo-red text-neo-white px-4 py-2 transform rotate-[-2deg] inline-block border-4 border-neo-black shadow-neo-xl">
            Operata
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-neo-charcoal mb-12 leading-relaxed max-w-3xl mx-auto font-bold">
          Connect your wallet to start managing and verifying files across your trusted networks 
          with enhanced security and reliability.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            onClick={onConnectWallet}
            size="xl"
            variant="brutal"
            className="bg-neo-blue border-neo-black text-neo-white hover:bg-neo-purple"
          >
            <Wallet className="w-6 h-6 mr-3" />
            Select Wallet
            <ArrowRight className="w-6 h-6 ml-3" />
          </Button>
        </div>

        {/* Neo-brutalism floating elements */}
        <div className="mt-16 relative">
          <div className="absolute top-0 left-1/4 w-4 h-4 bg-neo-red transform rotate-45 border-2 border-neo-black"></div>
          <div className="absolute top-8 right-1/4 w-3 h-3 bg-neo-yellow transform rotate-45 border-2 border-neo-black"></div>
          <div className="absolute bottom-0 left-1/3 w-5 h-5 bg-neo-green transform rotate-45 border-2 border-neo-black"></div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
