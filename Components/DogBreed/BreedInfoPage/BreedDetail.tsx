"use client";

import Image from "next/image";
import {
  FaUserFriends,
  FaChild,
  FaShieldAlt,
  FaUserTie,
  FaHome,
  FaUserPlus,
} from "react-icons/fa";

export default function BreedDetails() {
  return (
    <section className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
      {/* === Health Section === */}
      <div className="text-white p-5 rounded-t-xl" style={{background: "var(--gradient-hero)"}}>
        <h4 className="text-lg font-bold">Health</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4  ">
          <div>
            <p className="font-medium py-3">Hypothyroidism</p>
            <p className="font-semibold text-xs">High</p>
          </div>
          <div>
            <p className="font-medium py-3">Hip Dysplasia</p>
            <p className="font-semibold text-xs">Medium</p>
          </div>
          <div>
            <p className="font-medium py-3">Démodé tic Mange</p>
            <p className="font-semibold text-xs">Medium</p>
          </div>
          <div>
            <p className="font-medium py-3">Cataracts</p>
            <p className="font-semibold text-xs">High</p>
          </div>
        </div>
      </div>

      {/* === Other Info === */}
      <div className="p-5 border-b">
        <h3 className="font-semibold text-[#018F98] mb-2">Other Info</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-2 text-black text-xs">
          <p>
            <span className="font-bold block">Hypoallergenic:</span> Yes
          </p>
          <p>
            <span className="font-bold block">Litter Size:</span> 6–8
          </p>
          <p>
            <span className="font-bold block">Weight Gain Potential:</span> Low
          </p>
          <p>
            <span className="font-bold block">Drooling Tendency:</span> Low
          </p>
        </div>
      </div>

      {/* === Characteristics === */}
      <div className="p-5 border-b">
        <h3 className="font-semibold text-[#018F98] mb-2">Characteristics</h3>
        <p className="text-sm text-gray-700 mb-4">
          <span className="font-bold">
            Alert, Friendly, Intelligent, Loyal, Playful, Quiet
          </span>
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-y-2 text-sm text-gray-700">
          <p>
            <span className="font-bold block">Sensitivity Level:</span> High
          </p>
          <p>
            <span className="font-bold block">Barking:</span> Occasional
          </p>
          <p>
            <span className="font-bold block">Mouthiness:</span> Considerable
          </p>
          <p>
            <span className="font-bold block">Hunting Drive:</span> Medium
          </p>
          <p>
            <span className="font-bold block">Impulse to Wander:</span> Low
          </p>
        </div>
      </div>

      {/* === Breed Image === */}
      <div className="relative w-full h-64 md:h-80">
        <Image
          src="/listing-hero-ban.png" // 🔁 replace with your real image path
          alt="Puppies"
          fill
          className="object-contain"
        />
      </div>

      {/* === Suitable For === */}
      <div className="p-5 flex flex-wrap justify-between items-center text-center">
        <div className="flex flex-col items-center gap-1 w-1/3 sm:w-auto mb-3">
          <FaUserFriends className="text-[#018F98] text-2xl" />
          <p className="text-sm font-medium text-gray-700">Couples</p>
        </div>

        <div className="flex flex-col items-center gap-1 w-1/3 sm:w-auto mb-3">
          <FaUserPlus className="text-[#018F98] text-2xl" />
          <p className="text-sm font-medium text-gray-700">New Owners</p>
        </div>

        <div className="flex flex-col items-center gap-1 w-1/3 sm:w-auto mb-3">
          <FaUserTie className="text-[#018F98] text-2xl" />
          <p className="text-sm font-medium text-gray-700">Citizens</p>
        </div>

        <div className="flex flex-col items-center gap-1 w-1/3 sm:w-auto mb-3">
          <FaChild className="text-[#018F98] text-2xl" />
          <p className="text-sm font-medium text-gray-700">Kids</p>
        </div>

        <div className="flex flex-col items-center gap-1 w-1/3 sm:w-auto mb-3">
          <FaHome className="text-[#018F98] text-2xl" />
          <p className="text-sm font-medium text-gray-700">Family</p>
        </div>

        <div className="flex flex-col items-center gap-1 w-1/3 sm:w-auto mb-3">
          <FaShieldAlt className="text-[#018F98] text-2xl" />
          <p className="text-sm font-medium text-gray-700">Security</p>
        </div>
      </div>
    </section>
  );
}
