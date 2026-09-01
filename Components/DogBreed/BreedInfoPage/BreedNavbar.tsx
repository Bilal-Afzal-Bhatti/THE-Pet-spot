"use client";
import { useEffect, useState } from "react";

export default function BreedNavbar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) setVisible(true);
      else setVisible(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        visible
          ? "bg-(--bg-dark) text-white shadow-md translate-y-0"
          : "-translate-y-full"
      }`}
    >
      <div className=" mx-auto flex items-center justify-between px-8 py-4 max-w-6xl ">
        <div className="font-semibold text-lg">🐾 Pets Corner</div>
        <button className="bg-white text-[#028d8f] px-5 py-2 rounded-full font-medium hover:bg-gray-100">
          View Puppies
        </button>
      </div>
    </nav>
  );
}
