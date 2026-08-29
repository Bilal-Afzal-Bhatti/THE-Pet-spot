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

export default function DogsCatchAllPage() {
  const pathname = usePathname();
  const router = useRouter();

  // Core states
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

  // Sidebar/filter states
  const [petCategory, setPetCategory] = useState<string>("Dogs");
  const [lookingFor, setLookingFor] = useState<string>("Buying");
  const [sortBy, setSortBy] = useState<string>("");
  const [filteredPetsList, setFilteredPetsList] = useState(pets);
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

  const searchRef = useRef<HTMLDivElement | null>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowBreeds(false);
        setShowStates(false);
        setShowCities(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Dropdown direction
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

  // Slug helpers
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

  const unSlug = (s?: string) => {
    if (!s) return "";
    try {
      const dec = decodeURIComponent(s);
      return dec
        .replace(/-/g, " ")
        .replace(/_/g, " ")
        .trim()
        .split(/\s+/)
        .map((w) => w[0].toUpperCase() + w.slice(1))
        .join(" ");
    } catch {
      return s.replace(/-/g, " ");
    }
  };

  const findStateForCity = (cityName: string) => {
    if (!cityName) return "";
    for (const [state, cities] of Object.entries(statesWithCities)) {
      if (
        cities
          .map((c: string) => c.toLowerCase())
          .includes(cityName.toLowerCase())
      )
        return state;
    }
    return "";
  };

  // Parse URL on mount & popstate
  useEffect(() => {
    const parsePath = () => {
      if (!pathname) return;
      const parts = pathname.split("/").filter(Boolean);

      if (parts[0] !== "dogs") return;

      let breed = "";
      let city = "";
      const inIdx = parts.indexOf("in");

      if (
        parts.length > 1 &&
        parts[1] !== "for-sale" &&
        !parts.includes("in", 1)
      ) {
        breed = unSlug(parts[1]);
      }
      if (inIdx !== -1 && parts[inIdx + 1]) {
        city = unSlug(parts[inIdx + 1]);
      }

      setSelectedBreed(breed);
      setSelectedCity(city);
      if (city) {
        const state = findStateForCity(city);
        if (state) setSelectedState(state);
      } else {
        setSelectedState("");
      }
    };

    parsePath();
    window.addEventListener("popstate", parsePath);
    return () => window.removeEventListener("popstate", parsePath);
  }, [pathname]);

  // Apply filters
  const applyFilters = () => {
    let result = pets.slice();
    setCurrentPage(1);

    if (selectedBreed) {
      const q = selectedBreed.toLowerCase();
      result = result.filter(
        (p) =>
          p.breed.toLowerCase().includes(q) || p.name.toLowerCase().includes(q)
      );
    }

    if (selectedCity) {
      result = result.filter((p) => p.city === selectedCity);
    } else if (selectedState) {
      const cities = statesWithCities[selectedState] || [];
      result = result.filter(
        (p) => cities.includes(p.city) || p.city === selectedState
      );
    }

    if (budget) result = result.filter((p) => p.price <= budget);
    if (selectedGender)
      result = result.filter((p) => p.gender === selectedGender);
    if (selectedFeature === "Puppy Quality") {
      result = result.filter((p) => {
        const weeks = parseInt(p.age || "0") || 0;
        return weeks <= 8;
      });
    }

    // Sorting
    if (sortBy === "priceLowHigh") result.sort((a, b) => a.price - b.price);
    else if (sortBy === "priceHighLow")
      result.sort((a, b) => b.price - a.price);
    else if (sortBy === "ageLowHigh")
      result.sort((a, b) => (parseInt(a.age) || 0) - (parseInt(b.age) || 0));
    else if (sortBy === "ageHighLow")
      result.sort((a, b) => (parseInt(b.age) || 0) - (parseInt(a.age) || 0));
    else if (sortBy === "newest") result.sort((a, b) => b.id - a.id);

    setFilteredPetsList(result);
  };

  useEffect(() => {
    applyFilters();
  }, [
    selectedBreed,
    selectedState,
    selectedCity,
    budget,
    selectedGender,
    selectedFeature,
    sortBy,
  ]);

  const dropdownClass = `absolute z-20 left-0 w-full bg-white border border-gray-200 rounded-md max-h-48 overflow-y-auto`;

  const handleSearch = () => {
    applyFilters();
    const breedSlug = slugify(selectedBreed);
    const citySlug = slugify(selectedCity);

    let path = "/dogs/for-sale";
    if (breedSlug && citySlug)
      path = `/dogs/${breedSlug}/for-sale/in/${citySlug}`;
    else if (breedSlug) path = `/dogs/${breedSlug}/for-sale`;
    else if (citySlug) path = `/dogs/for-sale/in/${citySlug}`;

    router.push(path);
    setShowBreeds(false);
    setShowStates(false);
    setShowCities(false);
  };

  return (
    <div className="min-h-screen font-raleway p-6 px-44">
      {/* Search Bar */}
      <div
        ref={searchRef}
        className="w-full max-w-6xl mx-auto bg-white border border-gray-200 rounded-xl flex items-center justify-between gap-3 px-4 sm:px-6 lg:px-8 py-4 mb-10"
      >
        {/* Breed */}
        <div className="relative flex items-center bg-white border border-gray-200 rounded-md px-3 py-2 w-full">
          <FaDog className="text-gray-400 text-lg mr-2" />
          <input
            type="text"
            placeholder="Breed"
            value={selectedBreed}
            onChange={(e) => setSelectedBreed(e.target.value)}
            onFocus={() => {
              setShowBreeds(true);
              setShowStates(false);
              setShowCities(false);
            }}
            className="w-full outline-none text-sm text-gray-700 placeholder:text-gray-400"
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

        {/* State */}
        <div className="relative flex items-center bg-white border border-gray-200 rounded-md px-3 py-2 w-full">
          <FiMapPin className="text-gray-400 text-lg mr-2" />
          <input
            type="text"
            placeholder="State"
            value={selectedState}
            readOnly
            onClick={() => {
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

        {/* City */}
        <div className="relative flex items-center bg-white border border-gray-200 rounded-md px-3 py-2 w-full">
          <FiMapPin className="text-gray-400 text-lg mr-2" />
          <input
            type="text"
            placeholder="City"
            value={selectedCity}
            readOnly
            onClick={() => selectedState && setShowCities(!showCities)}
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

        <button
          onClick={handleSearch}
          className="bg-[#8957E9] hover:bg-[#8b3ffd] text-white font-medium rounded-md px-18 py-2 transition-all duration-200"
        >
          Search
        </button>
      </div>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto flex gap-4">
        {/* FULL SIDEBAR - 100% YOUR ORIGINAL */}
        <div className="w-60">
          <div className="bg-[#F9F6FF] px-5 py-5 shadow">
            <div className="text-[#8957E9] rounded-lg p flex items-center justify-between">
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

          <h3 className="text-purple-600 font-medium text-xl flex items-center gap-2 my-6">
            Filters
          </h3>

          {/* I am Looking */}
          <div className="px-5 py-5 shadow my-3">
            <div className="text-[#8957E9] rounded-lg p flex items-center justify-between">
              <h3 className="font-semibold text-base flex items-center gap-2">
                I am Looking
              </h3>
            </div>
            <hr className="my-1.5 border-gray-200 mb-4" />
            <div className="space-y-0 text-gray-700 text-sm mt-2">
              <label className="flex items-center gap-2 font-semibold cursor-pointer">
                <input
                  type="radio"
                  name="lookingFor"
                  value="Buying"
                  className="accent-[#8957E9] w-4 h-4"
                  checked={lookingFor === "Buying"}
                  onChange={() => setLookingFor("Buying")}
                />
                For Buying
              </label>
              <hr className="my-2 border-gray-200" />
              <label className="flex items-center gap-2 font-semibold cursor-pointer">
                <input
                  type="radio"
                  name="lookingFor"
                  value="Mating"
                  className="accent-[#8957E9] w-4 h-4"
                  checked={lookingFor === "Mating"}
                  onChange={() => setLookingFor("Mating")}
                />
                For Mating
              </label>
              <hr className="my-2 border-gray-200" />
              <label className="flex items-center gap-2 font-semibold cursor-pointer">
                <input
                  type="radio"
                  name="lookingFor"
                  value="Adoption"
                  className="accent-[#8957E9] w-4 h-4"
                  checked={lookingFor === "Adoption"}
                  onChange={() => setLookingFor("Adoption")}
                />
                For Adoption
              </label>
            </div>
          </div>

          {/* Pet Category */}
          <div className="px-5 py-5 shadow rounded-lg bg-white my-3">
            <div className="text-[#8957E9] flex items-center justify-between">
              <h3 className="font-semibold text-base flex items-center gap-2">
                Pet Category
              </h3>
            </div>
            <hr className="my-2 border-gray-200 mb-4" />
            <div className="space-y-3 text-gray-700 text-sm">
              <label className="flex items-center gap-2 font-semibold cursor-pointer">
                <input
                  type="radio"
                  name="petCategory"
                  value="Dogs"
                  className="accent-[#8957E9] w-4 h-4"
                  checked={petCategory === "Dogs"}
                  onChange={() => setPetCategory("Dogs")}
                />{" "}
                Dogs
              </label>
              <hr className="border-gray-200" />
              <label className="flex items-center gap-2 font-semibold cursor-pointer">
                <input
                  type="radio"
                  name="petCategory"
                  value="Cats"
                  className="accent-[#8957E9] w-4 h-4"
                  checked={petCategory === "Cats"}
                  onChange={() => setPetCategory("Cats")}
                />{" "}
                Cats
              </label>
              <hr className="border-gray-200" />
              <label className="flex items-center gap-2 font-semibold cursor-pointer">
                <input
                  type="radio"
                  name="petCategory"
                  value="Small Pets"
                  className="accent-[#8957E9] w-4 h-4"
                  checked={petCategory === "Small Pets"}
                  onChange={() => setPetCategory("Small Pets")}
                />{" "}
                Small Pets
              </label>
            </div>
          </div>

          {/* Sort By */}
          <div className="px-5 py-5 shadow rounded-lg bg-white my-3">
            <div className="text-[#8957E9] flex items-center justify-between">
              <h3 className="font-semibold text-base flex items-center gap-2">
                Sort By
              </h3>
            </div>
            <hr className="my-2 border-gray-200 mb-4" />
            <div className="space-y-3 text-gray-700 text-sm">
              <label className="flex items-center gap-2 font-semibold cursor-pointer">
                <input
                  type="radio"
                  name="sortBy"
                  value="priceLowHigh"
                  className="accent-[#8957E9] w-4 h-4"
                  checked={sortBy === "priceLowHigh"}
                  onChange={() => setSortBy("priceLowHigh")}
                />{" "}
                Price Low to High
              </label>
              <hr className="border-gray-200" />
              <label className="flex items-center gap-2 font-semibold cursor-pointer">
                <input
                  type="radio"
                  name="sortBy"
                  value="priceHighLow"
                  className="accent-[#8957E9] w-4 h-4"
                  checked={sortBy === "priceHighLow"}
                  onChange={() => setSortBy("priceHighLow")}
                />{" "}
                Price High to Low
              </label>
              <hr className="border-gray-200" />
              <label className="flex items-center gap-2 font-semibold cursor-pointer">
                <input
                  type="radio"
                  name="sortBy"
                  value="ageLowHigh"
                  className="accent-[#8957E9] w-4 h-4"
                  checked={sortBy === "ageLowHigh"}
                  onChange={() => setSortBy("ageLowHigh")}
                />{" "}
                Age Low to High
              </label>
              <hr className="border-gray-200" />
              <label className="flex items-center gap-2 font-semibold cursor-pointer">
                <input
                  type="radio"
                  name="sortBy"
                  value="ageHighLow"
                  className="accent-[#8957E9] w-4 h-4"
                  checked={sortBy === "ageHighLow"}
                  onChange={() => setSortBy("ageHighLow")}
                />{" "}
                Age High to Low
              </label>
              <hr className="border-gray-200" />
              <label className="flex items-center gap-2 font-semibold cursor-pointer">
                <input
                  type="radio"
                  name="sortBy"
                  value="newest"
                  className="accent-[#8957E9] w-4 h-4"
                  checked={sortBy === "newest"}
                  onChange={() => setSortBy("newest")}
                />{" "}
                Whats New
              </label>
            </div>
          </div>

          {/* Gender */}
          <div className="px-5 py-5 shadow rounded-lg bg-white my-3">
            <div className="text-[#8957E9] flex items-center justify-between">
              <h3 className="font-semibold text-base flex items-center gap-2">
                Gender
              </h3>
            </div>
            <hr className="my-2 border-gray-200 mb-4" />
            <div className="space-y-3 text-gray-700 text-sm">
              {genderOptions.map((opt, idx) => (
                <div key={opt}>
                  <label className="flex items-center gap-2 font-semibold cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value={opt}
                      className="accent-[#8957E9] w-4 h-4 mb-2"
                      checked={selectedGender === opt}
                      onChange={() => setSelectedGender(opt)}
                    />
                    {opt}
                  </label>
                  {idx < genderOptions.length - 1 && (
                    <hr className="border-gray-200 my-1.5" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Pet Features */}
          <div className="px-5 py-5 shadow rounded-lg bg-white my-3">
            <div className="text-[#8957E9] flex items-center justify-between">
              <h3 className="font-semibold text-base flex items-center gap-2">
                Pet Features
              </h3>
            </div>
            <hr className="my-2 border-gray-200 mb-4" />
            <div className="space-y-3 text-gray-700 text-sm">
              {featureOptions.map((opt, idx) => (
                <div key={opt}>
                  <label className="flex items-center gap-2 font-semibold cursor-pointer mb-2">
                    <input
                      type="radio"
                      name="feature"
                      value={opt}
                      className="accent-[#8957E9] w-4 h-4"
                      checked={selectedFeature === opt}
                      onChange={() => setSelectedFeature(opt)}
                    />
                    {opt}
                  </label>
                  {idx < featureOptions.length - 1 && (
                    <hr className="border-gray-200 my-1.5" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Budget */}
          <div className="mb-5">
            <h3 className="text-purple-600 font-semibold flex items-center gap-2 mb-3">
              <FiDollarSign /> Budget
            </h3>
            <input
              type="range"
              min="0"
              max="1000000"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full appearance-none h-2 bg-gray-200 rounded-lg accent-[#8957E9] cursor-pointer outline-none"
            />
            <div className="flex justify-between font-semibold">
              <p>0</p>
              <p>10L</p>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Your Budget: <span className="font-semibold">₹: {budget}</span>
            </p>
          </div>

          <hr className="my-5 border-gray-300" />

          {/* Popular Breeds */}
          <h3 className="text-purple-600 font-semibold flex items-center gap-2 mb-3">
            <FaFire /> Popular Breeds
          </h3>
          <div className="space-y-2 text-gray-700">
            {popularBreeds.map((breed, i) => {
              const breedCount = pets.filter((p) => p.breed === breed).length;
              return (
                <div
                  key={i}
                  onClick={() => setSelectedBreed(breed)}
                  className="hover:text-purple-600 cursor-pointer text-sm flex gap-2"
                >
                  <span>{breed}</span>
                  <span className="text-gray-500">({breedCount})</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pets Grid + Pagination */}
        <div className="flex-1">
          <div className="bg-white p-6 rounded-xl mb-6">
            <p className="text-sm text-gray-500">
              Home &gt; <span className="text-purple-600">Dogs</span> &gt;
              {selectedBreed
                ? ` ${selectedBreed} for Sale`
                : " All Dogs for Sale"}
            </p>
            <h2 className="text-2xl font-bold mt-2">
              {selectedBreed ? `${selectedBreed} For Sale` : "Dogs For Sale"}
            </h2>
            <h4>{filteredPetsList.length} Result Found</h4>
            <p className="text-gray-600 mt-3 leading-relaxed">
              <span className="font-semibold">Pets in Pakistan:</span> Find pets
              near you.
            </p>
            <button className="mt-3 text-sm bg-purple-100 text-purple-600 px-4 py-1 rounded-md">
              Read More
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredPetsList
              .slice(
                (currentPage - 1) * ITEMS_PER_PAGE,
                currentPage * ITEMS_PER_PAGE
              )
              .map((pet) => (
                <div key={pet.id} className="bg-white rounded-xl">
                  <div className="relative">
                    <img
                      src={pet.img}
                      alt={pet.name}
                      className="w-full h-48 object-cover"
                    />
                    <span className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-3 py-1 rounded-full">
                      Pet Quality
                    </span>
                    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent text-white px-3 py-2 text-sm font-semibold">
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
                      <span className="font-medium">Gender:</span> {pet.gender}
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
              ))}
            {filteredPetsList.length === 0 && (
              <div className="col-span-3 text-center text-gray-500">
                No pets found for the current filters.
              </div>
            )}
          </div>

          {/* FULL PAGINATION */}
          {filteredPetsList.length > ITEMS_PER_PAGE && (
            <div className="mt-8 flex items-center justify-between">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 text-sm font-medium rounded ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-purple-100 text-purple-600 hover:bg-purple-200"
                }`}
              >
                Previous Page
              </button>
              <div className="text-sm text-gray-700">
                Page {currentPage} of{" "}
                {Math.ceil(filteredPetsList.length / ITEMS_PER_PAGE)}
              </div>
              <button
                onClick={() =>
                  setCurrentPage((p) =>
                    Math.min(
                      Math.ceil(filteredPetsList.length / ITEMS_PER_PAGE),
                      p + 1
                    )
                  )
                }
                disabled={
                  currentPage >=
                  Math.ceil(filteredPetsList.length / ITEMS_PER_PAGE)
                }
                className={`px-4 py-2 text-sm font-medium rounded ${
                  currentPage >=
                  Math.ceil(filteredPetsList.length / ITEMS_PER_PAGE)
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-purple-100 text-purple-600 hover:bg-purple-200"
                }`}
              >
                Next Page
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
