"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authStore } from "@/Store/authStore";
import AvailablePets from "@/Components/LandingPage/AvailablePets";
import HeroSection from "@/Components/LandingPage/HeroSection";
import MMP from "@/Components/LandingPage/MMP";
import ServicesSection from "@/Components/LandingPage/Service";
import Navbar from "@/Components/Navbar";
import joinUs from "@/Components/LandingPage/joinUs";
import PetWebsite from "@/Components/LandingPage/joinUs";
import Footer from "@/Components/LandingPage/Footer";
import Clients from "@/Components/LandingPage/Clients";

interface AuthStore {
  authUser: any;
  isCheckingAuth: boolean;
  checkAuth: () => Promise<void>;
}

export default function Home() {
  const router = useRouter();
  const store = authStore() as AuthStore;
  const { authUser, isCheckingAuth, checkAuth } = store;

  useEffect(() => {
    const verifyAuth = async () => {
      await checkAuth();
    };
    verifyAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-linear-to-br from-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#FFAC0D] border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="font-sans">
      {/* <Navbar /> */}
      <HeroSection />
      <AvailablePets />
      <MMP />
      <ServicesSection />
      <PetWebsite />
      <Clients />
      {/* <Footer /> */}
    </main>
  );
}
  