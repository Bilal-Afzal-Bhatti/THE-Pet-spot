"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaPaw, FaSpinner, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useAdStore } from "@/Store/AdsStore";

const ITEMS_PER_PAGE = 8;

const getImageUrl = (imagePath?: string) => {
  if (!imagePath) return "https://via.placeholder.com/150?text=No+Image";

  if (
    imagePath.startsWith("http://") ||
    imagePath.startsWith("https://") ||
    imagePath.startsWith("blob:")
  ) {
    return imagePath;
  }

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  const fullPath = cleanPath.startsWith("/uploads/") ? cleanPath : `/uploads${cleanPath}`;

  return `${API_BASE}${fullPath}`;
};

export default function AllPetsPage() {
  const [pets, setPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch and offload data processing to a Web Worker
  useEffect(() => {
    let isMounted = true;

    const fetchAndProcessPets = async () => {
      try {
        const store = useAdStore.getState();

        const [dogsData, catsData] = await Promise.all([
          store.getApprovedDogAds ? store.getApprovedDogAds(1, 50) : Promise.resolve({ ads: [] }),
          store.getApprovedCatAds ? store.getApprovedCatAds(1, 50) : Promise.resolve({ ads: [] }),
        ]);

        if (!isMounted) return;

        const rawDogs = dogsData?.ads || [];
        const rawCats = catsData?.ads || [];

        // Check if Web Workers are supported by the browser environment
        if (typeof window !== "undefined" && window.Worker) {
          const workerCode = `
            self.onmessage = function(e) {
              const { dogs, cats } = e.data;
              const mappedDogs = dogs.map(item => ({ ...item, category: "Dog" }));
              const mappedCats = cats.map(item => ({ ...item, category: "Cat" }));
              
              const combined = [...mappedDogs, ...mappedCats].sort((a, b) =>
                (a._id || a.id).toString().localeCompare((b._id || b.id).toString())
              );

              self.postMessage(combined);
            };
          `;

          const blob = new Blob([workerCode], { type: "application/javascript" });
          const workerUrl = URL.createObjectURL(blob);
          const worker = new Worker(workerUrl);

          worker.onmessage = (event) => {
            setPets(event.data);
            setLoading(false);
            worker.terminate();
            URL.revokeObjectURL(workerUrl);
          };

          worker.postMessage({ dogs: rawDogs, cats: rawCats });
        } else {
          // Fallback if Web Workers aren't available
          const dogs = rawDogs.map((item: any) => ({ ...item, category: "Dog" }));
          const cats = rawCats.map((item: any) => ({ ...item, category: "Cat" }));
          const combined = [...dogs, ...cats].sort((a, b) =>
            (a._id || a.id).toString().localeCompare((b._id || b.id).toString())
          );
          setPets(combined);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching all pets:", err);
        if (isMounted) setLoading(false);
      }
    };

    fetchAndProcessPets();

    return () => {
      isMounted = false;
    };
  }, []);

  // Main Carousel Auto-play Timer (1 second interval)
  useEffect(() => {
    if (pets.length === 0) return;

    const timer = setInterval(() => {
      setCarouselIndex((prev) => (prev === pets.length - 1 ? 0 : prev + 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [pets.length]);

  const totalPages = Math.ceil(pets.length / ITEMS_PER_PAGE);
  const currentPets = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return pets.slice(start, start + ITEMS_PER_PAGE);
  }, [pets, currentPage]);

  const handleNextSlide = useCallback(() => {
    setCarouselIndex((prev) => (prev === pets.length - 1 ? 0 : prev + 1));
  }, [pets.length]);

  const handlePrevSlide = useCallback(() => {
    setCarouselIndex((prev) => (prev === 0 ? pets.length - 1 : prev - 1));
  }, [pets.length]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen w-full flex justify-center py-5 pb-10" style={{ background: "var(--gradient-hero)" }}>
      <div className="w-full max-w-7xl mx-auto bg-gray-50 rounded-3xl shadow-xl py-8 px-4 sm:px-6 lg:px-8 mt-26 mb-6">
        <div className="space-y-10">

          {/* Header */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <FaPaw className="text-2xl text-(--color-primary)" />
              <span className="text-sm font-semibold tracking-widest uppercase text-gray-500">
                Our Marketplace
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Explore All Available Pets
            </h1>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] w-full">
              <FaSpinner className="animate-spin text-4xl text-(--color-primary) mb-4" />
              <p className="text-gray-500 font-medium">Processing via Web Worker...</p>
            </div>
          ) : pets.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
              <p className="text-xl text-gray-500">No pets currently available.</p>
            </div>
          ) : (
            <>
              {/* Main Featured Hero Carousel with 1s Smooth Transition */}
              <div className="relative w-full h-[360px] sm:h-[460px] lg:h-[520px] rounded-3xl overflow-hidden shadow-xl bg-gray-900 group">
                {pets.map((pet, idx) => {
                  const petId = pet._id || pet.id;
                  const isDog = pet.category === "Dog";
                  const petImage = getImageUrl(pet.images?.[0] || pet.image);
                  const isActive = idx === carouselIndex;

                  return (
                    <div
                      key={petId}
                      className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                        isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                      }`}
                    >
                      <Image
                        src={petImage}
                        alt={pet.petName || "Featured Pet"}
                        fill
                        priority={idx === 0}
                        loading={idx === 0 ? "eager" : "lazy"}
                        sizes="100vw"
                        unoptimized={true}
                        className="object-contain w-full opacity-90 bg-black/40 backdrop-blur-xs"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                      <div className="absolute bottom-8 left-6 sm:left-10 right-6 text-white max-w-xl z-25">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-white/25 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                            {pet.category} ({idx + 1} / {pets.length})
                          </span>
                        </div>
                        <h2 className="text-2xl sm:text-4xl font-extrabold">
                          {pet.petName || pet.breed || "Adorable Companion"}
                        </h2>
                        <p className="text-sm sm:text-base text-gray-200 mt-1 line-clamp-1">
                          {pet.breed ? `${pet.breed} • ` : ""}Looking for a loving home
                        </p>
                        <Link
                          href={isDog ? `/dogs/${petId}` : `/cats/${petId}`}
                          className="inline-block mt-4 px-6 py-2.5 bg-(--color-primary) text-black font-bold rounded-xl hover:scale-105 transition-transform text-sm"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  );
                })}

                <button
                  type="button"
                  onClick={handlePrevSlide}
                  aria-label="Previous Slide"
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/50 transition-all cursor-pointer"
                >
                  <FaChevronLeft />
                </button>

                <button
                  type="button"
                  onClick={handleNextSlide}
                  aria-label="Next Slide"
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/50 transition-all cursor-pointer"
                >
                  <FaChevronRight />
                </button>
              </div>

              {/* Grid Display */}
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-900">All Available Listings</h3>
                  <span className="text-sm text-gray-500">
                    Page {currentPage} of {totalPages}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {currentPets.map((pet) => {
                    const petId = pet._id || pet.id;
                    const petName = pet.petName || pet.name || pet.breed || "Adorable Pet";
                    const petImage = getImageUrl(pet.images?.[0] || pet.image);
                    const price = pet.price ? `₹${pet.price}` : "Contact for Price";
                    const isDog = pet.category === "Dog";

                    return (
                      <div
                        key={petId}
                        className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col"
                      >
                        <div className="relative h-56 w-full bg-gray-100 overflow-hidden">
                          <Image
                            src={petImage}
                            alt={petName}
                            fill
                            loading="lazy"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            unoptimized={true}
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-gray-800 shadow-sm">
                            {pet.category}
                          </span>
                        </div>

                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <div>
                            <h2 className="text-base font-bold text-gray-900 group-hover:text-(--color-primary) transition-colors">
                              {petName}
                            </h2>
                            {pet.breed && (
                              <p className="text-xs text-gray-500 mt-1">{pet.breed}</p>
                            )}
                          </div>

                          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                            <span className="text-sm font-extrabold text-gray-900">
                              {price}
                            </span>
                            <Link
                              href={isDog ? `/dogs/${petId}` : `/cats/${petId}`}
                              className="text-xs font-semibold text-(--color-primary) group-hover:translate-x-1 transition-transform"
                            >
                              View Details &rarr;
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 pt-8">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      Previous
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-10 h-10 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                          currentPage === page
                            ? "bg-(--color-primary) text-black shadow-md"
                            : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}