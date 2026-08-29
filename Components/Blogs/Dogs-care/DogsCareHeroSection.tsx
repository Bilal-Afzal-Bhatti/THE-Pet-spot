"use client";

import Link from "next/link";

export default function DogssCareHeroSection() {
  return (
    <section
      className="relative h-[40vh] w-full bg-cover bg-center flex items-start justify-center text-white"
      style={{ backgroundImage: "url('/Blog/blog.webp')" }}
    >
      {/* Content */}
      <div className="relative z-20  w-full  flex flex-col  top-55  px-6 max-w-6xl mx-auto">
        <p className="text-xs font-semibold flex items-start  gap-2">
          {/* Clickable Home */}
          <Link
            href="/"
            className="hover:text-[#018F98] transition-colors duration-200"
          >
            Home
          </Link>
          /<span>Blog / dog care</span>
        </p>
        <h1 className="text-4xl md:text-4xl font-semibold drop-shadow-lg">
          Dog Care
        </h1>
      </div>
    </section>
  );
}
