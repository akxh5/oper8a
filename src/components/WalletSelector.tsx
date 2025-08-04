import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Wallet, ArrowRight, Zap, Shield, X, CheckCircle } from 'lucide-react';

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
      status: "VERIFIED",
      color: "mint-green"
    },
    {
      name: "SOLFLARE",
      description: "Secure and feature-rich wallet",
      icon: "🔥",
      recommended: false,
      status: "SECURE",
      color: "soft-coral"
    },
    {
      name: "BACKPACK",
      description: "Modern wallet for Web3",
      icon: "🎒",
      recommended: false,
      status: "MODERN",
      color: "sky-blue"
    },
    {
      name: "GLOW",
      description: "Stake and earn rewards",
      icon: "✨",
      recommended: false,
      status: "REWARDS",
      color: "lavender"
    }
  ];

  const handleWalletConnect = async (walletName: string) => {
    console.log(`Connecting to ${walletName} wallet...`);
    
    try {
      if (walletName === 'PHANTOM') {
        const { walletConnection } = await import('../utils/walletConnection');
        const result = await walletConnection.connectPhantom();
        
        console.log('Wallet connected successfully:', result.publicKey);
        
        localStorage.setItem('walletConnected', 'true');
        localStorage.setItem('walletAddress', result.publicKey);
        
        onClose();
        window.location.href = '/dashboard';
      } else {
        alert(`${walletName} integration coming soon! Please use Phantom for now.`);
      }
    } catch (error) {
      console.error('Wallet connection failed:', error);
      alert(`Failed to connect to ${walletName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg brutal-modal p-0 overflow-hidden">
        {/* Header */}
        <div className="brutal-modal-header relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 brutal-button-secondary w-10 h-10 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="brutal-icon-box w-16 h-16 flex items-center justify-center">
              <Wallet className="w-8 h-8 text-charcoal" />
            </div>
            <div>
              <h2 className="brutal-heading text-3xl">SELECT WALLET</h2>
              <p className="brutal-mono text-sm">CONNECT YOUR SOLANA WALLET</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="brutal-modal-content space-y-4">
          {wallets.map((wallet, index) => (
            <div 
              key={index} 
              className={`brutal-card-${wallet.color} cursor-pointer group`}
              onClick={() => handleWalletConnect(wallet.name)}
            >
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="brutal-icon-box w-12 h-12 flex items-center justify-center text-2xl">
                      {wallet.icon}
                    </div>
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="brutal-heading text-lg group-hover:text-deep-navy transition-colors">
                          {wallet.name}
                        </h3>
                        {wallet.recommended && (
                          <div className="brutal-badge px-2 py-1 text-xs flex items-center">
                            <Shield className="w-3 h-3 mr-1" />
                            RECOMMENDED
                          </div>
                        )}
                        <div className="brutal-status-info px-2 py-1 text-xs font-bold">
                          {wallet.status}
                        </div>
                      </div>
                      <p className="brutal-body text-sm">{wallet.description}</p>
                    </div>
                  </div>
                  <div className="brutal-icon-box w-8 h-8 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ArrowRight className="w-4 h-4 text-charcoal" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="brutal-modal-footer">
          <div className="flex items-center space-x-3">
            <div className="brutal-icon-box w-8 h-8 flex items-center justify-center">
              <Zap className="w-4 h-4 text-charcoal" />
            </div>
            <div>
              <p className="brutal-subheading text-sm">POWERED BY SOLANA</p>
              <p className="brutal-mono text-xs">FAST, SECURE, LOW-COST TRANSACTIONS</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WalletSelector;