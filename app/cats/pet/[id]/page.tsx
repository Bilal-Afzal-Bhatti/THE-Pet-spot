"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiMapPin, FiCalendar, FiUser, FiPhone, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { FaCat, FaWeight, FaRulerVertical, FaHeartbeat, FaSyringe, FaCertificate } from "react-icons/fa";
import { SiWhatsapp } from "react-icons/si";
import { useAdStore } from "@/Store/AdsStore";
import { useBuyStore } from "@/Store/buyStore";

export default function CatDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { getApprovedCatAdById } = useAdStore();
  const {} = useBuyStore();
  
  const [pet, setPet] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  // Magnifying lens states
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [lensPos, setLensPos] = useState({ x: 0, y: 0, bgX: 0, bgY: 0 });
  
  const resolvedParams = React.use(params);

  useEffect(() => {
    const fetchPet = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getApprovedCatAdById(resolvedParams.id);
        if (data) {
          setPet(data);
        } else {
          setError("Cat not found");
        }
      } catch (err) {
        console.error("Failed to fetch cat:", err);
        setError("Failed to load cat details");
      } finally {
        setLoading(false);
      }
    };

    if (resolvedParams.id) {
      fetchPet();
    }
  }, [resolvedParams.id, getApprovedCatAdById]);

  // Safe image list resolution
  const validImages: string[] = (pet?.images || []).filter((img: string) => img?.startsWith("http"));

  const images: string[] = validImages.length > 0
    ? validImages
    : [pet?.img?.startsWith("http") ? pet.img : '/default-pet.jpg'];

  // Auto-slide effect every 4 seconds
  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

  // Handle mouse movement for circular zoom lens
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    const bgX = (x / width) * 100;
    const bgY = (y / height) * 100;

    setLensPos({ x, y, bgX, bgY });
  };

  if (loading) {
    return (
      <div className="min-h-screen font-raleway bg-gray-50">
        <div className="h-25" style={{ background: "var(--gradient-hero)" }}></div>
        <div className="p-6 px-44 -mt-16 relative z-10 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading cat details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !pet) {
    return (
      <div className="min-h-screen font-raleway bg-gray-50">
        <div className="h-25" style={{ background: "var(--gradient-hero)" }}></div>
        <div className="p-6 px-44 -mt-16 relative z-10 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-6xl mb-4">🐱</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{error || "Cat not found"}</h2>
            <p className="text-gray-500">The cat you're looking for might have been removed or is no longer available.</p>
          </div>
        </div>
      </div>
    );
  }

  const petImage = images[currentImageIndex] || '/default-pet.jpg';

  // Slider navigation
  const goToPrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="min-h-screen font-raleway bg-gray-50 pb-16">
      {/* Banner Background */}
      <div className="h-25" style={{ background: "var(--gradient-hero)" }}></div>
      
      <div className="p-6 px-6 lg:px-44 relative z-10">
        {/* Breadcrumb */}
        <nav className="mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-gray-600">
            <li><a href="/" className="hover:text-orange-600 transition-colors">Home</a></li>
            <li><span>→</span></li>
            <li><a href="/cats/for-sale" className="hover:text-orange-600 transition-colors">Cats</a></li>
            <li><span>→</span></li>
            <li className="text-gray-800 font-medium truncate max-w-50">{pet.name}</li>
          </ol>
        </nav>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Column: Image Gallery & Seller Card */}
            <div className="space-y-6">
              
              {/* Main Image Container with Circular Magnifying Lens */}
              <div 
                className="relative overflow-hidden rounded-2xl h-100 cursor-crosshair bg-gray-100 shadow-lg select-none"
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                onMouseMove={handleMouseMove}
              >
                <img
                  src={petImage}
                  alt={pet.name || "Pet"}
                  className="w-full h-full object-cover pointer-events-none"
                />

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

                {/* Slider arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={goToPrevImage}
                      onMouseEnter={() => setIsZoomed(false)}
                      aria-label="Previous image"
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white shadow-md flex items-center justify-center text-gray-800 transition-colors z-10"
                    >
                      <FiChevronLeft className="text-xl" />
                    </button>
                    <button
                      type="button"
                      onClick={goToNextImage}
                      onMouseEnter={() => setIsZoomed(false)}
                      aria-label="Next image"
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white shadow-md flex items-center justify-center text-gray-800 transition-colors z-10"
                    >
                      <FiChevronRight className="text-xl" />
                    </button>
                  </>
                )}
              </div>

              {/* Description Card */}
              {pet.description && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Description</h3>
                  <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">{pet.description}</p>
                </div>
              )}

              {/* Seller Info Card */}
              {pet.user && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Seller Information</h3>
                  <div className="flex items-center gap-3">
                    {pet.user.avatar ? (
                      <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0">
                        <Image
                          src={pet.user.avatar}
                          alt={pet.user.name || "Seller"}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                        <FiUser className="text-orange-600 text-xl" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-800">{pet.user.name}</p>
                      <p className="text-sm text-gray-500">{pet.user.email}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Details & Actions */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-2">{pet.name}</h1>
                <div className="flex items-center gap-4 text-gray-600 mb-4">
                  <span className="flex items-center gap-1.5 text-sm">
                    <FaCat className="text-orange-600" />
                    {pet.breed}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm">
                    <FiMapPin className="text-orange-600" />
                    {pet.city}
                  </span>
                </div>
                <div className="text-3xl font-bold text-orange-600 mb-6">
                  PKR {pet.price?.toLocaleString() || 'N/A'}
                </div>
              </div>

              {/* Contact / Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`tel:${pet.contactNumber}`}
                  className="px-4 py-3 rounded-xl hover:opacity-90 transition-opacity text-sm font-medium text-center block text-white shadow-sm"
                  style={{ background: "var(--gradient-hero)" }}
                >
                  <FiPhone className="inline mr-2" />
                  Call
                </a>
                <a
                  href={`https://wa.me/${pet.contactNumber}?text=${encodeURIComponent('Hi, I saw your ad, I am interested')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 rounded-xl hover:opacity-90 transition-opacity text-sm font-medium text-center block text-white shadow-sm"
                  style={{ background: "var(--gradient-hero)" }}
                >
                  <SiWhatsapp className="inline mr-2" />
                  Chat
                </a>
              </div>

              {/* Cat Attributes Card */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Cat Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <FiUser className="text-orange-600 text-lg" />
                    <div>
                      <p className="text-xs text-gray-500">Gender</p>
                      <p className="font-medium text-sm text-gray-800">{pet.gender}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FiCalendar className="text-orange-600 text-lg" />
                    <div>
                      <p className="text-xs text-gray-500">Age</p>
                      <p className="font-medium text-sm text-gray-800">{pet.age} months</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaWeight className="text-orange-600 text-lg" />
                    <div>
                      <p className="text-xs text-gray-500">Weight</p>
                      <p className="font-medium text-sm text-gray-800">{pet.weight} kg</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaRulerVertical className="text-orange-600 text-lg" />
                    <div>
                      <p className="text-xs text-gray-500">Height</p>
                      <p className="font-medium text-sm text-gray-800">{pet.height} cm</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Health & Features Card */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Health & Features</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-gray-700">
                      <FaSyringe className="text-orange-600" />
                      Vaccinated
                    </span>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      pet.vaccinated ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {pet.vaccinated ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-gray-700">
                      <FaCertificate className="text-orange-600" />
                      Registered
                    </span>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      pet.kcpRegistered ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {pet.kcpRegistered ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-gray-700">
                      <FaHeartbeat className="text-orange-600" />
                      Life Expectancy
                    </span>
                    <span className="font-medium text-gray-800">{pet.maxLife} years</span>
                  </div>
                </div>
              </div>

              {/* Suitable For Card */}
              {pet.suitableFor && (
                Array.isArray(pet.suitableFor) && pet.suitableFor.length > 0 ? (
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Suitable For</h3>
                    <div className="flex flex-wrap gap-2">
                      {pet.suitableFor.map((item: string, index: number) => (
                        <span key={index} className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-medium border border-orange-100">
                          {item.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : typeof pet.suitableFor === 'string' && pet.suitableFor.trim() !== '' ? (
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Suitable For</h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-medium border border-orange-100">
                        {pet.suitableFor}
                      </span>
                    </div>
                  </div>
                ) : null
              )}

              {/* Buy Now Checkout Button */}
              <button
                type="button"
                onClick={() => router.push(`/checkout?petId=${pet._id || resolvedParams.id}`)}
                className="w-full py-4 rounded-xl text-white font-semibold text-center shadow-md hover:opacity-95 transition-all transform active:scale-[0.99]"
                style={{ background: "var(--gradient-hero)" }}
              >
                Buy Now
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}