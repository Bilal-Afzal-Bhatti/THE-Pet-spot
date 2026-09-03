"use client";
//main page VIEW DETAIL PAGE FOR DOG
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { FaArrowLeft, FaShieldAlt, FaPhone, FaMapMarkerAlt, FaVenusMars, FaBirthdayCake, FaSpinner } from "react-icons/fa";
import { Base_URL } from "@/Store/AdsStore";
import { useBuyStore } from "@/Store/buyStore";

const getPetImage = (pet: any) => {
  const rawPath =
    (typeof pet?.img === "string" && pet.img.trim() !== "" ? pet.img : null) ||
    (Array.isArray(pet?.images) && pet.images[0] ? pet.images[0] : null) ||
    (typeof pet?.image === "string" && pet.image.trim() !== "" ? pet.image : null) ||
    (typeof pet?.petImage === "string" && pet.petImage.trim() !== "" ? pet.petImage : null);

  if (!rawPath) return "/default-pet.jpg";
  if (rawPath.startsWith("http")) return rawPath;

  return `${Base_URL}${rawPath.startsWith("/") ? "" : "/"}${rawPath}`;
};

export default function PetDetailPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;

  const { setSelectedPet } = useBuyStore();
  const [pet, setPet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    const loadPet = () => {
      try {
        if (typeof window !== "undefined") {
          const storedPet = sessionStorage.getItem("selectedPetData");
          if (storedPet) {
            const parsedPet = JSON.parse(storedPet);
            setPet(parsedPet);
          }
        }
      } catch (err) {
        console.error("Failed to load pet from session storage", err);
      } finally {
        setLoading(false);
      }
    };

    loadPet();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl mx-auto mb-3 text-orange-600" />
          <p className="text-gray-600 font-medium">Loading pet details...</p>
        </div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md w-full">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Pet Not Found</h2>
          <p className="text-gray-500 text-sm mb-6">We couldn't find the details for this pet. Please select one from the marketplace.</p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-black text-white font-bold rounded-xl cursor-pointer"
          >
            Back to Marketplace
          </button>
        </div>
      </div>
    );
  }

  const petName = pet.name || pet.title || "Pet";
  const images = Array.isArray(pet.images) && pet.images.length > 0 
    ? pet.images 
    : [pet.img || pet.image || pet.petImage].filter(Boolean);

  const currentImageUrl = images[selectedImageIndex] ? getPetImage({ images: [images[selectedImageIndex]] }) : "/default-pet.jpg";

  // const handleBuyNow = () => {
  //   setSelectedPet(pet);
  //   if (typeof window !== "undefined") {
  //     sessionStorage.setItem("selectedPetData", JSON.stringify(pet));
  //   }
  //   const petId = pet._id || pet.id;
  //   router.push(`/checkout${petId ? `?petId=${petId}` : ""}`);
  // };
  const slugify = (s?: string) => {
    if (!s) return "";
    return encodeURIComponent(
      s
        .toString()
        .trim()
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[\s\_]+/g, "-")
        .replace(/[^\w\-]+/g, "")
        .replace(/\-\-+/g, "-")
    );
  };

  // Convert slug back to human readable (german-shepherd -> German Shepherd)
  const unSlug = (s?: string) => {
    if (!s) return "";
    try {
      const dec = decodeURIComponent(s);
      const words = dec
        .replace(/-/g, " ")
        .replace(/_/g, " ")
        .trim()
        .split(/\s+/)
        .map((w) => (w.length ? w[0].toUpperCase() + w.slice(1) : w));
      return words.join(" ");
    } catch {
      return s.replace(/-/g, " ");
    }
  };
  const handleBuyNow = () => {
    setSelectedPet(pet);
    
    // Get the exact ID
    const petId = pet._id || pet.id;
    const petName = pet.petName || pet.name || pet.title || "Pet";
    const petBreed = pet.breed || "cat"; // or dog based on your context
    const petSlug = `${slugify(petName)}-${slugify(petBreed)}`;

    if (typeof window !== "undefined") {
      sessionStorage.setItem("selectedPetData", JSON.stringify(pet));
      if (petId) {
        sessionStorage.setItem("currentPetId", petId);
      }
    }

    // Push to a clean slug route without exposing the raw ID in the query params
    router.push(`/checkout/${petSlug}`);
  };

  return (
   <div className="min-h-screen w-full flex justify-center px-4 sm:px-6 py-5 pb-10" style={{ background: "var(--gradient-hero)" }}>
      <div className="w-full max-w-6xl mx-auto mt-16 sm:mt-20 lg:mt-22">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-black mb-4 sm:mb-6 font-semibold text-sm cursor-pointer transition-colors"
        >
          <FaArrowLeft /> Back to Listings
        </button>

        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 p-4 sm:p-6 lg:p-10">

          {/* Image Gallery Section */}
          <div className="space-y-3 sm:space-y-4">
            <div
              className="relative w-full h-64 xs:h-72 sm:h-80 md:h-96 bg-gray-100 rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer shadow-md"
              onClick={() => setIsZoomed(true)}
            >
              <Image
                src={currentImageUrl}
                alt={petName}
                fill
                priority
                unoptimized={true}
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 bg-black/60 text-white text-[10px] sm:text-xs px-2.5 sm:px-3 py-1 rounded-full">
                Click to expand
              </div>
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2">
                {images.map((img: string, idx: number) => {
                  const thumbUrl = getPetImage({ images: [img] });
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg sm:rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                        selectedImageIndex === idx ? "border-black scale-105 shadow-md" : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Image src={thumbUrl} alt="Thumbnail" fill unoptimized={true} className="object-cover" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="flex flex-col justify-between space-y-5 sm:space-y-6">
            <div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4 mb-2">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 wrap-break-word">{petName}</h1>
                <span className="text-xl sm:text-2xl font-black text-orange-600 whitespace-nowrap">
                  PKR {pet.price || "Contact for Price"}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 sm:mb-6">
                {pet.breed || pet.category || "Available Pet"}
              </p>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6 bg-gray-50 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-gray-100">
                <div className="flex items-center gap-2 sm:gap-3 text-gray-700 text-xs sm:text-sm">
                  <FaBirthdayCake className="text-orange-500 text-base sm:text-lg shrink-0" />
                  <div className="min-w-0">
                    <span className="block text-[10px] sm:text-xs text-gray-400 font-semibold uppercase">Age</span>
                    <span className="font-bold truncate block">{pet.age || "Not Specified"}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 text-gray-700 text-xs sm:text-sm">
                  <FaVenusMars className="text-orange-500 text-base sm:text-lg shrink-0" />
                  <div className="min-w-0">
                    <span className="block text-[10px] sm:text-xs text-gray-400 font-semibold uppercase">Gender</span>
                    <span className="font-bold truncate block">{pet.gender || "Not Specified"}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 text-gray-700 text-xs sm:text-sm col-span-2">
                  <FaMapMarkerAlt className="text-orange-500 text-base sm:text-lg shrink-0" />
                  <div className="min-w-0">
                    <span className="block text-[10px] sm:text-xs text-gray-400 font-semibold uppercase">Location</span>
                    <span className="font-bold truncate block">{pet.location || pet.city || "Pakistan"}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs sm:text-sm font-bold text-gray-900 uppercase mb-2">About {petName}</h3>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                  {pet.description || pet.bio || "No description provided for this pet yet."}
                </p>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4 pt-4 border-t">
              <button
                onClick={handleBuyNow}
                className="w-full py-3.5 sm:py-4 bg-black text-white font-extrabold rounded-xl sm:rounded-2xl shadow-lg hover:bg-gray-800 transition-all text-sm sm:text-base cursor-pointer"
              >
                Proceed to Checkout
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] sm:text-xs text-gray-400 text-center">
                <FaShieldAlt className="text-green-500 text-sm shrink-0" /> Verified healthy & vaccinated pet listing.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Image Zoom */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-3 sm:p-4 cursor-pointer"
          onClick={() => setIsZoomed(false)}
        >
          <div className="relative w-full max-w-4xl h-[70vh] sm:h-[80vh]">
            <Image src={currentImageUrl} alt="Zoomed Pet" fill unoptimized={true} className="object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}