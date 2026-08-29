"use client";
import React, { useState } from "react";
import {
  FaWeight,
  FaRulerVertical,
  FaClock,
  FaUsers,
  FaBaby,
  FaChild,
  FaHome,
  FaUserTie,
  FaShieldAlt,
} from "react-icons/fa";
import { breeds } from "@/Data/dogsData";
import { useRouter } from "next/navigation";

const dogBreeds = [
  "Afghan Hound",
  "Akita",
  "Alaskan Malamute",
  "Basset Hound",
  "Beagle",
  "Bichon Frise",
  "Border Collie",
  "Boxer",
  "Bull Terrier",
];

export default function BreedListing() {
  const [selectedPetType, setSelectedPetType] = useState<string>("Dog");
  const [selectedBreed, setSelectedBreed] = useState<string>("");
  const router = useRouter();

  const handleBreedClick = (breed: string) => {
    setSelectedBreed(breed);
    // Slugify breed name for URL
    const slug = breed.toLowerCase().replace(/ /g, "-");
    router.push(`/dog-breed/${slug}`);
  };
  const handleCardClick = (breed: string) => {
    const slug = breed.toLowerCase().replace(/ /g, "-");
    router.push(`/dog-breed/${slug}`);
  };
  const getSuitableIcon = (type: string) => {
    switch (type) {
      case "Couple":
        return <FaUsers className="text-gray-400" />;
      case "New Owner":
        return <FaBaby className="text-gray-400" />;
      case "Kids":
        return <FaChild className="text-orange-400" />;
      case "Family":
        return <FaHome className="text-gray-400" />;
      case "Citizen":
        return <FaUserTie className="text-gray-700" />;
      case "Security":
        return <FaShieldAlt className="text-green-500" />;
      default:
        return null;
    }
  };
  const handlePetTypeClick = (pet: string) => {
    setSelectedPetType(pet);

    // Navigate based on pet type
    switch (pet) {
      case "Dog":
        router.push("/dog-breed");
        break;
      case "Cat":
        router.push("/cat-breed");
        break;
      case "Small Pet":
        router.push("/small-pet-breed");
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto flex gap-6">
        {/* Sidebar */}
        <div className="w-80 bg-white rounded-lg shadow-sm p-6 h-fit sticky top-6">
          {/* Choose Pet Type */}
          <div className="mb-8">
            <h3 className="text-[var(--color-primary)] font-semibold text-lg mb-4">
              Choose Pet Type
            </h3>
            <div className="space-y-2">
              {["Dog", "Cat", "Small Pet"].map((pet) => (
                <div
                  key={pet}
                  onClick={() => handlePetTypeClick(pet)}
                  className={`px-4 py-2 cursor-pointer rounded ${
                    selectedPetType === pet ? "bg-gray-100" : "hover:bg-gray-50"
                  }`}
                >
                  {pet}
                </div>
              ))}
            </div>
          </div>

          {/* Choose Your Breed */}
          <div>
            <h3 className="text-[var(--color-primary)] font-semibold text-lg mb-4">
              Choose Your Breed
            </h3>
            <input
              type="text"
              value={selectedBreed}
              onChange={(e) => setSelectedBreed(e.target.value)}
              placeholder="Search breed..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <div className="space-y-1 max-h-96 overflow-y-auto border-l-4 border-yellow-400 pl-4">
              {dogBreeds
                .filter((breed) =>
                  breed.toLowerCase().includes(selectedBreed.toLowerCase())
                )
                .map((breed) => (
                  <div
                    key={breed}
                    onClick={() => handleBreedClick(breed)}
                    className={`px-3 py-2 cursor-pointer rounded ${
                      selectedBreed === breed
                        ? "bg-gray-100 font-medium"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    {breed}
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Main Content - Breed Cards */}
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {breeds.map((breed) => (
              <div
                key={breed.id}
                onClick={() => handleCardClick(breed.name)}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Image */}
                <div className="relative h-56 bg-gradient-to-br from-pink-100 to-blue-100">
                  <img
                    src={breed.image}
                    alt={breed.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* Breed Name */}
                  <h3 className="text-cyan-600 font-semibold text-lg mb-4">
                    {breed.name}
                  </h3>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {/* Weight */}
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 bg-cyan-500 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                        <FaWeight className="text-white text-xs" />
                      </div>
                      <div className="text-xs">
                        <div className="text-cyan-600 font-medium">
                          Max-Weight
                        </div>
                        <div className="text-gray-700">{breed.maxWeight}</div>
                      </div>
                    </div>

                    {/* Height */}
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 bg-cyan-500 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                        <FaRulerVertical className="text-white text-xs" />
                      </div>
                      <div className="text-xs">
                        <div className="text-cyan-600 font-medium">
                          Max-Height
                        </div>
                        <div className="text-gray-700">{breed.maxHeight}</div>
                      </div>
                    </div>

                    {/* Life */}
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 bg-cyan-500 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                        <FaClock className="text-white text-xs" />
                      </div>
                      <div className="text-xs">
                        <div className="text-cyan-600 font-medium">
                          Max-life
                        </div>
                        <div className="text-gray-700">{breed.maxLife}</div>
                      </div>
                    </div>
                  </div>

                  {/* Suitable For */}
                  <div>
                    <h4 className="text-cyan-600 font-medium text-sm mb-3">
                      Suitable For
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {breed.suitableFor.map((type) => (
                        <div
                          key={type}
                          className="flex flex-col items-center gap-1"
                        >
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                            {getSuitableIcon(type)}
                          </div>
                          <span className="text-xs text-gray-600">{type}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
