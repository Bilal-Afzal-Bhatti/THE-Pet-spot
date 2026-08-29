"use client";

import Link from "next/link";

export default function HeroSection() {
  return (
    <section
      className="relative h-[40vh] w-full bg-cover bg-center flex items-start justify-center text-white"
      style={{ backgroundImage: "url('/Blog/blog.webp')" }}
    >
      {/* Content */}
      <div className="relative z-20 mt-32 w-full max-w-[1100px] text-center px-6">
        <h1 className="text-4xl md:text-4xl font-semibold drop-shadow-lg">
          BLOGS
        </h1>

        <p className="text-xs font-semibold flex items-center justify-center gap-2">
          {/* Clickable Home */}
          <Link
            href="/"
            className="hover:text-[#018F98] transition-colors duration-200"
          >
            Home
          </Link>
          /<span>Blogs</span>
        </p>
      </div>
    </section>
  );
}
