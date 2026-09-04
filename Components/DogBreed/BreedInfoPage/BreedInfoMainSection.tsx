"use client";
import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight, FaWeight, FaRulerVertical, FaHeartbeat, FaHome } from "react-icons/fa";
import { useParams } from "next/navigation";
import { useBreedStore } from "@/Store/BreedStore";
import BreedInfoSidebar from "./BreedInfoSidebar";
import BreedInfoNotFound from "./BreedInfoNotFound";
import BreedDetails from "./BreedDetail";

export default function BreedInfoMainSection() {
  const params = useParams();
  
  // Robust fallback: intelligently parse pathname to ignore route prefixes like dog-breed/cat-breed
  const getSlugFromPath = () => {
    if (typeof window === "undefined") return "";
    const segments = window.location.pathname.split("/").filter(Boolean);
    // Find the segment after 'dog-breed', 'cat-breed', 'small-pet-breed', or just take the last segment
    const lastSegment = segments[segments.length - 1];
    if (["dog-breed", "cat-breed", "small-pet-breed"].includes(lastSegment)) {
      return "";
    }
    return lastSegment || "";
  };

  const slug = 
    (params?.slug as string) || 
    (params?.id as string) || 
    (params?.breed as string) || 
    getSlugFromPath();

  console.log("Resolved Slug/ID for fetch:", slug);

  const { selectedBreed, detailLoading, detailError, fetchBreedBySlug } = useBreedStore();
  const [index, setIndex] = useState(0);

  const defaultImages = [
    "https://images.unsplash.com/photo-1574158622682-e40e69881006",
    "https://images.unsplash.com/photo-1518791841217-8f162f1e1131",
  ];

  // Fetch individual breed directly via its slug/id on mount or URL change
  useEffect(() => {
    if (slug && slug !== "dog-breed" && slug !== "cat-breed") {
      fetchBreedBySlug(slug);
    }
  }, [slug, fetchBreedBySlug]);

  if (detailLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-gray-500 font-medium">Loading breed details...</p>
      </div>
    );
  }

  if (detailError || !selectedBreed) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[50vh] gap-3">
        <p className="text-red-500 font-medium">{detailError || "Breed not found."}</p>
      </div>
    );
  }

  const IMAGES = selectedBreed?.image 
    ? [selectedBreed.image, ...defaultImages] 
    : defaultImages;

  const nextSlide = () => setIndex((prev) => (prev + 1) % IMAGES.length);
  const prevSlide = () =>
    setIndex((prev) => (prev - 1 + IMAGES.length) % IMAGES.length);

  // Safely parse temperament array or string
  const rawTemperament: unknown = selectedBreed?.temperament;
  const temperamentList: string[] = Array.isArray(rawTemperament)
    ? rawTemperament.filter((t): t is string => typeof t === "string")
    : typeof rawTemperament === "string"
    ? rawTemperament.split(",").map((t: string) => t.trim()).filter(Boolean)
    : [];

  // Safely parse overviewPoints array if available
  const overviewPoints = Array.isArray(selectedBreed?.overviewPoints) 
    ? selectedBreed.overviewPoints 
    : [];

  return (
    <section className="max-w-6xl mx-auto py-10 flex flex-col lg:flex-row gap-10 px-6">
      {/* LEFT: Main Blog Area / Details */}
      <div className="w-full lg:w-2/3">
        {/* Featured slider */}
        <div className="relative mb-8">
          <div className="relative w-full h-[350px] overflow-hidden rounded-md shadow">
            <button
              onClick={prevSlide}
              aria-label="Previous"
              className="absolute left-2 top-1/2 z-10 bg-gray-200 hover:bg-gray-300 text-gray-700 p-3 rounded-md"
            >
              <FaArrowLeft />
            </button>

            <img
              src={IMAGES[index]}
              alt={selectedBreed.name}
              className="w-full h-full object-cover transition-all duration-500 ease-in-out"
            />

            <button
              onClick={nextSlide}
              aria-label="Next"
              className="absolute right-2 top-1/2 z-10 bg-gray-200 hover:bg-gray-300 text-gray-700 p-3 rounded-md"
            >
              <FaArrowRight />
            </button>
          </div>

          {/* Overlay text */}
          <div className="absolute bottom-4 left-4 text-white">
            <span className="bg-yellow-500 text-xs px-2 py-1 rounded uppercase">
              {selectedBreed.category || "Pet Care"}
            </span>
            <h2 className="text-2xl font-bold mt-2">
              {selectedBreed.name} Breed
            </h2>
            <p className="text-sm opacity-90">Breed Information & Guide</p>
          </div>
        </div>

        {/* === QUICK STATS CARDS === */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 bg-white p-5 rounded-xl border shadow-sm mb-8">
          <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg">
            <FaWeight className="text-teal-600 text-lg mb-1" />
            <span className="text-xs text-gray-500 font-semibold">Weight</span>
            <span className="text-sm font-bold text-gray-800">{selectedBreed.weight || "N/A"}</span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg">
            <FaRulerVertical className="text-teal-600 text-lg mb-1" />
            <span className="text-xs text-gray-500 font-semibold">Height</span>
            <span className="text-sm font-bold text-gray-800">{selectedBreed.height || "N/A"}</span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg">
            <FaHeartbeat className="text-teal-600 text-lg mb-1" />
            <span className="text-xs text-gray-500 font-semibold">Max-Life</span>
            <span className="text-sm font-bold text-gray-800">{selectedBreed.maxlife || "N/A"}</span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg col-span-3 sm:col-span-1">
            <FaHome className="text-teal-600 text-lg mb-1" />
            <span className="text-xs text-gray-500 font-semibold">Suitable For</span>
            <span className="text-sm font-bold text-gray-800 uppercase">{selectedBreed.suitableFor || "N/A"}</span>
          </div>
        </div>

        {/* === MATCHING TARGET DESIGN (Clean Typography) === */}
        <div className="text-gray-800 leading-relaxed space-y-5 text-base">
          {/* Overview Heading matching screenshot style */}
          <h3 className="text-[#00897b] font-semibold text-xl">Overview</h3>

          {/* Overview text list matching your target design screenshot */}
          <div className="space-y-4 text-gray-700">
            {selectedBreed.origin && (
              <p>
                <strong>Origin:</strong> {selectedBreed.origin}
              </p>
            )}

            {overviewPoints.length > 0 ? (
              overviewPoints.map((point: any, idx: number) => (
                <p key={idx}>
                  <strong className="text-gray-900">{point.title}:</strong> {point.description}
                </p>
              ))
            ) : (
              <p className="text-gray-500">Detailed overview content coming soon for this breed.</p>
            )}
          </div>

          {/* Breed Info Heading matching target design */}
          <h3 className="text-[#00897b] font-semibold text-xl pt-2">Breed Info</h3>

          <div>
            <p className="font-semibold text-gray-900">Common Nicknames</p>
            <p className="text-gray-600 mt-1">
              {selectedBreed.commonNicknames || "N/A"}
            </p>
          </div>

          <div>
            <p className="font-semibold text-gray-900 mb-2">Temperament</p>
            <div className="flex flex-wrap gap-2">
              {temperamentList.length > 0 ? (
                temperamentList.map((trait) => (
                  <span
                    key={trait}
                    className="border border-[#00897b] text-gray-800 text-sm px-4 py-1.5 rounded-full font-medium"
                  >
                    {trait}
                  </span>
                ))
              ) : (
                <span className="text-xs text-gray-500">Friendly, Playful</span>
              )}
            </div>
          </div>

          {/* Flat Horizontal Stats Bar matching target screenshot layout */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 pt-4 pb-2 text-sm text-gray-800 border-t border-b border-gray-200 my-6">
            <div>
              <p className="font-semibold text-gray-900">Trainability</p>
              <p className="mt-1 text-gray-600">{selectedBreed.trainability || "N/A"}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Shedding</p>
              <p className="mt-1 text-gray-600">{selectedBreed.shedding || "N/A"}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Grooming</p>
              <p className="mt-1 text-gray-600">{selectedBreed.grooming || "N/A"}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Breed Type</p>
              <p className="mt-1 text-gray-600">{selectedBreed.breedType || selectedBreed.category || "N/A"}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Size</p>
              <p className="mt-1 text-gray-600">{selectedBreed.size || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Extra Sections & Expert Banner */}
        <div className="mt-8 space-y-4">
          <div 
            className="block w-full text-white text-xl font-semibold px-6 py-4 rounded-lg my-5 shadow text-center cursor-pointer" 
            style={{ background: "#0b2545" }}
          >
            Get in touch with our Pet Experts
          </div>
          <BreedInfoNotFound />
          <BreedDetails />
        </div>
      </div>

      {/* RIGHT: Sidebar */}
      <div className="w-full lg:w-1/3">
        <div className="lg:sticky lg:top-24">
          <BreedInfoSidebar />
        </div>
      </div>
    </section>
  );
}