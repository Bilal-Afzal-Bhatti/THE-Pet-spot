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
import { useRouter } from "next/navigation";

// 🐱 Sample Cat Breed Data (replace with your real data later)
const catBreeds = [
  {
    id: 1,
    name: "Persian",
    image:
      "https://www.pexels.com/photo/white-persian-cat-lying-on-floor-1056251/",
    maxWeight: "7 kg",
    maxHeight: "25 cm",
    maxLife: "15 years",
    suitableFor: ["Family", "Kids", "New Owner"],
  },
  {
    id: 2,
    name: "Maine Coon",
    image:
      "https://www.istockphoto.com/photo/maine-coon-cat-sitting-on-white-background-gm1138453450-303798164",
    maxWeight: "11 kg",
    maxHeight: "40 cm",
    maxLife: "13 years",
    suitableFor: ["Family", "Couple"],
  },
  {
    id: 3,
    name: "Bengal",
    image: "https://unsplash.com/photos/bengal-cat-on-window-sill-4qf1vZf8z5o",
    maxWeight: "8 kg",
    maxHeight: "35 cm",
    maxLife: "16 years",
    suitableFor: ["Couple", "Citizen", "Security"],
  },
  {
    id: 4,
    name: "Siamese",
    image:
      "https://www.pexels.com/photo/siamese-cat-sitting-on-white-surface-326875/",
    maxWeight: "6 kg",
    maxHeight: "30 cm",
    maxLife: "14 years",
    suitableFor: ["Family", "New Owner", "Kids"],
  },
  {
    id: 5,
    name: "Ragdoll",
    image:
      "https://www.gettyimages.com/detail/photo/ragdoll-cat-royalty-free-image/1280729986",
    maxWeight: "9 kg",
    maxHeight: "38 cm",
    maxLife: "17 years",
    suitableFor: ["Couple", "Family"],
  },
  {
    id: 6,
    name: "Sphynx",
    image:
      "https://unsplash.com/photos/gray-sphynx-cat-on-white-textile-4qf1vZf8z5o",
    maxWeight: "6 kg",
    maxHeight: "25 cm",
    maxLife: "14 years",
    suitableFor: ["Citizen", "Couple"],
  },
];

export default function CatBreedListing() {
  const [selectedPetType, setSelectedPetType] = useState<string>("Cat");

  const [selectedBreed, setSelectedBreed] = useState<string>("");
  const router = useRouter();

  const handleBreedClick = (breed: string) => {
    setSelectedBreed(breed);
    const slug = breed.toLowerCase().replace(/ /g, "-");
    router.push(`/cat-breed/${slug}`);
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
          <div className="mb-8">
            <h3 className="text-cyan-500 font-semibold text-lg mb-4">
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
          <h3 className="text-cyan-500 font-semibold text-lg mb-4">
            Choose Your Breed
          </h3>

          {/* Search bar */}
          <input
            type="text"
            value={selectedBreed}
            onChange={(e) => setSelectedBreed(e.target.value)}
            placeholder="Search breed..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />

          {/* Filtered List */}
          <div className="space-y-1 max-h-96 overflow-y-auto border-l-4 border-yellow-400 pl-4">
            {catBreeds
              .filter((breed) =>
                breed.name.toLowerCase().includes(selectedBreed.toLowerCase())
              )
              .map((breed) => (
                <div
                  key={breed.id}
                  onClick={() => handleBreedClick(breed.name)}
                  className={`px-3 py-2 cursor-pointer rounded ${
                    selectedBreed === breed.name
                      ? "bg-gray-100 font-medium"
                      : "hover:bg-gray-50"
                  }`}
                >
                  {breed.name}
                </div>
              ))}
          </div>
        </div>

        {/* Breed Cards */}
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {catBreeds.map((breed) => (
              <div
                key={breed.id}
                onClick={() => handleBreedClick(breed.name)}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
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
                  <h3 className="text-cyan-600 font-semibold text-lg mb-4">
                    {breed.name}
                  </h3>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
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

                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 bg-cyan-500 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                        <FaClock className="text-white text-xs" />
                      </div>
                      <div className="text-xs">
                        <div className="text-cyan-600 font-medium">
                          Max-Life
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
