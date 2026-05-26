import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  useLocation,
} from "@tanstack/react-router";
import type { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useEffect } from "react";

import appCss from "../styles.css?url";
import { AppProvider } from "@/context/AppContext";
import { Toaster } from "@/components/ui/sonner";

gsap.registerPlugin(ScrollTrigger);

const EXPO_OUT = [0.16, 1, 0.3, 1] as any;

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050320] px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-bold text-white">404</h1>
        <h2 className="mt-4 text-xl text-[#A0A0B8]">Page not found</h2>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-[#00f6ff] px-5 py-2 text-sm font-semibold text-black transition-colors hover:bg-white"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050320] px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-2xl text-white">This page didn't load</h1>
        <p className="mt-2 text-sm text-[#A0A0B8]">
          Something went wrong. Try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="rounded-full bg-[#00f6ff] px-5 py-2 text-sm font-semibold text-black hover:bg-white"
          >
            Try again
          </button>
          <a
            href="/"
            className="rounded-full border border-[#1a1a3a] px-5 py-2 text-sm text-[#f8f9fa] hover:border-[#00f6ff] hover:text-[#00f6ff]"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "oper8a — Blockchain File Verification on Solana" },
      { name: "description", content: "oper8a anchors every file to the Solana blockchain. Tamper-proof, verifiable, permanent file integrity for teams who can't afford to be wrong." },
      { name: "keywords", content: "blockchain file verification, Solana, IPFS, file integrity, tamper-proof, Web3, decentralized storage" },
      { name: "author", content: "oper8a" },
      { name: "robots", content: "index, follow" },
      
      // Open Graph
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://oper8a.up.railway.app/" },
      { property: "og:title", content: "oper8a — Blockchain File Verification on Solana" },
      { property: "og:description", content: "Every file anchored on-chain. Tamper-proof. Permanent. Verifiable by anyone." },
      { property: "og:image", content: "https://oper8a.up.railway.app/assets/og-image.png" },
      
      // Twitter Card
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:url", content: "https://oper8a.up.railway.app/" },
      { name: "twitter:title", content: "oper8a — File Integrity, On-Chain" },
      { name: "twitter:description", content: "Every file anchored on Solana. Tamper-proof, verifiable, permanent." },
      { name: "twitter:image", content: "https://oper8a.up.railway.app/assets/og-image.png" },
      { name: "google-site-verification", content: "6i41ipLykvwWWzCN158atJ1Ble01LnCnZXhi9l94Lrw" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Inter:wght@400;500;600&display=swap" },
      { rel: "canonical", href: "https://oper8a.up.railway.app/" },
    ],
    script: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "oper8a",
          "description": "Blockchain-powered file verification on Solana. Upload, anchor on-chain, verify forever.",
          "url": "https://oper8a.up.railway.app",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          }
        })
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const location = useLocation();

  useEffect(() => {
    const isMobile = window.innerWidth < 768 || 
      /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isMobile) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
      touchInertiaMultiplier: 35,
      smoothTouch: false, // CRITICAL: disable smooth on touch devices
      syncTouch: true,
      infinite: false,
      gestureOrientation: "vertical",
    });

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000);
      });
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ 
              duration: 0.3, 
              ease: EXPO_OUT,
              delay: 0.05 
            }}
            className="flex-1 prevent-overflow"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
        <Toaster />
      </AppProvider>
    </QueryClientProvider>
  );
}
