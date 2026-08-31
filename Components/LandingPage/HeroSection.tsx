"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaSearch, FaPaw, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { authStore } from "@/Store/authStore";

// Static reference outside component to keep memory address stable
const PET_IMAGES = [
  "/pets/image1.jpg",
  "/pets/image2.webp",
  "/pets/image3.avif",
  "/pets/image4.webp",
  "/pets/image5.jpg",
];

const STATS = [
  { label: "Happy Families", value: "10K+" },
  { label: "Pets Listed", value: "5K+" },
  { label: "Breeders", value: "500+" },
];

export default function HeroSection() {
  const router = useRouter();
  const [selectedPet, setSelectedPet] = useState("");
  const store = authStore() as any;
  const { authUser } = store;

  // Carousel state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const isProcessingRef = useRef(false);

  // Throttled image switcher to prevent image re-fetch micro-spikes on rapid clicks
  const changeImage = useCallback((targetIndex: number) => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;

    setCurrentImageIndex(targetIndex);

    // 300ms throttle boundary matching transition duration
    setTimeout(() => {
      isProcessingRef.current = false;
    }, 300);
  }, []);

  const nextImage = useCallback(() => {
    const nextIdx = currentImageIndex === PET_IMAGES.length - 1 ? 0 : currentImageIndex + 1;
    changeImage(nextIdx);
  }, [currentImageIndex, changeImage]);

  const prevImage = useCallback(() => {
    const prevIdx = currentImageIndex === 0 ? PET_IMAGES.length - 1 : currentImageIndex - 1;
    changeImage(prevIdx);
  }, [currentImageIndex, changeImage]);

  // Carousel Interval Timer
  useEffect(() => {
    const interval = setInterval(() => {
      nextImage();
    }, 5000);

    return () => clearInterval(interval);
  }, [nextImage]);

  const handleSearch = () => {
    if (
      !selectedPet ||
      selectedPet === "Select Pet Type" ||
      selectedPet === "Please Select The Pet You Are Looking For..."
    ) {
      alert("Please select a pet type first!");
      return;
    }

    const route =
      selectedPet === "Dogs"
        ? "/dogs/for-sale"
        : selectedPet === "Cats"
        ? "/cats/for-sale"
        : selectedPet === "Small Pets"
        ? "/small-pets"
        : "/";

    router.push(route);
  };

  return (
    <section
      className="relative min-h-[85vh] w-full overflow-hidden px-4 sm:px-8 lg:px-12 xl:px-24"
      style={{ background: "var(--gradient-hero)" }}
    >
      {/* Background Decorators */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-20 left-10 w-48 sm:w-64 h-48 sm:h-64 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-64 sm:w-96 h-64 sm:h-96 bg-white rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto pt-10 sm:pt-16 lg:pt-20 pb-16 sm:pb-24 lg:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Hero Text & Controls */}
          <div className="text-white space-y-6 sm:space-y-8 mt-12 lg:mt-10">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2 mb-2 sm:mb-4 flex-wrap">
                <FaPaw className="text-2xl sm:text-3xl text-white animate-bounce shrink-0" />
                <span className="text-xs sm:text-sm font-semibold tracking-widest uppercase bg-white/20 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-sm">
                  Welcome to Pets Corner
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                Find Your{" "}
                <span className="block bg-linear-to-r from-white to-yellow-200 bg-clip-text text-transparent">
                  Perfect Companion
                </span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-white/90 font-light leading-relaxed max-w-xl">
                Connecting loving families with adorable pets. Your journey to unconditional love starts here.
              </p>
            </div>

            {/* Search Controls */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-4 sm:p-6 space-y-4">
              <div className="flex items-center gap-2 text-white mb-1">
                <FaSearch className="text-(--color-primary) text-lg" />
                <h3 className="font-semibold text-base sm:text-lg">
                  Search for Your Pet
                </h3>
              </div>

              <div className="flex flex-col sm:flex-row w-full gap-3 sm:gap-4">
                <select
                  value={selectedPet}
                  onChange={(e) => setSelectedPet(e.target.value)}
                  className="w-full sm:w-2/3 p-3.5 sm:p-4 border-2 border-white/30 rounded-xl outline-none font-medium text-gray-900 bg-white/90 backdrop-blur-sm hover:border-(--color-primary) focus:border-(--color-primary) focus:bg-white transition-all cursor-pointer text-sm sm:text-base"
                >
                  <option>Select Pet Type</option>
                  <option>Dogs</option>
                  <option>Cats</option>
                  <option>Small Pets</option>
                </select>

                <button
                  type="button"
                  onClick={handleSearch}
                  className="w-full sm:w-1/3 text-black font-bold py-3.5 sm:py-4 rounded-xl hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base shrink-0 cursor-pointer"
                  style={{ background: "var(--color-primary)" }}
                >
                  <FaSearch />
                  <span>Search</span>
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              {STATS.map((stat, i) => (
                <div key={i} className="bg-white/20 backdrop-blur-md rounded-xl p-3 sm:p-4 text-center">
                  <div className="text-xl sm:text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-white/80 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Carousel Track */}
          <div className="relative w-full">
            <div className="relative w-full h-[280px] sm:h-[380px] lg:h-[500px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
              <div
                className="flex h-full transition-transform duration-700 ease-out"
                style={{
                  transform: `translateX(-${currentImageIndex * 100}%)`,
                }}
              >
                {PET_IMAGES.map((image, index) => (
                  <div key={image} className="relative w-full h-full shrink-0">
                    <Image
                      src={image}
                      alt={`Pet ${index + 1}`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                      priority={index === 0}
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(to top, rgba(0,0,0,${
                          0.5 + index * 0.08
                        }) 0%, transparent 60%)`,
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Controls */}
              <button
                type="button"
                onClick={prevImage}
                aria-label="Previous Image"
                className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-10 sm:w-12 h-10 sm:h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 hover:scale-110 shadow-lg cursor-pointer z-10"
              >
                <FaChevronLeft className="text-base sm:text-xl" />
              </button>

              <button
                type="button"
                onClick={nextImage}
                aria-label="Next Image"
                className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-10 sm:w-12 h-10 sm:h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 hover:scale-110 shadow-lg cursor-pointer z-10"
              >
                <FaChevronRight className="text-base sm:text-xl" />
              </button>

              {/* Carousel Indicators */}
              <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-2 sm:space-x-3 z-10">
                {PET_IMAGES.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => changeImage(index)}
                    aria-label={`Go to slide ${index + 1}`}
                    className={`relative transition-all duration-500 cursor-pointer ${
                      index === currentImageIndex
                        ? "w-6 sm:w-8 h-2.5 sm:h-3 bg-white shadow-lg"
                        : "w-2.5 sm:w-3 h-2.5 sm:h-3 bg-white/50 hover:bg-white/75"
                    } rounded-full`}
                  />
                ))}
              </div>

              {/* Bottom Progress Indicator */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20 z-10">
                <div
                  className="h-full bg-linear-to-r from-(--color-primary) to-(--color-secondary) transition-all duration-700 ease-out rounded-r-full"
                  style={{
                    width: `${((currentImageIndex + 1) / PET_IMAGES.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}