"use client";
import { useState, useEffect, SetStateAction } from "react";
import { useRouter } from "next/navigation";

export default function BlogsNavbar() {
  const router = useRouter();
  const [isSticky, setIsSticky] = useState(false);
  const [active, setActive] = useState("Dogs"); // Default active tab

  const tabs = ["Dogs", "Cats", "Small Pets"];

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

  const handleClick = (tab: SetStateAction<string>) => {
    setActive(tab);

    // Custom navigation paths
    let path = "/blog";
    if (tab === "Dogs") path += "/dog-care";
    else if (tab === "Cats") path += "/cat-care";
    else if (tab === "Small Pets") path += "/small-pets";

    router.push(path);
  };

  return (
    <nav
      id="blogs-navbar"
      className={`w-full bg-white border-b border-gray-200 z-50 transition-all duration-300 pt-3 ${
        isSticky ? "fixed top-0 left-0 shadow-sm" : "relative"
      }`}
    >
      <ul className="flex justify-start max-w-6xl mx-auto">
        {tabs.map((tab) => (
          <li
            key={tab}
            onClick={() => handleClick(tab)}
            className={`cursor-pointer text-base px-4 border-r border-r-gray-200 font-bold relative pb-2 transition-all duration-200 
              ${
                active === tab
                  ? "text-[#007b80] border-b-2 border-[#007b80]"
                  : "text-gray-700 hover:text-[#007b80] hover:border-b-2 hover:border-[#007b80]"
              }`}
          >
            {tab}
          </li>
        ))}
      </ul>
    </nav>
  );
}
