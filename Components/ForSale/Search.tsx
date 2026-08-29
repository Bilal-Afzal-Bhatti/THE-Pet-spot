"use client";
import React, { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FiMapPin, FiPlus, FiDollarSign } from "react-icons/fi";
import { FaDog, FaFire } from "react-icons/fa";
import {
  pets,
  breeds,
  popularBreeds,
  statesWithCities,
} from "@/Components/dogs-for-sale/data";
// <-- adjust path to your data.ts (this assumes data.ts is in app/components/data.ts)

export default function DogsCatchAllPage() {
  const pathname = usePathname();
  const router = useRouter();

  // States (same as your original component)
  const [budget, setBudget] = useState<number>(500000);
  const [selectedBreed, setSelectedBreed] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [showBreeds, setShowBreeds] = useState<boolean>(false);
  const [showStates, setShowStates] = useState<boolean>(false);
  const [showCities, setShowCities] = useState<boolean>(false);
  const [openUp, setOpenUp] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 12;

  const [petCategory, setPetCategory] = useState<string>("Dogs");
  const [lookingFor, setLookingFor] = useState<string>("Buying");
  const [sortBy, setSortBy] = useState<string>("");
  const [filteredPetsList, setFilteredPetsList] = useState(pets);

  const searchRef = useRef<HTMLDivElement | null>(null);
  const [selectedGender, setSelectedGender] = useState<string>("");
  const [selectedFeature, setSelectedFeature] = useState<string>("");

  const genderOptions = ["Male", "Female", "Other"];
  const featureOptions = [
    "Puppy Quality",
    "Pet Quality",
    "KCI Registered",
    "Champion Bloodline",
    "All",
  ];

  // Recalculate dropdown direction based on distance to bottom
  useEffect(() => {
    const checkPosition = () => {
      if (!searchRef.current) return;
      const rect = searchRef.current.getBoundingClientRect();
      setOpenUp(window.innerHeight - rect.bottom < 250);
    };
    checkPosition();
    window.addEventListener("scroll", checkPosition);
    window.addEventListener("resize", checkPosition);
    return () => {
      window.removeEventListener("scroll", checkPosition);
      window.removeEventListener("resize", checkPosition);
    };
  }, []);

  // ---------- Helpers ----------
  // slugify (used for building URLs if you need)
  const slugify = (s?: string) => {
    if (!s) return "";
    return encodeURIComponent(
      s
        .toString()
        .trim()
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[\s\_]+/g, "-")
        .replace(/[^\w\-]+/g, "")
        .replace(/\-\-+/g, "-")
    );
  };

  // UN-slug: german-shepherd => German Shepherd
  const unSlug = (s?: string) => {
    if (!s) return "";
    try {
      const dec = decodeURIComponent(s);
      const words = dec
        .replace(/-/g, " ")
        .replace(/_/g, " ")
        .trim()
        .split(/\s+/)
        .map((w) => (w.length ? w[0].toUpperCase() + w.slice(1) : w));
      return words.join(" ");
    } catch {
      return s.replace(/-/g, " ");
    }
  };

  // Try to derive state from city name using statesWithCities map
  const findStateForCity = (cityName: string) => {
    if (!cityName) return "";
    for (const [state, cities] of Object.entries(statesWithCities)) {
      if (cities.map((c) => c.toLowerCase()).includes(cityName.toLowerCase())) {
        return state;
      }
    }
    return "";
  };

  // ---------- Parse the pathname to extract breed & city ----------
  // Examples:
  // /dogs/for-sale
  // /dogs/german-shepherd/for-sale
  // /dogs/for-sale/in/pune
  // /dogs/german-shepherd/for-sale/in/pune
  useEffect(() => {
    if (!pathname) return;

    const parts = pathname.split("/").filter(Boolean); // remove empty
    // parts example: ["dogs","german-shepherd","for-sale","in","pune"]

    let breedFromPath = "";
    let cityFromPath = "";

    if (parts[0] !== "dogs") {
      // not under /dogs - do nothing
      return;
    }

    // find "for-sale" index
    const forSaleIdx = parts.indexOf("for-sale");
    const inIdx = parts.indexOf("in"); // index of "in" if present

    // If first pattern is /dogs/{breed}/for-sale
    // then breed is parts[1] (if exists and not "for-sale")
    if (parts.length >= 2 && parts[1] !== "for-sale") {
      // candidate breed
      // but if parts[1] equals 'for-sale' then there is no breed
      if (forSaleIdx === 2 || forSaleIdx === -1) {
        // either /dogs/{breed}/for-sale or /dogs/{breed}/... (defensive)
        breedFromPath = parts[1];
      }
    }

    // If pattern contains "in" and there's a segment after it -> city
    if (inIdx !== -1 && parts.length > inIdx + 1) {
      cityFromPath = parts[inIdx + 1];
    } else if (forSaleIdx !== -1 && parts.length > forSaleIdx + 1) {
      // handle possible structure /dogs/for-sale/{city} (less likely) - ignore normally
    }

    // If someone used /dogs/for-sale/in/{city} (no breed), the breedFromPath will be empty
    // If someone used /dogs/{breed}/for-sale/in/{city} breedFromPath filled

    const breedReadable = unSlug(breedFromPath);
    const cityReadable = unSlug(cityFromPath);

    // Update states only when different to avoid infinite loops
    if (breedReadable && breedReadable !== selectedBreed) {
      setSelectedBreed(breedReadable);
    } else if (!breedReadable) {
      setSelectedBreed("");
    }

    if (cityReadable && cityReadable !== selectedCity) {
      setSelectedCity(cityReadable);
      // also attempt to set selectedState automatically
      const stateFound = findStateForCity(cityReadable);
      if (stateFound) setSelectedState(stateFound);
    } else if (!cityReadable) {
      setSelectedCity("");
    }

    // Re-apply filters after updating states (small delay to ensure React state is updated)
    // but we can rely on the useEffect that watches selected* states to call applyFilters()
    // so no immediate applyFilters() call needed here.

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // ---------- Filtering logic (unchanged from your original) ----------
  const applyFilters = () => {
    let result = pets.slice();
    setCurrentPage(1);

    if (selectedBreed && selectedBreed.trim() !== "") {
      const q = selectedBreed.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.breed.toLowerCase().includes(q) || p.name.toLowerCase().includes(q)
      );
    }

    if (selectedCity) {
      result = result.filter((p) => p.city === selectedCity);
    } else if (selectedState) {
      const cities = (statesWithCities as any)[selectedState] || [];
      if (cities.length > 0) {
        result = result.filter(
          (p) => cities.includes(p.city) || p.city === selectedState
        );
      } else {
        result = result.filter((p) => p.city === selectedState);
      }
    }

    if (budget !== undefined && budget !== null) {
      result = result.filter((p) => p.price <= budget);
    }

    if (selectedGender) {
      result = result.filter((p) => p.gender === selectedGender);
    }

    if (selectedFeature === "Puppy Quality") {
      result = result.filter((p) => {
        const weeks = parseInt(String(p.age || "0"), 10) || 0;
        return weeks <= 8;
      });
    }

    if (sortBy === "priceLowHigh") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "priceHighLow") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "ageLowHigh") {
      result.sort((a, b) => {
        const aa = parseInt(String(a.age || "0"), 10) || 0;
        const bb = parseInt(String(b.age || "0"), 10) || 0;
        return aa - bb;
      });
    } else if (sortBy === "ageHighLow") {
      result.sort((a, b) => {
        const aa = parseInt(String(a.age || "0"), 10) || 0;
        const bb = parseInt(String(b.age || "0"), 10) || 0;
        return bb - aa;
      });
    } else if (sortBy === "newest") {
      result.sort((a, b) => b.id - a.id);
    }

    setFilteredPetsList(result);
  };

  // Keep filters in sync when these states change
  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedBreed,
    selectedState,
    selectedCity,
    budget,
    selectedGender,
    selectedFeature,
    sortBy,
    petCategory,
    lookingFor,
  ]);

  const dropdownClass = `absolute z-20 left-0 w-full bg-white border border-gray-200 rounded-md max-h-48 overflow-y-auto `;

  // Build path and navigate when user clicks Search
  const handleSearch = () => {
    applyFilters();

    const breedSlug = slugify(selectedBreed);
    const citySlug = slugify(selectedCity);

    let path = "/dogs/for-sale"; // default
    if (breedSlug && citySlug) {
      path = `/dogs/${breedSlug}/for-sale/in/${citySlug}`;
    } else if (breedSlug) {
      path = `/dogs/${breedSlug}/for-sale`;
    } else if (citySlug) {
      path = `/dogs/for-sale/in/${citySlug}`;
    }

    router.push(path);
  };

  // ---------- Render (same UI with search + sidebar + grid) ----------
  return (
    <div className="min-h-screen  font-raleway p-6 px-44">
      {/* 🔍 Integrated Search Bar */}
      <div
        ref={searchRef}
        className="w-full max-w-6xl mx-auto bg-white border border-gray-200 
        rounded-xl flex items-center justify-between gap-3 
        px-4 sm:px-6 lg:px-8 py-4 mb-10"
      >
        {/* 🐶 Breed Input */}
        <div className="relative flex items-center bg-white border border-gray-200 rounded-md px-3 py-2 w-full">
          <FaDog className="text-gray-400 text-lg mr-2" />
          <input
            type="text"
            placeholder="Breed"
            value={selectedBreed}
            onFocus={() => {
              setShowBreeds(true);
              setShowStates(false);
              setShowCities(false);
            }}
            onChange={(e) => setSelectedBreed(e.target.value)}
            className="w-full outline-none active:outline-[#BFDEFF] text-sm text-gray-700 placeholder:text-gray-400"
          />
          {showBreeds && (
            <ul
              className={`${dropdownClass} ${
                openUp ? "bottom-full mb-1" : "top-full mt-1"
              }`}
            >
              {breeds
                .filter((b) =>
                  b.toLowerCase().includes(selectedBreed.toLowerCase())
                )
                .map((breed) => (
                  <li
                    key={breed}
                    onClick={() => {
                      setSelectedBreed(breed);
                      setShowBreeds(false);
                    }}
                    className="px-3 py-2 hover:bg-purple-100 cursor-pointer"
                  >
                    {breed}
                  </li>
                ))}
            </ul>
          )}
        </div>

        {/* 📍 State Input */}
        <div className="relative flex items-center bg-white border border-gray-200 rounded-md px-3 py-2 w-full">
          <FiMapPin className="text-gray-400 text-lg mr-2" />
          <input
            type="text"
            placeholder="State"
            value={selectedState}
            readOnly
            onFocus={() => {
              setShowStates(!showStates);
              setShowBreeds(false);
              setShowCities(false);
            }}
            className="w-full outline-none text-sm text-gray-700 placeholder:text-gray-400 cursor-pointer"
          />
          {showStates && (
            <ul
              className={`${dropdownClass} ${
                openUp ? "bottom-full mb-1" : "top-full mt-1"
              }`}
            >
              {Object.keys(statesWithCities).map((state) => (
                <li
                  key={state}
                  onClick={() => {
                    setSelectedState(state);
                    setSelectedCity("");
                    setShowStates(false);
                  }}
                  className="px-3 py-2 hover:bg-purple-100 cursor-pointer"
                >
                  {state}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 🏙️ City Input */}
        <div className="relative flex items-center bg-white border border-gray-200 rounded-md px-3 py-2 w-full">
          <FiMapPin className="text-gray-400 text-lg mr-2" />
          <input
            type="text"
            placeholder="City"
            value={selectedCity}
            readOnly
            onFocus={() => {
              if (selectedState) {
                setShowCities(!showCities);
                setShowBreeds(false);
                setShowStates(false);
              }
            }}
            className="w-full outline-none text-sm text-gray-700 placeholder:text-gray-400 cursor-pointer"
          />
          {showCities && selectedState && (
            <ul
              className={`${dropdownClass} ${
                openUp ? "bottom-full mb-1" : "top-full mt-1"
              }`}
            >
              {statesWithCities[selectedState].map((city) => (
                <li
                  key={city}
                  onClick={() => {
                    setSelectedCity(city);
                    setShowCities(false);
                  }}
                  className="px-3 py-2 hover:bg-purple-100 cursor-pointer"
                >
                  {city}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 🔍 Search Button */}
        <button
          onClick={() => handleSearch()}
          className="bg-[#8957E9] hover:bg-[#8b3ffd] text-white font-medium 
            rounded-md px-18 py-2 flex items-center justify-center gap-2 
            transition-all duration-200"
        >
          Search
        </button>
      </div>

      {/* Rest of layout (sidebar + grid) */}
      <div className="max-w-7xl mx-auto flex gap-4">
        {/* Sidebar (same as before) */}
        <div className="w-60 ">
          {/* header + Filters (omitted in this snippet for brevity) */}
          {/* For full sidebar see your original component - keep as-is */}
          {/* I kept full sidebar and grid in the code above earlier; you can paste your original sidebar JSX here if you moved it */}
          <div className="bg-[#F9F6FF] px-5 py-5 shadow">
            <div className="text-[#8957E9] rounded-lg p flex items-center justify-between ">
              <h3 className="font-semibold text-base flex items-center gap-2">
                Add Pet
              </h3>
              <FiPlus className="text-lg font-extrabold cursor-pointer hover:scale-110 transition" />
            </div>
            <hr className="my-1.5 border-gray-200" />
            <div className="space-y-0 text-gray-700 text-sm">
              <div className="hover:text-purple-600 cursor-pointer text-sm font-semibold my-2">
                For Sale
              </div>
              <hr className="my-2 border-gray-200" />
              <div className="hover:text-purple-600 cursor-pointer font-semibold">
                For Mating
              </div>
              <hr className="my-2 border-gray-200" />
              <div className="hover:text-purple-600 cursor-pointer font-semibold">
                For Adoption
              </div>
            </div>
          </div>

          {/* ... rest of sidebar filters (same as your original) ... */}
        </div>

        {/* Grid (same rendering as before) */}
        <div className="flex-1">
          <div className="bg-white p-6 rounded-xl  mb-6">
            <p className="text-sm text-gray-500">
              Home &gt; <span className="text-purple-600">Dogs</span> &gt;{" "}
              {selectedBreed
                ? `${selectedBreed} for Sale`
                : "All Dogs for Sale"}
            </p>
            <h2 className="text-2xl font-bold mt-2">
              {selectedBreed ? `${selectedBreed} For Sale` : "Dogs For Sale"}
            </h2>
            <p className="text-gray-600 mt-3 leading-relaxed">
              <span className="font-semibold">Pets in Pakistan:</span> Find pets
              near you.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {(() => {
              const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
              const endIdx = startIdx + ITEMS_PER_PAGE;
              const paginatedList = filteredPetsList.slice(startIdx, endIdx);
              if (paginatedList.length === 0) {
                return (
                  <div className="col-span-3 text-center text-gray-500">
                    No pets found for the current filters.
                  </div>
                );
              }
              return paginatedList.map((pet) => (
                <div key={pet.id} className="bg-white rounded-xl ">
                  <div className="relative">
                    <img
                      src={pet.img}
                      alt={pet.name}
                      className="w-full h-48 object-cover"
                    />
                    <span className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-3 py-1 rounded-full">
                      Pet Quality
                    </span>
                    <div className="absolute bottom-0 left-0 w-full bg-linear-to-t from-black/70 to-transparent text-white px-3 py-2 text-sm font-semibold">
                      View Price
                    </div>
                  </div>

                  <div className="p-4 space-y-2 text-xs text-gray-700">
                    <h3 className="text-purple-700 font-semibold text-sm mb-2">
                      {pet.name}
                    </h3>
                    <p>
                      <span className="font-medium mr-1">Breed:</span>{" "}
                      {pet.breed}
                    </p>
                    <p className="flex items-center gap-1">
                      <span className="font-medium">Gender:</span>
                      {pet.gender}
                      <span className="ml-3">
                        <span className="font-medium">Age:</span> {pet.age}
                      </span>
                    </p>

                    <p>
                      <span className="font-medium">City:</span>{" "}
                      <span className="text-purple-600 cursor-pointer hover:underline">
                        {pet.city}
                      </span>
                    </p>

                    <div>
                      <button className="px-4 py-1.5 mr-1.5 text-black border-gray-100 font-medium border hover:bg-[#9461F7] hover:text-white rounded">
                        Call
                      </button>
                      <button className="px-2 py-1.5 mr-1.5 text-black border-gray-100 font-medium border hover:bg-[#9461F7] hover:text-white rounded">
                        Whatsapp
                      </button>
                      <button className="px-4 py-1.5 border-gray-100 text-black font-medium border hover:bg-[#9461F7] hover:text-white rounded">
                        Details
                      </button>
                    </div>

                    <button className="hover:bg-[#9361f7d4] text-white w-full py-1.5 bg-[#9461F7] font-medium text-sm">
                      Book Now
                    </button>
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}
