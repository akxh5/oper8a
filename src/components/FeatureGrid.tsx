import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Network, CheckCircle, Lock, Globe, Zap } from 'lucide-react';

const FeatureGrid = () => {
  const features = [
    {
      icon: Shield,
      title: "ADVANCED SECURITY",
      description: "Military-grade encryption with blockchain verification for ultimate data protection",
      color: "emerald",
      bgPattern: "diagonal-lines"
    },
    {
      icon: Network,
      title: "TRUSTED NETWORKS",
      description: "Build and manage your network of trusted peers for secure file verification",
      color: "purple",
      bgPattern: "dots"
    },
    {
      icon: CheckCircle,
      title: "REAL-TIME ALERTS",
      description: "Instant notifications when file duplications are detected across your network",
      color: "emerald",
      bgPattern: "grid"
    },
    {
      icon: Lock,
      title: "DATA INTEGRITY",
      description: "Cryptographic hashing ensures your files remain unchanged and authentic",
      color: "purple",
      bgPattern: "waves"
    },
    {
      icon: Zap,
      title: "LIGHTNING FAST",
      description: "Powered by Solana's high-speed blockchain for instant verification",
      color: "emerald",
      bgPattern: "triangles"
    },
    {
      icon: Globe,
      title: "DECENTRALIZED",
      description: "No single point of failure with distributed verification across the network",
      color: "purple",
      bgPattern: "hexagons"
    }
  ];

  const getColorClasses = (color: string) => {
    if (color === 'emerald') {
      return {
        bg: 'bg-emerald-400',
        text: 'text-black',
        border: 'border-black',
        shadow: 'shadow-[8px_8px_0px_0px_#000000]',
        accent: 'text-emerald-400'
      };
    } else {
      return {
        bg: 'bg-purple-600',
        text: 'text-white',
        border: 'border-white',
        shadow: 'shadow-[8px_8px_0px_0px_#ffffff]',
        accent: 'text-purple-400'
      };
    }
  };

  return (
    <div className="container mx-auto px-6 py-20 border-t-4 border-emerald-400 bg-black/60">
      <div className="text-center mb-16">
        <h2 className="text-5xl md:text-6xl font-black mb-6 uppercase tracking-wider">
          <span className="text-white">WHY CHOOSE</span>
          <br />
          <span className="neon-text">OPER8A?</span>
        </h2>
        <div className="w-32 h-2 bg-emerald-400 shadow-[0_4px_0px_0px_#000000] mx-auto mb-8"></div>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto font-mono uppercase tracking-wider">
          EXPERIENCE NEXT-GENERATION FILE MANAGEMENT WITH <span className="neon-text">BLOCKCHAIN-POWERED SECURITY</span>
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {features.map((feature, index) => {
          const colors = getColorClasses(feature.color);
          
          return (
            <div 
              key={index} 
              className={`brutal-card group cursor-pointer transition-all duration-300 hover:scale-105 ${colors.bg} ${colors.border} ${colors.shadow} hover:shadow-[12px_12px_0px_0px_${feature.color === 'emerald' ? '#000000' : '#ffffff'}]`}
            >
              <div className="p-8 text-center">
                {/* Icon Section */}
                <div className="relative inline-block mb-6">
                  <div className={`w-20 h-20 ${feature.color === 'emerald' ? 'bg-black border-4 border-emerald-400' : 'bg-white border-4 border-purple-600'} shadow-[4px_4px_0px_0px_${feature.color === 'emerald' ? '#00ff88' : '#7209b7'}] flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className={`w-10 h-10 ${feature.color === 'emerald' ? 'text-emerald-400' : 'text-purple-600'}`} />
                  </div>
                </div>

                {/* Title */}
                <h3 className={`text-2xl font-black mb-4 uppercase tracking-wider ${colors.text} group-hover:scale-105 transition-transform duration-300`}>
                  {feature.title}
                </h3>

                {/* Divider */}
                <div className={`w-16 h-1 ${feature.color === 'emerald' ? 'bg-black' : 'bg-white'} mx-auto mb-4 shadow-[2px_2px_0px_0px_${feature.color === 'emerald' ? '#000000' : '#ffffff'}]`}></div>

                {/* Description */}
                <p className={`${colors.text} leading-relaxed font-mono text-sm uppercase tracking-wide`}>
                  {feature.description}
                </p>

                {/* Bottom accent */}
                <div className="mt-6 flex justify-center">
                  <div className={`w-8 h-8 ${feature.color === 'emerald' ? 'bg-black border-2 border-emerald-400' : 'bg-white border-2 border-purple-600'} transform rotate-45`}></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA Section */}
      <div className="text-center mt-20">
        <div className="brutal-card bg-gradient-to-r from-purple-600 to-emerald-400 border-4 border-white shadow-[8px_8px_0px_0px_#000000] p-8 max-w-2xl mx-auto">
          <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-wider">
            READY TO SECURE YOUR FILES?
          </h3>
          <p className="text-white font-mono mb-6 uppercase tracking-wide">
            JOIN THE BLOCKCHAIN REVOLUTION TODAY
          </p>
          <div className="w-24 h-1 bg-white shadow-[2px_2px_0px_0px_#000000] mx-auto"></div>
        </div>
      </div>
    </div>
  );
};

export default FeatureGrid;