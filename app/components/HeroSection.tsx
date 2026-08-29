"use client";

import Link from "next/link";

interface HeroSectionProps {
  title: string;
  currentPage: string;
  bgImage: string;
}

export default function HeroSection({
  title,
  currentPage,
  bgImage,
}: HeroSectionProps) {
  return (
    <section
      className="relative h-[40vh] w-full bg-cover bg-center flex items-start justify-center text-white"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Overlay for better text visibility */}
      {/* <div className="absolute inset-0 bg-black/40"></div> */}

      {/* Content */}
      <div className="relative z-20 mt-32 w-full max-w-[1100px] text-center px-6">
        <h1 className="text-4xl md:text-3xl font-semibold drop-shadow-lg">
          {currentPage.toUpperCase()}
        </h1>

        <p className="text-xs md:text-sm font-semibold flex items-center justify-center gap-2 mt-2">
          <Link
            href="/"
            className="hover:text-[#018F98] transition-colors duration-200"
          >
            Home
          </Link>
          /<span className="">{currentPage}</span>
        </p>
      </div>
    </section>
  );
}
