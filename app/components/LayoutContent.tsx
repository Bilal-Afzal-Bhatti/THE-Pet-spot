"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/LandingPage/Footer";

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isDashboard = pathname === "/dashboard";
  const hideNavbar = ["/login", "/sign-up", "/forgot-password", "/reset-password"].includes(
    pathname
  );

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
      {!isDashboard && <Footer />}
    </>
  );
}