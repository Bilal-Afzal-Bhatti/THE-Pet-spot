"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaHeart, FaPaw, FaArrowRight } from "react-icons/fa";
import Image from "next/image";
import { useAdStore } from "@/Store/AdsStore";

export default function AvailablePets() {
  const router = useRouter();
  const { isLoading } = useAdStore();
  const [pets, setPets] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;

    const fetchAllPets = async () => {
      console.log("Fetching approved dogs and cats...");
      
      const store = useAdStore.getState();

      // Fetch dogs and cats in parallel
      const [dogsData, catsData] = await Promise.all([
        store.getApprovedDogAds ? store.getApprovedDogAds(1, 5) : Promise.resolve({ ads: [] }),
        store.getApprovedCatAds ? store.getApprovedCatAds(1, 5) : Promise.resolve({ ads: [] }),
      ]);

      if (isMounted) {
        const dogs = dogsData?.ads || [];
        const cats = catsData?.ads || [];

        console.log("Dogs fetched:", dogs);
        console.log("Cats fetched:", cats);

        // Combine and shuffle dogs and cats
        const combined = [...dogs, ...cats].sort(() => 0.5 - Math.random());

        setPets(combined.slice(0, 5));
      }
    };

    fetchAllPets();

    return () => {
      isMounted = false;
    };
  }, []);

  // Helper to extract a valid image path safely
// Helper to extract a valid image path 
const Base_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
const getPetImage = (pet: any) => {
  // Extract path from mapped 'img', raw array 'images[0]', or fallback property
  const rawPath =
    (typeof pet.img === "string" && pet.img.trim() !== "" ? pet.img : null) ||
    (Array.isArray(pet.images) && pet.images[0] ? pet.images[0] : null) ||
    (typeof pet.image === "string" && pet.image.trim() !== "" ? pet.image : null);

  if (!rawPath) return "/default-pet.jpg";
  if (rawPath.startsWith("http")) return rawPath; // Full URL already pointing to backend

  // Ensure relative paths point to Express backend (Port 5000)
  return `${Base_URL}${rawPath.startsWith("/") ? "" : "/"}${rawPath}`;
};
  return (
    <section className="py-20 px-4 md:px-16 bg-linear-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-[#55c5d0]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#a6ce39]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <FaPaw className="text-[#55c5d0] text-3xl animate-bounce" />
            <span className="text-sm font-bold text-[#55c5d0] tracking-widest uppercase">
              Featured Pets
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Meet Your New
            <span className="block bg-(--color-primary) bg-clip-text text-transparent">
              Furry Friend
            </span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover adorable dogs and cats waiting for their forever homes. Each one is special and ready to bring joy to your life.
          </p>
        </div>

        {/* Pet Cards Grid */}
        {isLoading ? (
          /* Skeleton Loader */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-200 rounded-3xl h-80 animate-pulse flex flex-col justify-end p-4"
              >
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-300 rounded w-1/2 mb-4" />
                <div className="h-10 bg-gray-300 rounded-xl w-full" />
              </div>
            ))}
          </div>
        ) : pets.length === 0 ? (
          /* Empty State */
          <div className="text-center py-12 text-gray-500 font-medium">
            No approved pets available at the moment.
          </div>
        ) : (
          /* Live Ads Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
            {pets.map((pet) => {
              const petImage = getPetImage(pet);
              const petName = pet.name || pet.title || "Pet";
              const petCategory = pet.category || pet.type || "pets";
              const petId = pet.id || pet._id;

              return (
                <div
                  key={petId}
                  className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer flex flex-col"
                  onClick={() => router.push(`/${petCategory.toLowerCase()}/for-sale/${petId}`)}
                >
                  {/* Image Container */}
                  <div className="relative h-56 overflow-hidden w-full bg-gray-100">
                    <Image
                      src={petImage}
                      alt={petName}
                      fill
                      unoptimized={true} // Bypasses Next.js domain restrictions if images are hosted on external servers
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 20vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />

                    {/* Overlay on Hover */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <div className="text-sm font-medium">{pet.breed || "Pure Breed"}</div>
                        <div className="text-xs opacity-90">
                          {pet.age ? `${pet.age} old` : "Age N/A"}
                        </div>
                      </div>
                    </div>

                    {/* Heart Icon */}
                    <button
                      type="button"
                      onClick={(e) => e.stopPropagation()}
                      className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-red-50"
                    >
                      <FaHeart className="text-red-500" />
                    </button>

                    {/* Featured Badge */}
                    <div className="absolute top-4 left-4 bg-(--bg-dark-accent) text-white text-xs font-bold px-3 py-1 rounded-full capitalize">
                      {petCategory}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 flex flex-col justify-between grow">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold text-gray-900 truncate">{petName}</h3>
                        <FaPaw className="text-[#55c5d0] group-hover:text-[#a6ce39] transition-colors shrink-0" />
                      </div>
                      <p className="text-sm text-gray-600 mb-3 truncate">
                        {pet.breed || pet.city || pet.location || "Available Now"}
                      </p>
                    </div>

                    {/* Action Button */}
                    <button className="w-full bg-(--bg-dark-accent) text-white font-semibold py-2 rounded-xl hover:shadow-lg transition-all duration-300 transform group-hover:scale-105">
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* CTA Button */}
        <div className="text-center">
          <button
            onClick={() => router.push("/pets")}
            className="group inline-flex items-center gap-3 bg-(--color-primary) text-white font-bold px-10 py-5 rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            <span className="text-lg text-black">Explore All Pets</span>
            <FaArrowRight className="group-hover:translate-x-2 transition-transform duration-300 text-black" />
          </button>
        </div>
      </div>
    </section>
  );
}