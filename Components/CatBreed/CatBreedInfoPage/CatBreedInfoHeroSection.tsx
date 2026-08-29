"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function CatBreedInfoHeroSection() {
  const { breed } = useParams(); // ✅ get [breed] from URL
  const breedName =
    typeof breed === "string"
      ? breed.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
      : "";

  return (
    <section
      className="relative h-[40vh] w-full bg-cover bg-center flex items-start justify-center text-white"
      style={{ backgroundImage: "url('/HeroSectionBG/rottweiler.webp')" }}
    >
      {/* Content */}
      <div className="relative z-20 w-full flex flex-col top-55 px-6 max-w-6xl mx-auto">
        <p className="text-xs font-semibold flex items-start gap-2">
          <Link
            href="/"
            className="hover:text-[#018F98] transition-colors duration-200"
          >
            Home
          </Link>
          /
          <Link
            href="/cat-breed"
            className="hover:text-[#018F98] transition-colors duration-200"
          >
            Cat Breeds
          </Link>
          /<span className=" capitalize">{breedName}</span>
        </p>

        <h1 className="text-4xl md:text-4xl font-semibold drop-shadow-lg">
          {breedName || "Cat Breed"} Cat Breed
        </h1>
      </div>
    </section>
  );
}
