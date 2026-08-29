"use client";
import Image from "next/image";
import { FaPaw } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";

export default function PopularDogSearches() {
  const searches = [
    "Where to buy a healthy puppy in India",
    "Best place to buy dogs in India",
    "Dogs for sale online with price",
    "Buy dog with KCI papers India",
    "Best dogs to buy for apartments India",
    "Easy dogs for beginners in India",
    "Buy pets online from Indian puppy sellers",
  ];

  return (
    <section className="bg-[#FFF6F0] py-20 px-6 lg:px-44">
      <div className="max-w-6xl mx-auto flex flex-col gap-14">

        {/* TOP CARD */}
     

        {/* MAIN SECTION */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16">
          
          {/* LEFT IMAGES */}
          <div className="relative">
            <div className="absolute -inset-3 border-[3px] border-[#FBB885] rounded-2xl"></div>

            <div className="relative bg-white rounded-2xl overflow-hidden p-2">
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
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">
              Popular Dog Searches We Serve
            </h2>
            <ul className="space-y-4">
              {searches.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <FaPaw className="text-[#FBB885] mt-1 flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
