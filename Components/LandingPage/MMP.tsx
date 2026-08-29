"use client";

import { useState } from "react";
import Image from "next/image";

export default function WhyMMP() {
  const features = [
    {
      image: "/MMP/Healthy_Pet.png",
      title: "Healthy Pet",
      description:
        "Being pet lovers ourself, we understand the importance of a pet’s health. All our puppies are at least eight weeks old when they are sent to you. Before your bundle of joy reaches you, he is required to undergo an extensive health checkup by a licensed veterinarian.",
      paws: "/MMP/paws_01.png",
    },
    {
      image: "/MMP/Vaccinated.png",
      title: "Vaccinated & Insured Pet",
      description:
        "To make the initial experience with your furry family member smooth and trouble-free, we make sure that all our puppies are up-to-date on their vaccinations and are insured.",
      paws: "/MMP/paws_02.png",
    },
    {
      image: "/MMP/Responsible.png",
      title: "Responsible Breeders",
      description:
        "All of our puppies are raised by responsible breeders who consider their pet’s health their foremost priority. We have zero tolerance for puppy mills and all our breeders are pet lovers just like us who are looking for the best homes for their fur babies.",
      paws: "/MMP/paws_03.png",
    },
    {
      image: "/MMP/Process.png",
      title: "Easy and Hassle-free Process",
      description:
        "With Pets Corner, your journey with a pet starts with no difficulties. You have access to adorable pets looking for furever homes nationwide. You can receive guidance regarding any pet-related aspect in the comfort of your home. We make sure that a healthy and happy pet is delivered to you and have a secured payment process.",
      paws: "/MMP/paws_04.png",
    },
    {
      image: "/MMP/experts.png",
      title: "Expert Pet Guidance",
      description:
        "Our pet experts will guide you throughout your journey as a pet parent and will always be at your beck and call there to help you.",
      paws: "/MMP/paws_05.png",
    },
    {
      image: "/MMP/familya.png",
      title: "Happy Pet Parenting",
      description:
        "We don’t stop at providing you with a furry family member and guidance related to it. We are also connected with service providers such as veterinarians, trainers, groomers, and hostels. We always make sure to provide you with the best of best.",
      paws: "/MMP/paws_06.png",
    },
  ];

  // Track which card is expanded
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <section
      className="py-12 sm:py-16 px-4 sm:px-8 lg:px-16 xl:px-24 w-full"
      style={{ background: "var(--gradient-hero)" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
            Why{" "}
            <span style={{ color: "var(--color-primary)" }}>Pets Corner?</span>
          </h2>
          <p className="text-white/90 font-medium text-xs sm:text-sm max-w-lg mx-auto">
            Looking for a furry companion? Know why Pets Corner is the perfect
            option for you.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((item, idx) => {
            const isExpanded = expandedIndex === idx;

            return (
              <div
                key={idx}
                className="relative bg-white rounded-2xl shadow-md border border-gray-100 py-6 sm:py-8 px-5 sm:px-6 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                {/* Decorative Paw */}
                <div className="absolute top-0 -right-6 sm:-right-8 z-10 opacity-70 w-24 h-24 sm:w-28 sm:h-28 pointer-events-none">
                  <Image
                    src={item.paws}
                    alt="paws"
                    width={110}
                    height={110}
                    className="object-contain"
                  />
                </div>

                <div>
                  {/* Icon */}
                  <div className="mb-4 sm:mb-5">
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={56}
                      height={56}
                      className="object-contain w-12 h-12 sm:w-14 sm:h-14"
                    />
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-lg sm:text-xl text-gray-900 mb-2">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p
                    className={`text-xs sm:text-sm text-gray-600 leading-relaxed transition-all duration-300 ${
                      isExpanded ? "line-clamp-none" : "line-clamp-3"
                    }`}
                    style={
                      !isExpanded
                        ? {
                            display: "-webkit-box",
                            WebkitLineClamp: "3",
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }
                        : {}
                    }
                  >
                    {item.description}
                  </p>
                </div>

                {/* Toggle Button */}
                <div className="mt-3 pt-1">
                  <button
                    onClick={() =>
                      setExpandedIndex(isExpanded ? null : idx)
                    }
                    className="text-[#1E7E8F] text-xs sm:text-sm font-semibold hover:underline inline-block cursor-pointer"
                  >
                    {isExpanded ? "View Less" : "View More"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}