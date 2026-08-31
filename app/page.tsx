"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { authStore } from "@/Store/authStore";
import HeroSection from "@/Components/LandingPage/HeroSection";

// Keep SSR for components near the top
const AvailablePets = dynamic(
  () => import("@/Components/LandingPage/AvailablePets"),
  { ssr: true }
);

// Disable SSR for deep below-the-fold components to stop state reset on scroll
const MMP = dynamic(() => import("@/Components/LandingPage/MMP"), { ssr: false });
const ServicesSection = dynamic(() => import("@/Components/LandingPage/Service"), { ssr: false });
const PetWebsite = dynamic(() => import("@/Components/LandingPage/joinUs"), { ssr: false });
const Clients = dynamic(() => import("@/Components/LandingPage/Clients"), { ssr: false });

interface AuthStore {
  authUser: any;
  isCheckingAuth: boolean;
  checkAuth: () => Promise<void>;
}

export default function Home() {
  const store = authStore() as AuthStore;
  const { checkAuth } = store;

  useEffect(() => {
    const timer = setTimeout(() => {
      checkAuth();
    }, 0);

    return () => clearTimeout(timer);
  }, [checkAuth]);

  return (
    <main className="font-sans">
      <HeroSection />
      <AvailablePets />
      <MMP />
      <ServicesSection />
      <PetWebsite />
      <Clients />
    </main>
  );
}