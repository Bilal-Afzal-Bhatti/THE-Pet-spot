"use client";

import Image from "next/image";

export default function ServicesSection() {
  const services = [
    {
      title: "Dog Grooming",
      image: "/services/dog-grooming_2021.webp",
    },
    {
      title: "Dog Hostel",
      image: "/services/dog_hostel_2021.webp",
    },
    {
      title: "Dog Training",
      image: "/services/dog-training-2021.webp",
    },
    {
      title: "Pet Adoption",
      image: "/services/pet-adoption-2021.webp",
    },
    {
      title: "Mating Services",
      image: "/services/mating-services-2021.webp",
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-white px-4 sm:px-8 lg:px-16 xl:px-24 w-full">
      {/* Section Header */}
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-center mb-8 sm:mb-12">
        Exciting Services{" "}
        <span style={{ color: "var(--color-primary)" }} className="font-bold">
          For Your Pets
        </span>
      </h2>

      {/* Grid Container */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 auto-rows-[14rem] sm:auto-rows-[16rem]">
          {services.map((service, index) => (
            <div
              key={index}
              className={`relative group rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 ${
                index === 1
                  ? "lg:col-span-2"
                  : index === 3 || index === 4
                  ? "lg:col-span-2"
                  : "col-span-1"
              }`}
            >
              {/* Image */}
              <div className="relative w-full h-full">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
              </div>

              {/* Gradient Overlay & Content */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/90 group-hover:via-black/50 transition-all duration-300 flex flex-col justify-end items-center text-white text-center p-4 sm:p-6">
                <h3 className="text-xl sm:text-2xl font-semibold mb-3 transform group-hover:-translate-y-1 transition-transform duration-300">
                  {service.title}
                </h3>

                {/* Book Now Button */}
                {index !== 4 && (
                  <button className="border border-white/80 hover:border-white bg-white/10 hover:bg-white hover:text-black px-5 py-2 rounded-md text-xs sm:text-sm font-bold tracking-wide transition-all duration-300 cursor-pointer backdrop-blur-xs">
                    Book Now
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}