"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/LandingPage/Footer";

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isDashboard = pathname === "/dashboard";
  const hideNavbar = [
    "/login",
    "/sign-up",
    "/forgot-password",
    "/reset-password",
  ].includes(pathname);

  return (
    <div className="flex min-h-screen flex-col">
      {!hideNavbar && (
        <header>
          <Navbar />
        </header>
      )}

      <main className="flex-1">{children}</main>

      {!isDashboard && <Footer />}
    </div>
  );
}