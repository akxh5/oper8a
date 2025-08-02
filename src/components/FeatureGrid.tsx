
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Network, CheckCircle, Lock, Globe, Zap } from 'lucide-react';

const FeatureGrid = () => {
  const features = [
    {
      icon: Shield,
      title: "Advanced Security",
      description: "Military-grade encryption with blockchain verification for ultimate data protection",
      bgColor: "bg-neo-red",
      borderColor: "border-neo-black",
      textColor: "text-neo-white",
      rotation: "rotate-[-2deg]"
    },
    {
      icon: Network,
      title: "Trusted Networks",
      description: "Build and manage your network of trusted peers for secure file verification",
      bgColor: "bg-neo-blue",
      borderColor: "border-neo-black",
      textColor: "text-neo-white",
      rotation: "rotate-[1deg]"
    },
    {
      icon: CheckCircle,
      title: "Real-time Alerts",
      description: "Instant notifications when file duplications are detected across your network",
      bgColor: "bg-neo-green",
      borderColor: "border-neo-black",
      textColor: "text-neo-black",
      rotation: "rotate-[-1deg]"
    },
    {
      icon: Lock,
      title: "Data Integrity",
      description: "Cryptographic hashing ensures your files remain unchanged and authentic",
      bgColor: "bg-neo-orange",
      borderColor: "border-neo-black",
      textColor: "text-neo-black",
      rotation: "rotate-[2deg]"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Powered by Solana's high-speed blockchain for instant verification",
      bgColor: "bg-neo-yellow",
      borderColor: "border-neo-black",
      textColor: "text-neo-black",
      rotation: "rotate-[-3deg]"
    },
    {
      icon: Globe,
      title: "Decentralized",
      description: "No single point of failure with distributed verification across the network",
      bgColor: "bg-neo-purple",
      borderColor: "border-neo-black",
      textColor: "text-neo-white",
      rotation: "rotate-[1deg]"
    }
  ];

  return (
    <div className="container mx-auto px-6 py-20 relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-black mb-4 text-neo-black">
          Why Choose{' '}
          <span className="bg-neo-magenta text-neo-white px-3 py-1 transform rotate-[-1deg] inline-block border-3 border-neo-black shadow-neo">
            Operata?
          </span>
        </h2>
        <p className="text-xl text-neo-charcoal max-w-2xl mx-auto font-bold">
          Experience next-generation file management with blockchain-powered security
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {features.map((feature, index) => (
          <Card 
            key={index} 
            className={`${feature.bgColor} ${feature.borderColor} ${feature.textColor} border-4 shadow-neo-lg hover:shadow-neo-xl transform ${feature.rotation} hover:rotate-0 transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] group`}
          >
            <CardHeader className="text-center pb-4 bg-neo-yellow border-b-4 border-neo-black">
              <div className="relative inline-block mb-4">
                <div className="w-16 h-16 bg-neo-black border-3 border-neo-black flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 transform rotate-[5deg] group-hover:rotate-0">
                  <feature.icon className="w-8 h-8 text-neo-white" />
                </div>
              </div>
              <CardTitle className={`text-xl font-black text-neo-black group-hover:text-neo-charcoal transition-colors duration-300 transform rotate-[-1deg] group-hover:rotate-0`}>
                {feature.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <CardDescription className={`text-center leading-relaxed font-bold ${feature.textColor}`}>
                {feature.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FeatureGrid;
