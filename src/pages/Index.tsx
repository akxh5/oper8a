import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Shield, Wallet, Globe, Zap, Lock, Network, Users, FileText, Database } from 'lucide-react';
import WalletSelector from '../components/WalletSelector';

const Index = () => {
  const [isWalletSelectorOpen, setIsWalletSelectorOpen] = useState(false);

  return (
    <div className="brutal-layout">
      {/* Geometric Background Pattern */}
      <div className="absolute inset-0 brutal-bg-pattern"></div>
      
      {/* Floating Geometric Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-16 h-16 brutal-square brutal-bounce"></div>
        <div className="absolute top-40 right-32 w-24 h-12 brutal-rectangle brutal-slide"></div>
        <div className="absolute bottom-32 left-1/4 brutal-triangle"></div>
        <div className="absolute top-1/3 right-1/4 w-20 h-20 brutal-square" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 right-20 w-12 h-24 brutal-rectangle" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10">
        {/* Navigation Header */}
        <nav className="brutal-header">
          <div className="container mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="brutal-icon-box w-12 h-12 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-charcoal" />
                </div>
                <div>
                  <h1 className="brutal-heading text-2xl">OPER8A</h1>
                  <p className="brutal-mono text-xs">BLOCKCHAIN VERIFIED</p>
                </div>
              </div>
              <Button 
                onClick={() => setIsWalletSelectorOpen(true)}
                className="brutal-button text-lg px-8 py-4"
              >
                <Wallet className="w-5 h-5 mr-3" />
                CONNECT WALLET
              </Button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="container mx-auto px-6 py-20">
          <div className="brutal-content-wrapper max-w-6xl mx-auto text-center">
            {/* Main Title Block */}
            <div className="brutal-text-block mb-12">
              <h1 className="brutal-heading text-6xl md:text-8xl mb-8 leading-tight">
                <span className="block">SECURE YOUR</span>
                <span className="block text-mint-green">FILES WITH</span>
                <span className="block text-sky-blue">BLOCKCHAIN</span>
              </h1>
              
              <div className="brutal-divider w-full mb-8"></div>
              
              <p className="brutal-body text-xl md:text-2xl leading-relaxed max-w-4xl mx-auto">
                Connect your wallet to start managing and verifying files across your trusted networks 
                with <span className="brutal-mono font-bold text-mint-green">enhanced security</span> and 
                <span className="brutal-mono font-bold text-sky-blue">reliability</span>.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Button 
                onClick={() => setIsWalletSelectorOpen(true)}
                className="brutal-button text-xl px-12 py-6"
              >
                <Wallet className="w-6 h-6 mr-4" />
                SELECT WALLET
              </Button>
              <Button className="brutal-button-blue text-xl px-12 py-6">
                <Shield className="w-6 h-6 mr-4" />
                LEARN MORE
              </Button>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="brutal-stat-card p-8">
                <div className="brutal-icon-box w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Shield className="w-8 h-8 text-charcoal" />
                </div>
                <div className="brutal-heading text-4xl mb-2">100%</div>
                <div className="brutal-mono text-mint-green">SECURE</div>
              </div>
              <div className="brutal-card-coral p-8 text-center">
                <div className="brutal-icon-box w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Zap className="w-8 h-8 text-charcoal" />
                </div>
                <div className="brutal-heading text-4xl mb-2">INSTANT</div>
                <div className="brutal-mono text-soft-coral">VERIFICATION</div>
              </div>
              <div className="brutal-card-blue p-8 text-center">
                <div className="brutal-icon-box w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Database className="w-8 h-8 text-charcoal" />
                </div>
                <div className="brutal-heading text-4xl mb-2">ZERO</div>
                <div className="brutal-mono text-sky-blue">DOWNTIME</div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="container mx-auto px-6 py-20">
          <div className="brutal-section p-12">
            <div className="text-center mb-16">
              <div className="brutal-text-block mb-8">
                <h2 className="brutal-heading text-5xl md:text-6xl mb-6">
                  <span className="text-charcoal">WHY CHOOSE</span>
                  <br />
                  <span className="text-mint-green">OPER8A?</span>
                </h2>
                <div className="brutal-divider w-32 mx-auto mb-8"></div>
                <p className="brutal-body text-xl max-w-3xl mx-auto">
                  Experience next-generation file management with 
                  <span className="brutal-mono font-bold text-sky-blue"> blockchain-powered security</span>
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {[
                {
                  icon: Shield,
                  title: "ADVANCED SECURITY",
                  description: "Military-grade encryption with blockchain verification for ultimate data protection",
                  cardClass: "brutal-feature-card",
                  iconClass: "brutal-icon-box"
                },
                {
                  icon: Network,
                  title: "TRUSTED NETWORKS",
                  description: "Build and manage your network of trusted peers for secure file verification",
                  cardClass: "brutal-card-lavender",
                  iconClass: "brutal-icon-box"
                },
                {
                  icon: FileText,
                  title: "REAL-TIME ALERTS",
                  description: "Instant notifications when file duplications are detected across your network",
                  cardClass: "brutal-card-peach",
                  iconClass: "brutal-icon-box"
                },
                {
                  icon: Lock,
                  title: "DATA INTEGRITY",
                  description: "Cryptographic hashing ensures your files remain unchanged and authentic",
                  cardClass: "brutal-card-blue",
                  iconClass: "brutal-icon-box"
                },
                {
                  icon: Zap,
                  title: "LIGHTNING FAST",
                  description: "Powered by Solana's high-speed blockchain for instant verification",
                  cardClass: "brutal-card-coral",
                  iconClass: "brutal-icon-box"
                },
                {
                  icon: Globe,
                  title: "DECENTRALIZED",
                  description: "No single point of failure with distributed verification across the network",
                  cardClass: "brutal-card-lavender",
                  iconClass: "brutal-icon-box"
                }
              ].map((feature, index) => (
                <div key={index} className={`${feature.cardClass} group cursor-pointer`}>
                  <div className="p-8 text-center">
                    {/* Icon Section */}
                    <div className="relative inline-block mb-6">
                      <div className={`${feature.iconClass} w-20 h-20 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300`}>
                        <feature.icon className="w-10 h-10 text-charcoal" />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="brutal-heading text-2xl mb-4 group-hover:scale-105 transition-transform duration-300">
                      {feature.title}
                    </h3>

                    {/* Divider */}
                    <div className="brutal-divider w-16 h-1 mx-auto mb-4"></div>

                    {/* Description */}
                    <p className="brutal-body leading-relaxed">
                      {feature.description}
                    </p>

                    {/* Bottom accent */}
                    <div className="mt-6 flex justify-center">
                      <div className="brutal-square w-8 h-8"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom CTA Section */}
            <div className="text-center mt-20">
              <div className="brutal-card bg-gradient-to-r from-lavender to-mint-green p-8 max-w-2xl mx-auto">
                <h3 className="brutal-heading text-3xl mb-4">
                  READY TO SECURE YOUR FILES?
                </h3>
                <p className="brutal-mono mb-6">
                  JOIN THE BLOCKCHAIN REVOLUTION TODAY
                </p>
                <div className="brutal-divider w-24 mx-auto"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Powered by Solana Footer */}
        <div className="brutal-footer">
          <div className="container mx-auto px-6 py-16 text-center">
            <div className="brutal-card inline-flex items-center space-x-4 p-6">
              <div className="brutal-icon-box w-12 h-12 flex items-center justify-center">
                <Globe className="w-6 h-6 text-charcoal" />
              </div>
              <div className="text-left">
                <div className="brutal-heading text-2xl">POWERED BY</div>
                <div className="brutal-mono text-xl text-sky-blue">SOLANA BLOCKCHAIN</div>
              </div>
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