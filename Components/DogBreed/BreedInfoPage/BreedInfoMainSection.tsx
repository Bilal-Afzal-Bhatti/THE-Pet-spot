"use client";
import Image from "next/image";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useState } from "react";
import BreedInfoSidebar from "./BreedInfoSidebar";
import BreedInfoNotFound from "./BreedInfoNotFound";
import BreedDetails from "./BreedDetail";

export default function BreedInfoMainSection() {
  const [index, setIndex] = useState(0);

  const IMAGES = [
    "https://images.unsplash.com/photo-1574158622682-e40e69881006",
    "https://images.unsplash.com/photo-1518791841217-8f162f1e1131",
    "https://images.unsplash.com/photo-1601758174888-3729b23d23e3",
  ];

  const nextSlide = () => setIndex((prev) => (prev + 1) % IMAGES.length);
  const prevSlide = () =>
    setIndex((prev) => (prev - 1 + IMAGES.length) % IMAGES.length);

  return (
    <section className="max-w-6xl mx-auto py-10 flex flex-col lg:flex-row gap-10 px-6">
      {/* LEFT: Main Blog Area */}
      <div className="w-full lg:w-2/3">
        {/* Featured blog slider */}
        <div className="relative mb-8">
          <div className="relative w-full h-[350px] overflow-hidden rounded-md shadow">
            <button
              onClick={prevSlide}
              aria-label="Previous"
              className="absolute left-2 top-1/2 z-10 bg-gray-200 hover:bg-gray-300 text-gray-700 p-3 rounded-md"
            >
              <FaArrowLeft />
            </button>

            <img
              src={IMAGES[index]}
              alt="Featured"
              className="w-full h-full object-cover transition-all duration-500 ease-in-out"
            />

            <button
              onClick={nextSlide}
              aria-label="Next"
              className="absolute right-2 top-1/2 z-10 bg-gray-200 hover:bg-gray-300 text-gray-700 p-3 rounded-md"
            >
              <FaArrowRight />
            </button>
          </div>

          {/* Overlay text */}
          <div className="absolute bottom-4 left-4 text-white">
            <span className="bg-yellow-500 text-xs px-2 py-1 rounded">
              Cat Care
            </span>
            <h2 className="text-xl font-semibold mt-2">
              Winter Food Guide For Cats
            </h2>
            <p className="text-sm">By Debopriya Ghosh | October 2025</p>
          </div>
        </div>

        {/* === BREED DATA SECTION === */}
        <div className="text-gray-800 leading-relaxed space-y-2 text-sm">
          <h3 className="text-teal-600 font-semibold text-sm">Overview</h3>

          <p>
            <strong>High Maintenance:</strong> This breed needs to be groomed
            regularly to keep them in good shape and need professional groomers
            for trimming or stripping services.
          </p>
          <p>
            <strong>Moderate shedding:</strong> If you have a dog is prepared
            for them to shed. With long and silky coat brushing them regularly
            will help control this problem.
          </p>
          <p>
            <strong>Difficult to train:</strong> It can be challenging to train
            this breed due to its independent nature. House training this breed
            can turn out to be difficult although if you are ready to work hard
            nothing is impossible.
          </p>
          <p>
            <strong>Personality:</strong> This breed is typically a one-family
            breed and is not very interactive to newcomers. They are very
            sensitive and have low pain tolerance thus a minor wound will be
            more bothering to this breed as compared to other breeds and will
            not respond to rough handling, so be gentle.
          </p>
          <p>
            <strong>Good for new owners:</strong> This breed is good for those
            becoming pet parents for the first time.
          </p>
          <p>
            <strong>Good with kids:</strong> This breed is suitable for kids and
            enjoys playing with them however due to their sensitive nature it is
            important for kids to understand the sensitivity of this breed.
          </p>

          <h3 className="text-teal-600 font-semibold text-sm">Breed Info</h3>

          <div>
            <p className="font-semibold">Common Nicknames</p>
            <p>
              Baluchi Hound, Tazi, Tazhi Spay, Da Kochyano Spay, Sage Balochi,
              Ogar Afghan, Eastern Greyhound and Persian Greyhound
            </p>
          </div>

          <div>
            <p className="font-semibold">Temperament</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {[
                "Alert",
                "Friendly",
                "Intelligent",
                "Loyal",
                "Playful",
                "Quiet",
              ].map((trait) => (
                <span
                  key={trait}
                  className="border border-teal-500 text-black text-xs px-3 py-1 font-semibold rounded-full"
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-5 gap-4 pt-4 text-xs">
            <div>
              <p className="font-bold">Trainability</p>
              <p>Moderately Easy</p>
            </div>
            <div>
              <p className="font-bold">Shedding</p>
              <p>Constant</p>
            </div>
            <div>
              <p className="font-bold">Grooming</p>
              <p>High Maintenance</p>
            </div>
            <div>
              <p className="font-bold">Breed Type</p>
              <p>Constant</p>
            </div>
            <div>
              <p className="font-bold">Size</p>
              <p>Large</p>
            </div>
          </div>
        </div>

        <div className="block w-full text-white text-xl font-semibold px-6 py-2 rounded  my-5" style={{background: "var(--gradient-hero)"}}>
          Get in touch with our Pet Experts
        </div>
        <BreedInfoNotFound />
        <BreedDetails />
      </div>

      {/* RIGHT: Sidebar */}
      <div className="w-full lg:w-1/3">
        <div className="lg:sticky lg:top-24">
          <BreedInfoSidebar />
        </div>
      </div>
    </section>
  );
}
