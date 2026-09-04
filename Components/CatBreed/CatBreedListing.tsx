"use client";
import React, { useEffect } from "react";
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
import { useBreedStore, Breed } from "@/Store/BreedStore";

export default function CatBreedListing() {
  const router = useRouter();

  const {
    breeds,
    loading,
    category,
    search,
    setCategory,
    setSearch,
    fetchBreeds,
  } = useBreedStore();

  useEffect(() => {
    setCategory("cat");
    fetchBreeds();
  }, []);

  // Routes to the correct breed-detail page based on the breed's own category,
  // not hardcoded — so this component stays correct even if reused elsewhere.
 const handleBreedClick = (breed: Breed) => {
    // Fallback to lowercased name replacement if slug isn't populated yet
    const slug = breed.slug || breed.name.toLowerCase().replace(/ /g, "-");

    const categoryRouteMap: Record<string, string> = {
      dog: "dog-breed",
      cat: "cat-breed",
      bird: "small-pet-breed",
      other: "small-pet-breed",
    };

    const routeBase = categoryRouteMap[breed.category?.toLowerCase()] || "cat-breed";
    router.push(`/${routeBase}/${slug}`);
  };
  const getSuitableIcon = (type: string) => {
    switch (type?.trim()) {
      case "Couple":
      case "COUPLE":
        return <FaUsers className="text-gray-400" />;
      case "New Owner":
      case "NEW OWNER":
        return <FaBaby className="text-gray-400" />;
      case "Kids":
      case "KIDS":
        return <FaChild className="text-orange-400" />;
      case "Family":
      case "FAMILY":
        return <FaHome className="text-gray-400" />;
      case "Citizen":
      case "CITIZEN":
        return <FaUserTie className="text-gray-700" />;
      case "Security":
      case "SECURITY":
        return <FaShieldAlt className="text-green-500" />;
      case "Single":
      case "SINGLE":
        return <FaUsers className="text-blue-400" />;
      default:
        return <FaHome className="text-gray-400" />;
    }
  };

  const handlePetTypeClick = (pet: string) => {
    const formattedPet = pet.toLowerCase();
    setCategory(formattedPet);
    fetchBreeds();

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

  // suitableFor is stored as a comma-separated string in the DB
  const getSuitableArray = (suitableFor?: string) => {
    if (!suitableFor) return [];
    return suitableFor
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
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
                  className={`px-4 py-2 cursor-pointer rounded capitalize ${
                    category.toLowerCase() === pet.toLowerCase()
                      ? "bg-gray-100 font-medium"
                      : "hover:bg-gray-50"
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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search breed..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />

          {/* Filtered List from Backend */}
          <div className="space-y-1 max-h-96 overflow-y-auto border-l-4 border-yellow-400 pl-4">
            {loading ? (
              <p className="text-sm text-gray-400 py-2">Loading breeds...</p>
            ) : breeds.length === 0 ? (
              <p className="text-sm text-gray-400 py-2">No breeds found</p>
            ) : (
              breeds.map((breed) => (
                <div
                  key={breed._id}
                  onClick={() => handleBreedClick(breed)}
                  className={`px-3 py-2 cursor-pointer rounded ${
                    search === breed.name
                      ? "bg-gray-100 font-medium"
                      : "hover:bg-gray-50"
                  }`}
                >
                  {breed.name}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Breed Cards Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-500 font-medium">Loading catalog data from server...</p>
            </div>
          ) : breeds.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-md p-8 text-center">
              <p className="text-gray-500">No pet breeds available matching your filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {breeds.map((breed) => {
                const suitableList = getSuitableArray(breed.suitableFor);

                return (
                  <div
                    key={breed._id}
                    onClick={() => handleBreedClick(breed)}
                    className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                  >
                    {/* Image */}
                    <div className="relative h-56 bg-linear-to-br from-pink-100 to-blue-100">
                      <img
                        src={breed.image || "https://via.placeholder.com/400"}
                        alt={breed.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="text-cyan-600 font-semibold text-lg mb-4">
                        {breed.name}
                      </h3>

                      {/* Stats — exactly Weight / Height / Max-Life, matching the DB schema */}
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="flex items-start gap-2">
                          <div className="w-6 h-6 bg-cyan-500 rounded flex items-center justify-center shrink-0 mt-0.5">
                            <FaWeight className="text-white text-xs" />
                          </div>
                          <div className="text-xs">
                            <div className="text-cyan-600 font-medium">Weight</div>
                            <div className="text-gray-700">{breed.weight || "N/A"}</div>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <div className="w-6 h-6 bg-cyan-500 rounded flex items-center justify-center shrink-0 mt-0.5">
                            <FaRulerVertical className="text-white text-xs" />
                          </div>
                          <div className="text-xs">
                            <div className="text-cyan-600 font-medium">Height</div>
                            <div className="text-gray-700">{breed.height || "N/A"}</div>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <div className="w-6 h-6 bg-cyan-500 rounded flex items-center justify-center shrink-0 mt-0.5">
                            <FaClock className="text-white text-xs" />
                          </div>
                          <div className="text-xs">
                            <div className="text-cyan-600 font-medium">Max-Life</div>
                            <div className="text-gray-700">{breed.maxlife || "N/A"}</div>
                          </div>
                        </div>
                      </div>

                      {/* Suitable For */}
                      <div>
                        <h4 className="text-cyan-600 font-medium text-sm mb-3">
                          Suitable For
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {suitableList.length > 0 ? (
                            suitableList.map((type: string) => (
                              <div key={type} className="flex flex-col items-center gap-1">
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                  {getSuitableIcon(type)}
                                </div>
                                <span className="text-xs text-gray-600">{type}</span>
                              </div>
                            ))
                          ) : (
                            <span className="text-xs text-gray-400">General</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}