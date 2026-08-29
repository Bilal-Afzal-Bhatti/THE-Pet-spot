"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function BreedInfoPageHeroSection() {
  const { breed } = useParams(); // ✅ get [breed] from URL
  const breedName =
    typeof breed === "string"
      ? breed.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
      : "";

  return (
    <section
      className="relative h-[30vh] w-ful flex items-start justify-center text-white"
      style={{background: "var(--gradient-hero)"}}
      // style={{ backgroundImage: "url('/HeroSectionBG/rottweiler.webp')" }}
    >
      {/* Content */}
      <div className=" z-20 w-full flex flex-col top-55 px-6 max-w-6xl items-start justify-center mt-32">
        <p className="text-xs font-semibold flex items-start gap-2">
          <Link
            href="/"
            className="hover:text-[#018F98] transition-colors duration-200"
          >
            Home
          </Link>
          /
          <Link
            href="/dog-breed"
            className="hover:text-[#018F98] transition-colors duration-200"
          >
            Dog Breeds
          </Link>
          /<span className=" capitalize">{breedName}</span>
        </p>

        <h1 className="text-4xl md:text-4xl font-semibold drop-shadow-lg">
          {breedName || "Dog Breed"} Dog Breed
        </h1>
      </div>
    </section>
  );
}
