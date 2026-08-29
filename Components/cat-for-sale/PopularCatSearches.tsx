"use client";
import Image from "next/image";
import { FaBone } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";

export default function PopularCatSearches() {
  const searches = [
    "Where to buy a healthy puppy in India",
    "Cats for sale near me with price",
    "Buy Persian cat with FCI papers",
    "Low-shedding cats for families in India",
    "Hypoallergenic cat breeds India",
    "Best apartment cats India",
    "Easy cats for first-time pet parents",
    "Buy kittens online from responsible Indian breeders",
  ];

  return (
    <section className="bg-[#FFF6F0] py-20 px-6 lg:px-44">
      <div className="max-w-6xl mx-auto flex flex-col gap-14">
        {/* TOP CARD */}

        {/* MAIN SECTION */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-24">
          {/* LEFT IMAGES */}
          <div className="relative">
            <div className="absolute -inset-3 border-[3px] border-[#FBB885] rounded-2xl"></div>

            <div className="relative  rounded-2xl overflow-hidden">
              {/* Background Image */}
              <div className="absolute inset-0 z-0">
                <Image
                  src="/bgsearches.png"
                  alt="Background"
                  fill
                  className="object-cover rounded-2xl opacity-70"
                />
              </div>

              {/* Foreground Image */}
              <div className="relative z-10">
                <Image
                  src="/searches.jpg"
                  alt="Puppy in basket"
                  width={380}
                  height={380}
                  className="rounded-2xl object-cover"
                />
              </div>
            </div>
          </div>

          {/* RIGHT TEXT */}
          <div className="max-w-lg">
            <h2 className="text-3xl font-medium text-black mb-6">
              Popular Cat Searches We Serve
            </h2>
            <ul className="space-y-4">
              {searches.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <FaBone className="text-[#FBB885] mt-1 flex-shrink-0" />
                  <span className="text-black">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
