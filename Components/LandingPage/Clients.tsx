"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

export default function HappyCustomers() {
  const [index, setIndex] = useState(0);

  // 👇 Replace these with your own images
  const images = [
    "/customers/dog1.webp",
    "/customers/dog2.webp",
    "/customers/dog4.webp",
    // "/customers/dog4.jpg",
  ];

  const nextSlide = () => setIndex((prev) => (prev + 1) % images.length);
  const prevSlide = () =>
    setIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <section className="py-12 md:py-16 px-4 sm:px-8 lg:px-16 xl:px-32 w-full">
      {/* Section Title */}
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-center mb-8 md:mb-12">
        Meet Our <span className="font-bold" style={{ color: "var(--color-primary)" }}>Happy Customers</span>
      </h2>

      {/* Carousel Container */}
      <div className="relative flex flex-col items-center justify-center max-w-6xl mx-auto">
        {/* Image + Text Wrapper */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 w-full">
          {/* Image Container with Nav Overlay */}
          <div className="relative w-full max-w-[500px] h-[260px] sm:h-80 md:h-[350px] overflow-hidden rounded-md shadow shrink-0">
            <button
              onClick={prevSlide}
              aria-label="Previous"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-gray-200/90 hover:bg-gray-300 text-gray-700 p-2.5 sm:p-3 rounded-md transition-colors cursor-pointer"
            >
              <FaArrowLeft className="w-4 h-4" />
            </button>
            <div className="relative w-full h-full">
              <Image
                src={images[index]}
                alt="Happy Customer"
                fill
                sizes="(max-width: 768px) 100vw, 500px"
                className="object-cover transition-all duration-500 ease-in-out"
                priority
              />
            </div>
            <button
              onClick={nextSlide}
              aria-label="Next"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-gray-200/90 hover:bg-gray-300 text-gray-700 p-2.5 sm:p-3 rounded-md transition-colors cursor-pointer"
            >
              <FaArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Text Content */}
          <div className="max-w-xl text-center lg:text-left flex flex-col justify-between">
            <h3 className="text-xl sm:text-2xl font-bold leading-snug mb-2 sm:mb-3 text-gray-900">
              MEGHA SINGH BUY A PUG WITH KCI REGISTERED BY MR. JAIN
            </h3>
            <p className="text-black mb-4 text-sm font-semibold leading-relaxed">
              We believe finding a puppy shouldn't be filled with mystery or
              compromise, so we work extra hard to take care of the details so
              you can focus on what really matters: the joy of your new furry
              family member! We'll continue to be here if you need us.
            </p>
            <div>
              <Link
                href="/dogs/for-sale"
                className="text-sm font-medium text-gray-900 hover:underline inline-block"
              >
                View All Pets
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}