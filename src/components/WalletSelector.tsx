import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet, ArrowRight, Zap, Shield, X } from 'lucide-react';

interface WalletSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

const WalletSelector: React.FC<WalletSelectorProps> = ({ isOpen, onClose }) => {
  const wallets = [
    {
      name: "PHANTOM",
      description: "The most popular Solana wallet",
      icon: "👻",
      recommended: true,
      status: "VERIFIED"
    },
    {
      name: "SOLFLARE",
      description: "Secure and feature-rich wallet",
      icon: "🔥",
      recommended: false,
      status: "SECURE"
    },
    {
      name: "BACKPACK",
      description: "Modern wallet for Web3",
      icon: "🎒",
      recommended: false,
      status: "MODERN"
    },
    {
      name: "GLOW",
      description: "Stake and earn rewards",
      icon: "✨",
      recommended: false,
      status: "REWARDS"
    }
  ];

  const handleWalletConnect = async (walletName: string) => {
    console.log(`Connecting to ${walletName} wallet...`);
    
    try {
      if (walletName === 'PHANTOM') {
        const { walletConnection } = await import('../utils/walletConnection');
        const result = await walletConnection.connectPhantom();
        
        console.log('Wallet connected successfully:', result.publicKey);
        
        // Store wallet info in localStorage for the demo
        localStorage.setItem('walletConnected', 'true');
        localStorage.setItem('walletAddress', result.publicKey);
        
        onClose();
        // Redirect to dashboard
        window.location.href = '/dashboard';
      } else {
        // For other wallets, show not implemented message
        alert(`${walletName} integration coming soon! Please use Phantom for now.`);
      }
    } catch (error) {
      console.error('Wallet connection failed:', error);
      alert(`Failed to connect to ${walletName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-black border-4 border-emerald-400 shadow-[8px_8px_0px_0px_#00ff88] text-white p-0 overflow-hidden">
        {/* Header */}
        <div className="bg-emerald-400 text-black p-6 border-b-4 border-black relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-black border-2 border-emerald-400 shadow-[2px_2px_0px_0px_#000000] flex items-center justify-center hover:shadow-[4px_4px_0px_0px_#000000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
          >
            <X className="w-4 h-4 text-emerald-400" />
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-black border-4 border-emerald-400 shadow-[4px_4px_0px_0px_#000000] flex items-center justify-center">
              <Wallet className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-3xl font-black uppercase tracking-wider">SELECT WALLET</h2>
              <p className="font-mono text-sm uppercase tracking-wide">CONNECT YOUR SOLANA WALLET</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {wallets.map((wallet, index) => (
            <div 
              key={index} 
              className="brutal-card bg-gray-900 border-2 border-gray-600 shadow-[4px_4px_0px_0px_#333333] hover:shadow-[6px_6px_0px_0px_#333333] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all cursor-pointer group"
              onClick={() => handleWalletConnect(wallet.name)}
            >
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl bg-white w-12 h-12 flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_0px_#000000]">
                      {wallet.icon}
                    </div>
                    <div>
                      <div className="flex items-center space-x-3">
                        <h3 className="font-black text-white group-hover:text-emerald-400 transition-colors text-lg uppercase tracking-wider">
                          {wallet.name}
                        </h3>
                        {wallet.recommended && (
                          <div className="bg-emerald-400 text-black text-xs px-2 py-1 font-bold uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_#000000]">
                            <Shield className="w-3 h-3 inline mr-1" />
                            RECOMMENDED
                          </div>
                        )}
                        <div className="bg-purple-600 text-white text-xs px-2 py-1 font-bold uppercase tracking-wider border-2 border-white shadow-[2px_2px_0px_0px_#ffffff]">
                          {wallet.status}
                        </div>
                      </div>
                      <p className="text-sm text-gray-400 font-mono uppercase tracking-wide">{wallet.description}</p>
                    </div>
                  </div>
                  <div className="w-8 h-8 bg-emerald-400 border-2 border-black shadow-[2px_2px_0px_0px_#000000] flex items-center justify-center group-hover:shadow-[4px_4px_0px_0px_#000000] group-hover:translate-x-[-2px] group-hover:translate-y-[-2px] transition-all">
                    <ArrowRight className="w-4 h-4 text-black" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="bg-purple-600 border-t-4 border-white p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000000] flex items-center justify-center">
              <Zap className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-black text-white uppercase tracking-wider">POWERED BY SOLANA</p>
              <p className="text-xs text-purple-200 font-mono uppercase tracking-wide">FAST, SECURE, LOW-COST TRANSACTIONS</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WalletSelector;