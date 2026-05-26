import { useEffect, useRef, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useApp } from "@/context/AppContext";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import NetworkManager from "@/components/dashboard/NetworkManager";
import FileUpload from "@/components/dashboard/FileUpload";
import NetworkMembers from "@/components/dashboard/NetworkMembers";
import StorageAnalytics from "@/components/dashboard/StorageAnalytics";
import PersonalFiles from "@/components/dashboard/PersonalFiles";
import NetworkFiles from "@/components/dashboard/NetworkFiles";
import NetworkAlerts from "@/components/dashboard/NetworkAlerts";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — oper8a" },
      { name: "description", content: "Verify, anchor, and manage files on Solana." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { walletAddress } = useApp();
  const navigate = useNavigate();
  const container = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [storedAddress, setStoredAddress] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    setStoredAddress(localStorage.getItem("walletAddress"));
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    const ok = localStorage.getItem("walletConnected") === "true";
    if (!ok) navigate({ to: "/" });
    
    return () => window.removeEventListener("resize", checkMobile);
  }, [navigate]);

  const activeAddress = walletAddress || storedAddress;

  useGSAP(() => {
    if (!activeAddress || isMobile) return;

    const tl = gsap.timeline();
    
    // Header slides in
    tl.from(".dashboard-header", {
      y: -16,
      opacity: 0,
      duration: 0.4,
      ease: "power3.out"
    });

    // Mobile specific entrance
    if (isMobile) {
       tl.from(".dash-card", {
        y: 20,
        opacity: 0,
        duration: 0.45,
        stagger: 0.05,
        ease: "power3.out"
      }, "-=0.2");
    } else {
      // Desktop entrance
      tl.from(".left-col-card", {
        x: -20,
        opacity: 0,
        duration: 0.45,
        stagger: 0.08,
        ease: "power3.out"
      }, "-=0.2");

      tl.from(".right-col-card", {
        x: 20,
        opacity: 0,
        duration: 0.45,
        stagger: 0.08,
        ease: "power3.out"
      }, "-=0.35");
    }
  }, { scope: container, dependencies: [activeAddress, isMobile] });

  if (!activeAddress) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#050320] text-[#A0A0B8]">
        Redirecting…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050320] overflow-x-hidden w-full relative">
      {!isMobile && (
        <>
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="fixed top-0 left-0 w-full h-full object-cover z-0 opacity-30 pointer-events-none touch-none"
          >
            <source src="/assets/motion_compressed.mp4" type="video/mp4" />
          </video>
          <div className="fixed inset-0 z-1 pointer-events-none" 
               style={{ background: 'linear-gradient(135deg, rgba(5, 3, 32, 0.75) 0%, rgba(10, 9, 32, 0.6) 100%)' }} />
        </>
      )}
      
      <main 
        ref={container} 
        className="relative z-10 px-3 sm:px-6 py-4 md:py-8 w-full max-w-full overflow-x-hidden flex flex-col"
      >
        <div className="dashboard-header w-full">
          <DashboardHeader />
        </div>
        
        {/* Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 w-full">
          {/* Left Side */}
          <div className="flex flex-col gap-4 lg:col-span-5 w-full">
            <div className="left-col-card dash-card w-full"><NetworkManager /></div>
            <div className="left-col-card dash-card w-full"><FileUpload /></div>
            <div className="left-col-card dash-card w-full"><NetworkMembers /></div>
          </div>
          
          {/* Right Side */}
          <div className="flex flex-col gap-4 lg:col-span-7 w-full">
            <div className="right-col-card dash-card w-full"><StorageAnalytics /></div>
            <div className="right-col-card dash-card w-full"><PersonalFiles /></div>
            <div className="right-col-card dash-card w-full"><NetworkFiles /></div>
            <div className="right-col-card dash-card w-full"><NetworkAlerts /></div>
          </div>
        </div>
      </main>
    </div>
  );
}
