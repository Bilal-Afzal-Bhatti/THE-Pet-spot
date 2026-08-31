"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaPaw, FaShieldAlt, FaArrowLeft } from "react-icons/fa";
import { useBuyStore } from "@/Store/buyStore";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const getImageUrl = (imagePath?: string) => {
  if (!imagePath) return "https://via.placeholder.com/400?text=No+Image";
  if (imagePath.startsWith("http") || imagePath.startsWith("blob:")) return imagePath;
  return `${API_BASE}${imagePath.startsWith("/") ? imagePath : `/${imagePath}`}`;
};

export default function PetDetailPage() {
  const router = useRouter();
  const [pet, setPet] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const { setSelectedPet, processCheckout, loading: checkoutLoading } = useBuyStore();

  useEffect(() => {
    // Read the passed pet object directly from session storage instantly
    if (typeof window !== "undefined") {
      const storedPet = sessionStorage.getItem("selectedPetData");
      if (storedPet) {
        try {
          setPet(JSON.parse(storedPet));
        } catch (e) {
          console.error("Failed to parse pet data", e);
        }
      }
      setLoading(false);
    }
  }, []);

  // Circular Zoom Lens States
  const [isZoomed, setIsZoomed] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 0, y: 0, bgX: 0, bgY: 0 });
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    if (x < 0 || x > width || y < 0 || y > height) {
      setIsZoomed(false);
      return;
    }

    setLensPos({
      x,
      y,
      bgX: (x / width) * 100,
      bgY: (y / height) * 100,
    });
  };

const handleBuyNow = () => {
  if (!pet) return;
  setSelectedPet(pet); // Store the selected pet in Zustand/persist storage
  router.push("/checkout"); // Navigate to the checkout page
};

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <FaPaw className="text-[#55c5d0] text-5xl animate-bounce" />
          <p className="text-gray-500 font-medium">Loading pet details...</p>
        </div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Pet Not Found</h2>
        <p className="text-gray-500 mb-6">No pet data was passed or found.</p>
        <button
          onClick={() => router.push("/pet")}
          className="bg-[#55c5d0] text-black font-bold px-6 py-3 rounded-xl shadow-md cursor-pointer"
        >
          Back to Marketplace
        </button>
      </div>
    );
  }

  const rawImage = pet.img || (pet.images && pet.images[0]) || pet.image;
  const petImage = getImageUrl(rawImage);
  const petName = pet.name || pet.petName || pet.breed;
  const petPrice = pet.price || 0;

  return (
   <div className="min-h-screen w-full flex justify-center py-5 pb-10" style={{ background: "var(--gradient-hero)" }}>
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl p-6 sm:p-10 mt-20">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-black mb-6 font-semibold text-sm cursor-pointer"
        >
          <FaArrowLeft /> Back to Marketplace
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div
            ref={imageContainerRef}
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
            className="relative w-full h-[400px] sm:h-[480px] bg-gray-100 rounded-2xl overflow-hidden cursor-crosshair select-none flex items-center justify-center border border-gray-100"
          >
            <Image src={petImage} alt={petName} fill priority className="object-cover pointer-events-none" />

            {isZoomed && (
              <div
                className="absolute pointer-events-none rounded-full border-2 border-white shadow-2xl"
                style={{
                  width: "160px",
                  height: "160px",
                  left: `${lensPos.x - 80}px`,
                  top: `${lensPos.y - 80}px`,
                  backgroundImage: `url(${petImage})`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: `${lensPos.bgX}% ${lensPos.bgY}%`,
                  backgroundSize: "500%",
                }}
              />
            )}
          </div>

          <div className="flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-[var(--color-primary)]/20 text-black px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  {pet.category || pet.type || "Pet"}
                </span>
                <span className="text-gray-400 text-sm">• {pet.breed || "Pure Breed"}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">{petName}</h1>
              <p className="text-2xl font-black text-[var(--color-primary)] mt-2">₹{petPrice}</p>

              <div className="grid grid-cols-2 gap-4 my-6 p-4 bg-gray-50 rounded-xl border border-gray-100 text-sm">
                <div>
                  <span className="text-gray-400 block">Age</span>
                  <strong className="text-gray-800">{pet.age ? `${pet.age}` : "N/A"}</strong>
                </div>
                <div>
                  <span className="text-gray-400 block">Gender</span>
                  <strong className="text-gray-800">{pet.gender || "N/A"}</strong>
                </div>
              </div>

              <h3 className="font-bold text-gray-900 mb-1">About {petName}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{pet.description || "No description provided."}</p>
            </div>

            <div className="space-y-3 pt-6 border-t border-gray-100">
              <button
                onClick={handleBuyNow}
                disabled={checkoutLoading}
                className="w-full py-4 bg-[var(--color-primary)] text-black font-extrabold rounded-2xl shadow-lg hover:scale-102 transition-transform text-base cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <FaPaw /> {checkoutLoading ? "PROCESSING..." : `BUY NOW — ₹{petPrice}`}
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-gray-400 pt-2">
                <FaShieldAlt className="text-green-500" /> Secure checkout protected by Stripe Idempotency & SSL
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}