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
    <section className="py-16 bg-white px-44">
      <h2 className="text-2xl md:text-3xl font-semibold text-center mb-10">
        Exciting Services
        <span style={{color: 'var(--color-primary)'}} className="font-bold"> For Your Pets</span>
      </h2>

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[16rem]">
          {services.map((service, index) => (
            <div
              key={index}
              className={`relative group rounded-lg overflow-hidden shadow-md hover:shadow-xl transition
                ${
                  index === 1
                    ? "lg:col-span-2 lg:row-span-1" // 2nd image spans 2 columns
                    : ""
                }
                ${
                  index === 3 || index === 4
                    ? "lg:col-span-2 lg:row-start-2" // 4th and 5th image span 2 columns
                    : ""
                }
              `}
            >
              <Image
                src={service.image}
                alt={service.title}
                width={600}
                height={400}
                className="w-full h-full object-cover"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 group-hover:to-black/90 transition flex flex-col justify-end items-center text-white text-center p-4">
                <h3 className="text-2xl font-semibold mb-3">{service.title}</h3>

                {/* Hide button for last item */}
                {index !== 4 && (
                  <button className="border border-white px-4 py-2 rounded text-xs font-bold  transition">
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
