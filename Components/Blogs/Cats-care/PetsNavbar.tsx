"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function PetsNavbar() {
  const [isSticky, setIsSticky] = useState(false);
  const [active, setActive] = useState(""); // default active tab

  const tabs = [
    { name: "Dog Care", href: "/blog/dog-care" },
    { name: "Cat Care", href: "/blog/cat-care" },
    { name: "Small Pet Care", href: "/blog/small-pets" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const nav = document.getElementById("blogs-navbar");
      if (nav) {
        const offsetTop = nav.offsetTop;
        setIsSticky(window.scrollY > offsetTop);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      id="blogs-navbar"
      className={`w-full bg-[#018F98] border-b border-gray-200 z-50 transition-all duration-300 ${
        isSticky ? "fixed top-0 left-0 shadow-sm" : "relative"
      }`}
    >
      <ul className="flex justify-start max-w-6xl mx-auto">
        {tabs.map((tab) => (
          <li key={tab.name}>
            <Link
              href={tab.href}
              onClick={() => setActive(tab.name)}
              className={`block px-10 py-8 text-lg font-semibold transition-all duration-200 rounded-md ${
                active === tab.name
                  ? "bg-[#07828A] text-white"
                  : "text-white hover:bg-[#07828A]"
              }`}
            >
              {tab.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
