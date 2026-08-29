"use client";
import { useState } from "react";
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
    <section className=" py-16 px-44">
      {/* Section Title */}
      <h2 className="text-3xl md:text-4xl font-semibold text-center mb-10">
        Meet Our <span className="font-bold" style={{color: 'var(--color-primary)'}}>Happy Customers</span>
      </h2>

      {/* Carousel Container */}
      <div className="relative flex flex-col md:flex-row items-center justify-center gap-8">
        {/* Left Button */}

        {/* Image + Text */}
        <div className="flex flex-col md:flex-row items-start gap-8">
          <div className="relative w-[90%] md:w-[500px] h-[350px] overflow-hidden rounded-md shadow">
            <button
              onClick={prevSlide}
              aria-label="Previous"
              className="absolute left-2 md:left-0 top-1/2 z-10 bg-gray-200 hover:bg-gray-300 text-gray-700 p-3 rounded-md"
            >
              <FaArrowLeft />
            </button>
            <img
              src={images[index]}
              alt="Happy Customer"
              className="w-full h-full object-cover transition-all duration-500 ease-in-out"
            />
            <button
              onClick={nextSlide}
              aria-label="Next"
              className="absolute right-2 md:right-0 top-1/2 z-10 bg-gray-200 hover:bg-gray-300 text-gray-700 p-3 rounded-md"
            >
              <FaArrowRight />
            </button>
          </div>

          {/* Text remains constant */}
          <div className="max-w-xl text-center md:text-left">
            <h3 className="text-2xl font-bold leading-snug mb-1 text-gray-900">
              MEGHA SINGH BUY A PUG WITH KCI REGISTERED BY MR. JAIN
            </h3>
            <p className="text-black mb-2 text-sm font-smibold">
              We believe finding a puppy shouldn't be filled with mystery or
              compromise, so we work extra hard to take care of the details so
              you can focus on what really matters: the joy of your new furry
              family member! We'll continue to be here if you need us.
            </p>
            <a href="#" className="text-sm font-medium hover:underline">
              View All Pets
            </a>
          </div>
        </div>

        {/* Right Button */}
      </div>
    </section>
  );
}
