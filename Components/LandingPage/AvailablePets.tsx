"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaHeart, FaPaw, FaArrowRight } from "react-icons/fa";
import Image from "next/image";

import { useAdStore, Base_URL } from "@/Store/AdsStore"; // 👈 Import Base_URL here!

const getPetImage = (pet: any) => {
  const rawPath =
    (typeof pet.img === "string" && pet.img.trim() !== "" ? pet.img : null) ||
    (Array.isArray(pet.images) && pet.images[0] ? pet.images[0] : null) ||
    (typeof pet.image === "string" && pet.image.trim() !== "" ? pet.image : null);

  if (!rawPath) return "/default-pet.jpg";
  if (rawPath.startsWith("http")) return rawPath;

  return `${Base_URL}${rawPath.startsWith("/") ? "" : "/"}${rawPath}`;
};

const shuffleArray = (array: any[]) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export default function AvailablePets() {
  const router = useRouter();
  const [pets, setPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchAllPets = async () => {
      try {
        const store = useAdStore.getState();

        const [dogsData, catsData] = await Promise.all([
          store.getApprovedDogAds ? store.getApprovedDogAds(1, 5) : Promise.resolve({ ads: [] }),
          store.getApprovedCatAds ? store.getApprovedCatAds(1, 5) : Promise.resolve({ ads: [] }),
        ]);

        if (isMounted) {
          const dogs = dogsData?.ads || [];
          const cats = catsData?.ads || [];
          const combined = shuffleArray([...dogs, ...cats]);
          setPets(combined.slice(0, 5));
        }
      } catch (err) {
        console.error("Failed to load available pets", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAllPets();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleViewPet = (pet: any) => {
    const petName = pet.name || pet.title || "Pet";
    const petSlug = encodeURIComponent(
      petName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")
    );

    // Save the entire pet object locally so the next page can read it instantly
    if (typeof window !== "undefined") {
      sessionStorage.setItem("selectedPetData", JSON.stringify(pet));
    }

    router.push(`/pets/${petSlug}`);
  };

  return (
    <section className="py-20 px-4 md:px-16 bg-linear-to-b from-white to-gray-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-72 h-72 bg-[#55c5d0]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#a6ce39]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
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
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-3xl h-80 animate-pulse flex flex-col justify-end p-4" />
            ))}
          </div>
        ) : pets.length === 0 ? (
          <div className="text-center py-12 text-gray-500 font-medium">
            No approved pets available at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
            {pets.map((pet) => {
              const petImage = getPetImage(pet);
              const petName = pet.name || pet.title || "Pet";
              const petCategory = pet.category || pet.type || "pets";

              return (
                <div
                  key={pet._id || pet.id}
                  onClick={() => handleViewPet(pet)}
                  className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer flex flex-col"
                >
                  <div className="relative h-56 overflow-hidden w-full bg-gray-100">
                    <Image
                      src={petImage}
                      alt={petName}
                      fill
                      loading="lazy"
                      unoptimized={true}
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-black/60 text-white text-xs font-bold px-3 py-1 rounded-full capitalize">
                      {petCategory}
                    </div>
                  </div>

                  <div className="p-4 flex flex-col justify-between grow">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 truncate">{petName}</h3>
                      <p className="text-sm text-gray-600 mb-3 truncate">{pet.breed || "Available Now"}</p>
                    </div>
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewPet(pet);
                      }}
                      className="w-full bg-black text-white font-semibold py-2 rounded-xl"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="text-center mt-12">
          <button
            onClick={() => router.push("/pet")}
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