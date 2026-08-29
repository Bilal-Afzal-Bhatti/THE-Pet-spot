"use client";
import { useRouter } from "next/navigation";
import { FaHeart, FaPaw, FaArrowRight } from "react-icons/fa";
import Image from "next/image";

export default function AvailablePets() {
  const images = [
    { src: "/pets/image1.jpg", name: "Buddy", breed: "Golden Retriever", age: "3 months" },
    { src: "/pets/image2.webp", name: "Milo", breed: "Labrador", age: "2 months" },
    { src: "/pets/image3.avif", name: "Luna", breed: "Persian Cat", age: "4 months" },
    { src: "/pets/image4.webp", name: "Charlie", breed: "Beagle", age: "3 months" },
    { src: "/pets/image5.jpg", name: "Bella", breed: "Poodle", age: "2 months" },
  ];
  const router = useRouter();

  return (
    <section className="py-20 px-16 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-[#55c5d0]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#a6ce39]/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <FaPaw className="text-[#55c5d0] text-3xl animate-bounce" />
            <span className="text-sm font-bold text-[#55c5d0] tracking-widest uppercase">Featured Pets</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Meet Your New
            <span className="block bg-[var(--color-primary)] bg-clip-text text-transparent">
              Best Friend
            </span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover adorable pets waiting for their forever homes. Each one is special and ready to bring joy to your life.
          </p>
        </div>

        {/* Pet Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
          {images.map((pet, i) => (
            <div
              key={i}
              className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer"
              onClick={() => router.push("/dogs/for-sale")}
            >
              {/* Image Container */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={pet.src}
                  alt={pet.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="text-sm font-medium">{pet.breed}</div>
                    <div className="text-xs opacity-90">{pet.age} old</div>
                  </div>
                </div>

                {/* Heart Icon */}
                <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-red-50">
                  <FaHeart className="text-red-500" />
                </button>

                {/* Featured Badge */}
                <div className="absolute top-4 left-4 bg-[var(--bg-dark-accent)] text-white text-xs font-bold px-3 py-1 rounded-full">
                  Featured
                </div>
              </div>

              {/* Card Content */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{pet.name}</h3>
                  <FaPaw className="text-[#55c5d0] group-hover:text-[#a6ce39] transition-colors" />
                </div>
                <p className="text-sm text-gray-600 mb-3">{pet.breed}</p>
                
                {/* Action Button */}
                <button className="w-full bg-[var(--bg-dark-accent)] text-white font-semibold py-2 rounded-xl hover:shadow-lg transition-all duration-300 transform group-hover:scale-105">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <button
            onClick={() => router.push("/dogs/for-sale")}
            className="group inline-flex items-center gap-3 bg-[var(--color-primary)] text-white font-bold px-10 py-5 rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            <span className="text-lg text-black" >Explore All Pets</span>
            <FaArrowRight className="group-hover:translate-x-2 transition-transform duration-300 text-black" />
          </button>
        </div>

        {/* Additional Info Cards */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          {[
            {
              icon: "🏥",
              title: "Health Certified",
              desc: "All pets are vet-checked and vaccinated"
            },
            {
              icon: "🛡️",
              title: "Verified Breeders",
              desc: "Only trusted and certified breeders"
            },
            {
              icon: "💝",
              title: "Lifetime Support",
              desc: "We're here for you and your pet always"
            }
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center"
            >
              <div className="text-4xl mb-3">{item.icon}</div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h4>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div> */}
      </div>
    </section>
  );
}
