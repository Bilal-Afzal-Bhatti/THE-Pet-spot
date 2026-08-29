"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaSearch, FaPaw, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { authStore } from "@/Store/authStore";

export default function HeroSection() {
  const router = useRouter();
  const [selectedPet, setSelectedPet] = useState("");
  const store = authStore() as any;
  const { authUser } = store;

  // Carousel state with smooth transitions
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const petImages = [
    "/pets/image1.jpg",
    "/pets/image2.webp",
    "/pets/image3.avif",
    "/pets/image4.webp",
    "/pets/image5.jpg"
  ];

  // Auto-play carousel with smooth transitions
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) =>
          prevIndex === petImages.length - 1 ? 0 : prevIndex + 1
        );
        setIsTransitioning(false);
      }, 300);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [petImages.length]);

  const nextImage = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === petImages.length - 1 ? 0 : prevIndex + 1
      );
      setIsTransitioning(false);
    }, 300);
  };

  const prevImage = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? petImages.length - 1 : prevIndex - 1
      );
      setIsTransitioning(false);
    }, 300);
  };

  const goToImage = (index: number) => {
    if (isTransitioning || index === currentImageIndex) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentImageIndex(index);
      setIsTransitioning(false);
    }, 300);
  };

  const handleAddPetClick = () => {
    if (authUser) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  };

  const handleSearch = () => {
    if (
      !selectedPet ||
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
    <>
      {/* Hero Section with Modern Design */}
      <section className="relative min-h-[85vh] w-full overflow-hidden px-16" style={{ background: 'var(--gradient-hero)' }}>
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-700"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 pt-20 pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-white space-y-8 mt-10">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <FaPaw className="text-4xl text-white animate-bounce" />
                  <span className="text-sm font-semibold tracking-widest uppercase bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                    Welcome to Pets Corner
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                  Find Your
                  <span className="block bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
                    Perfect Companion
                  </span>
                </h1>
                <p className="text-xl md:text-xl text-white/90 font-light leading-relaxed">
                  Connecting loving families with adorable pets. Your journey to unconditional love starts here.
                </p>
              </div>

              {/* Search Box - Modern Card Style */}
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6 space-y-4">
                <div className="flex items-center gap-2 text-white mb-2">
                  <FaSearch className="text-[var(--color-primary)]" />
                  <h3 className="font-semibold text-lg">Search for Your Pet</h3>
                </div>
                
                <div className="flex w-full space-x-4">
                  <select
                    value={selectedPet}
                    onChange={(e) => setSelectedPet(e.target.value)}
                    className="w-2/3 p-4 border-2 border-white/30 rounded-xl outline-none font-medium text-gray-900 bg-white/90 backdrop-blur-sm hover:border-[var(--color-primary)] focus:border-[var(--color-primary)] focus:bg-white transition-all cursor-pointer"
                  >
                    <option>Select Pet Type</option>
                    <option>Dogs</option>
                    <option>Cats</option>
                    <option>Small Pets</option>
                  </select>

                  <button
                    onClick={handleSearch}
                    className="w-1/3 text-black font-bold py-4 rounded-xl hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2"
                    style={{ background: 'var(--color-primary)' }}
                  >
                    <FaSearch />
                    Search Pets
                  </button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Happy Families", value: "10K+" },
                  { label: "Pets Listed", value: "5K+" },
                  { label: "Breeders", value: "500+" }
                ].map((stat, i) => (
                  <div key={i} className="bg-white/20 backdrop-blur-md rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-white/80">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Smooth Sliding Carousel */}
            <div className="relative hidden lg:block">
              <div className="relative w-full h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                {/* Sliding Images Container */}
                <div
                  className="flex h-full transition-transform duration-700 ease-out"
                  style={{
                    transform: `translateX(-${currentImageIndex * 100}%)`,
                  }}
                >
                  {petImages.map((image, index) => (
                    <div key={index} className="relative w-full h-full flex-shrink-0">
                      <Image
                        src={image}
                        alt={`Pet ${index + 1}`}
                        fill
                        className="object-cover transition-all duration-1000 ease-out"
                        style={{
                          transform: isTransitioning ? 'scale(1.05)' : 'scale(1)',
                        }}
                        priority={index === 0}
                      />

                      {/* Dynamic Gradient Overlay */}
                      <div
                        className="absolute inset-0 transition-all duration-1000 ease-out"
                        style={{
                          background: `linear-gradient(to top, rgba(0,0,0,${0.6 + (index * 0.1)}) 0%, transparent 60%)`,
                        }}
                      ></div>

                    </div>
                  ))}
                </div>

                {/* Enhanced Navigation Arrows */}
                <button
                  onClick={prevImage}
                  disabled={isTransitioning}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  <FaChevronLeft className="text-xl" />
                </button>

                <button
                  onClick={nextImage}
                  disabled={isTransitioning}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  <FaChevronRight className="text-xl" />
                </button>

                {/* Enhanced Image Indicators */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
                  {petImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToImage(index)}
                      disabled={isTransitioning}
                      className={`relative transition-all duration-500 ${
                        index === currentImageIndex
                          ? 'w-8 h-3 bg-white shadow-lg'
                          : 'w-3 h-3 bg-white/50 hover:bg-white/75'
                      } rounded-full disabled:cursor-not-allowed`}
                    >
                      {index === currentImageIndex && (
                        <div className="absolute inset-0 bg-white rounded-full animate-pulse"></div>
                      )}
                    </button>
                  ))}
                </div>

                {/* Progress Bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
                  <div
                    className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] transition-all duration-700 ease-out rounded-r-full"
                    style={{
                      width: `${((currentImageIndex + 1) / petImages.length) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
