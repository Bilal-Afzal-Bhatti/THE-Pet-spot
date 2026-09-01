"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FiMapPin, FiPlus, FiDollarSign, FiPhone, FiInfo } from "react-icons/fi";
import { FaDog, FaFire } from "react-icons/fa";
import { SiWhatsapp } from "react-icons/si";
import { useAdStore } from "@/Store/AdsStore";
import { pets, breeds, popularBreeds, statesWithCities } from "./data"; // adjust path if needed
import { dogBreeds } from "@/utils/breeds";


export default function DogsPage() {
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

  // API states
  const [apiData, setApiData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalAds, setTotalAds] = useState<number>(0);

  // Sidebar/filter states
  const [petCategory, setPetCategory] = useState<string>("Dogs");
  const [lookingFor, setLookingFor] = useState<string>("Buying");
  const [sortBy, setSortBy] = useState<string>("");
  const [filteredPetsList, setFilteredPetsList] = useState<any[]>([]);

  const [selectedGender, setSelectedGender] = useState<string>("");
  const [selectedFeature, setSelectedFeature] = useState<string>("");

  // Store
  const { getApprovedDogAds } = useAdStore();
  

  const genderOptions = ["Male", "Female", "Other"];
  const featureOptions = [
    "Puppy Quality",
    "Pet Quality",
    "KCI Registered",
    "Champion Bloodline",
    "All",
  ];

  const searchRef = useRef<HTMLDivElement | null>(null);

  // ---------- Utility helpers ----------
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

  // Convert slug back to human readable (german-shepherd -> German Shepherd)
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
const handleViewPet = (pet: any) => {
  const petName = pet.name || pet.title || "Pet";
  const petBreed = pet.breed || "dog";
  const petSlug = `${slugify(petName)}-${slugify(petBreed)}`;
  
  // Get the exact ID
  const petId = pet._id || pet.id;
 console.log("Navigating to pet details for:", petName, "with ID:", petId);
  // Store both the full pet object AND the explicit ID in sessionStorage
  if (typeof window !== "undefined") {
    sessionStorage.setItem("selectedPetData", JSON.stringify(pet));
    sessionStorage.setItem("currentPetId", petId);
  }

  // Push to the slug route, while your app logic can grab the ID from storage when making API calls
  router.push(`/dogs/pet/${petSlug}`);
};
  const findStateForCity = (cityName: string) => {
    if (!cityName) return "";
    for (const [state, cities] of Object.entries(statesWithCities)) {
      if (cities.map((c) => c.toLowerCase()).includes(cityName.toLowerCase()))
        return state;
    }
    return "";
  };

  // ---------- API Data Fetching ----------
  useEffect(() => {
    const fetchApprovedDogAds = async () => {
      setLoading(true);
      try {
        const result = await getApprovedDogAds(currentPage, ITEMS_PER_PAGE);
        setApiData(result.ads);
        setFilteredPetsList(result.ads);
        setTotalPages(result.pagination.totalPages);
        setTotalAds(result.pagination.totalAds);
      } catch (error) {
        console.error('Failed to fetch approved dog ads:', error);
        setApiData([]);
        setFilteredPetsList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedDogAds();
  }, [currentPage, getApprovedDogAds]);

  // ---------- Filtering logic (client-side for current page data) ----------
  const applyFilters = () => {
    if (!apiData.length) return;

    let result = [...apiData];

    // Breed / name search
    if (selectedBreed && selectedBreed.trim() !== "") {
      const q = selectedBreed.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.breed.toLowerCase().includes(q) || p.name.toLowerCase().includes(q)
      );
    }

    // City / State filter
    if (selectedCity) {
      result = result.filter((p) => p.city === selectedCity);
    } else if (selectedState) {
      const cities =
        statesWithCities[selectedState as keyof typeof statesWithCities] || [];
      if (cities.length > 0) {
        result = result.filter(
          (p) => cities.includes(p.city) || p.city === selectedState
        );
      } else {
        result = result.filter((p) => p.city === selectedState);
      }
    }

    // Budget filter
    if (budget !== undefined && budget !== null) {
      result = result.filter((p) => p.price <= budget);
    }

    // Gender
    if (selectedGender) {
      result = result.filter((p) => p.gender === selectedGender);
    }

    // Feature: implement "Puppy Quality" as <= 8 weeks
    if (selectedFeature === "Puppy Quality") {
      result = result.filter((p) => {
        const weeks = parseInt(String(p.age || "0"), 10) || 0;
        return weeks <= 8;
      });
    }

    // Sorting
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
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

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
    apiData,
  ]);

  const dropdownClass = `absolute z-20 left-0 w-full bg-white border border-gray-300 rounded-md max-h-48 overflow-y-auto shadow-lg`;
  const dropdownStyle = { background: 'white' };

  // ---------- URL push (client-side only) ----------
  const pushUrlClientSide = () => {
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

    if (typeof window !== "undefined") {
      // push a new history entry
      window.history.pushState({}, "", path);

      // optional: change title to something helpful
      const prettyTitle = selectedBreed
        ? `${selectedBreed} for sale${selectedCity ? " in " + selectedCity : ""
        }`
        : "Dogs for sale";
      document.title = prettyTitle;
    }

    // UI is already updated via state.
  };

  // ---------- popstate handler: update UI when user presses back/forward ----------
  useEffect(() => {
    const onPop = () => {
      const parts = window.location.pathname.split("/").filter(Boolean);
      if (parts[0] !== "dogs") return;

      // parse breed & city
      const inIdx = parts.indexOf("in");
      const forSaleIdx = parts.indexOf("for-sale");

      let breed = "";
      let city = "";

      if (parts[1] && parts[1] !== "for-sale") {
        // candidate breed (parts[1])
        breed = unSlug(parts[1]);
      }

      if (inIdx !== -1 && parts.length > inIdx + 1) {
        city = unSlug(parts[inIdx + 1]);
      } else if (forSaleIdx !== -1 && parts.length > forSaleIdx + 1) {
        // uncommon structure, ignore
      }

      setSelectedBreed(breed || "");
      setSelectedCity(city || "");
      if (city) {
        const stateFound = findStateForCity(city);
        if (stateFound) setSelectedState(stateFound);
        else setSelectedState("");
      } else {
        // If city empty, keep existing selectedState or clear it if you prefer:
        // setSelectedState("");
      }
      // applyFilters is triggered by the watch useEffect
    };

    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Optionally parse initial location when component mounts so if user landed on /dogs it works,
  // but remember direct refresh on /dogs/german-shepherd/... will 404 unless you created route.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const parts = window.location.pathname.split("/").filter(Boolean);
    if (parts[0] !== "dogs") return;

    const inIdx = parts.indexOf("in");
    const forSaleIdx = parts.indexOf("for-sale");

    let breed = "";
    let city = "";

    if (parts[1] && parts[1] !== "for-sale") breed = unSlug(parts[1]);
    if (inIdx !== -1 && parts.length > inIdx + 1)
      city = unSlug(parts[inIdx + 1]);

    if (breed) setSelectedBreed(breed);
    if (city) {
      setSelectedCity(city);
      const stateFound = findStateForCity(city);
      if (stateFound) setSelectedState(stateFound);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- Render ----------
  return (
    <div className="min-h-screen font-raleway p-6 px-44 bg-orange-50">
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
              className={`${dropdownClass} ${openUp ? "bottom-full mb-1" : "top-full mt-1"
                }`}
              style={dropdownStyle}
            >
              {dogBreeds
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
                    className="px-3 py-2 hover:bg-[var(--color-primary)] hover:text-white cursor-pointer text-gray-800 transition-colors"
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
              className={`${dropdownClass} ${openUp ? "bottom-full mb-1" : "top-full mt-1"
                }`}
              style={dropdownStyle}
            >
              {Object.keys(statesWithCities).map((state) => (
                <li
                  key={state}
                  onClick={() => {
                    setSelectedState(state);
                    setSelectedCity("");
                    setShowStates(false);
                  }}
                  className="px-3 py-2 hover:bg-[var(--color-primary)] hover:text-white cursor-pointer text-gray-800 transition-colors"
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
              className={`${dropdownClass} ${openUp ? "bottom-full mb-1" : "top-full mt-1"
                }`}
              style={dropdownStyle}
            >
              {statesWithCities[selectedState].map((city) => (
                <li
                  key={city}
                  onClick={() => {
                    setSelectedCity(city);
                    setShowCities(false);
                  }}
                  className="px-3 py-2 hover:bg-[var(--color-primary)] hover:text-white cursor-pointer text-gray-800 transition-colors"
                >
                  {city}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 🔍 Search Button */}
        <button
          onClick={() => applyFilters()}
          className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-medium 
                  rounded-md px-18 py-2 flex items-center justify-center gap-2 
                  transition-all duration-200"
        >
          Search
        </button>
      </div>

      {/* 🔽 Main Layout (Sidebar + Content) */}
      <div className="max-w-7xl mx-auto flex gap-4">
        {/* 🧭 Sidebar */}
        <div className="w-60 ">
          {/* Clear All Filters */}
          <div className="px-3 py-2 shadow rounded-lg mb-3" style={{ background: 'var(--color-primary)' }}>
            <button
              onClick={() => {
                setSelectedBreed("");
                setSelectedState("");
                setSelectedCity("");
                setSelectedGender("");
                setSelectedFeature("");
                setSortBy("");
                setBudget(500000);
              }}
              className="w-full text-white text-sm font-semibold hover:bg-white hover:text-[var(--color-primary)] transition-all duration-200 py-1.5 rounded-md"
            >
              Clear All Filters
            </button>
          </div>

          {/* Active Filters Display */}
          {(selectedBreed || selectedState || selectedCity || selectedGender || selectedFeature || sortBy) && (
            <div className="px-5 py-3 shadow rounded-lg mb-3 bg-white border">
              <h3 className="text-gray-700 font-semibold text-sm mb-2">Active Filters:</h3>
              <div className="flex flex-wrap gap-2">
                {selectedBreed && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-[var(--color-primary)] text-white text-xs rounded-full">
                    {selectedBreed}
                    <button
                      onClick={() => setSelectedBreed("")}
                      className="ml-1 hover:bg-white hover:text-[var(--color-primary)] rounded-full w-4 h-4 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </span>
                )}
                {selectedState && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
                    {selectedState}
                    <button
                      onClick={() => { setSelectedState(""); setSelectedCity(""); }}
                      className="ml-1 hover:bg-white hover:text-blue-500 rounded-full w-4 h-4 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </span>
                )}
                {selectedCity && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                    {selectedCity}
                    <button
                      onClick={() => setSelectedCity("")}
                      className="ml-1 hover:bg-white hover:text-green-500 rounded-full w-4 h-4 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </span>
                )}
                {selectedGender && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-500 text-white text-xs rounded-full">
                    {selectedGender}
                    <button
                      onClick={() => setSelectedGender("")}
                      className="ml-1 hover:bg-white hover:text-purple-500 rounded-full w-4 h-4 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </span>
                )}
                {selectedFeature && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-500 text-white text-xs rounded-full">
                    {selectedFeature}
                    <button
                      onClick={() => setSelectedFeature("")}
                      className="ml-1 hover:bg-white hover:text-indigo-500 rounded-full w-4 h-4 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </span>
                )}
                {sortBy && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-500 text-white text-xs rounded-full">
                    Sort: {sortBy === 'priceLowHigh' ? 'Price ↑' : sortBy === 'priceHighLow' ? 'Price ↓' : sortBy === 'ageLowHigh' ? 'Age ↑' : sortBy === 'ageHighLow' ? 'Age ↓' : 'Newest'}
                    <button
                      onClick={() => setSortBy("")}
                      className="ml-1 hover:bg-white hover:text-gray-500 rounded-full w-4 h-4 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Sorted By */}
          <div className="px-5 py-5 shadow rounded-lg my-3" style={{ background: 'var(--gradient-hero)' }}>
            <div className="text-[var(--color-primary)] flex items-center justify-between">
              <h3 className="font-semibold text-base flex items-center gap-2 text-white">
                Sort By
              </h3>
              {sortBy && (
                <button
                  onClick={() => setSortBy("")}
                  className="text-xs text-gray-300 hover:text-white transition-colors"
                >
                  Clear
                </button>
              )}
            </div>

            <hr className="my-2 border-gray-400 mb-4" />

            <div className="space-y-3 text-white text-sm">
              <label className="flex items-center gap-2 font-semibold cursor-pointer">
                <input
                  type="radio"
                  name="sortBy"
                  value="priceLowHigh"
                  className="accent-[var(--color-primary)] w-4 h-4"
                  checked={sortBy === "priceLowHigh"}
                  onChange={() => setSortBy("priceLowHigh")}
                />
                Price Low to High
              </label>
              <hr className="border-gray-400" />
              <label className="flex items-center gap-2 font-semibold cursor-pointer">
                <input
                  type="radio"
                  name="sortBy"
                  value="priceHighLow"
                  className="accent-[var(--color-primary)] w-4 h-4"
                  checked={sortBy === "priceHighLow"}
                  onChange={() => setSortBy("priceHighLow")}
                />
                Price High to Low
              </label>
              <hr className="border-gray-400" />
              <label className="flex items-center gap-2 font-semibold cursor-pointer">
                <input
                  type="radio"
                  name="sortBy"
                  value="ageLowHigh"
                  className="accent-[var(--color-primary)] w-4 h-4"
                  checked={sortBy === "ageLowHigh"}
                  onChange={() => setSortBy("ageLowHigh")}
                />
                Age Low to High
              </label>
              <hr className="border-gray-400" />
              <label className="flex items-center gap-2 font-semibold cursor-pointer">
                <input
                  type="radio"
                  name="sortBy"
                  value="ageHighLow"
                  className="accent-[var(--color-primary)] w-4 h-4"
                  checked={sortBy === "ageHighLow"}
                  onChange={() => setSortBy("ageHighLow")}
                />
                Age High to Low
              </label>
              <hr className="border-gray-400" />
              <label className="flex items-center gap-2 font-semibold cursor-pointer">
                <input
                  type="radio"
                  name="sortBy"
                  value="newest"
                  className="accent-[var(--color-primary)] w-4 h-4"
                  checked={sortBy === "newest"}
                  onChange={() => setSortBy("newest")}
                />
                Whats New
              </label>
            </div>
          </div>
          <div className="px-5 py-5 shadow rounded-lg my-3" style={{ background: 'var(--gradient-hero)' }}>
            <div className="text-[var(--color-primary)] flex items-center justify-between">
              <h3 className="font-semibold text-base flex items-center gap-2 text-white">
                Gender
              </h3>
              {selectedGender && (
                <button
                  onClick={() => setSelectedGender("")}
                  className="text-xs text-gray-300 hover:text-white transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
            <hr className="my-2 border-gray-400 mb-4" />
            <div className="space-y-3 text-white text-sm">
              {genderOptions.map((opt, idx) => (
                <div key={opt}>
                  <label className="flex items-center gap-2 font-semibold cursor-pointer active:text-[var(--color-primary)]">
                    <input
                      type="radio"
                      name="gender"
                      value={opt}
                      className="accent-[var(--color-primary)] w-4 h-4 mb-2 "
                      checked={selectedGender === opt}
                      onChange={() => setSelectedGender(opt)}
                    />
                    {opt}
                  </label>
                  {idx < genderOptions.length - 1 && (
                    <hr className="border-gray-400 my-1.5" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Pet Features Section */}
          <div className="px-5 py-5 shadow rounded-lg my-3" style={{ background: 'var(--gradient-hero)' }}>
            <div className="text-[var(--color-primary)] flex items-center justify-between">
              <h3 className="font-semibold text-base flex items-center gap-2 text-white">
                Pet Features
              </h3>
              {selectedFeature && (
                <button
                  onClick={() => setSelectedFeature("")}
                  className="text-xs text-gray-300 hover:text-white transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
            <hr className="my-2 border-gray-400 mb-4" />
            <div className="space-y-3 text-white text-sm">
              {featureOptions.map((opt, idx) => (
                <div key={opt}>
                  <label className="flex items-center gap-2 font-semibold cursor-pointer mb-2">
                    <input
                      type="radio"
                      name="feature"
                      value={opt}
                      className="accent-[var(--color-primary)] w-4 h-4"
                      checked={selectedFeature === opt}
                      onChange={() => setSelectedFeature(opt)}
                    />
                    {opt}
                  </label>
                  {idx < featureOptions.length - 1 && (
                    <hr className="border-gray-400 my-1.5" />
                  )}
                </div>
              ))}
            </div>
          </div>
          {/* 💰 Budget Range */}
          <div className="mb-5 px-5 py-5 shadow rounded-lg" style={{ background: 'var(--gradient-hero)' }}>
            <h3 className="text-white font-semibold flex items-center gap-2 mb-3">
              <FiDollarSign className="text-[var(--color-primary)]" /> Budget
            </h3>
            <input
              type="range"
              min="0"
              max="1000000"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full appearance-none h-2 bg-gray-600 rounded-lg accent-[var(--color-primary)] cursor-pointer outline-none"
            />
            <div className="flex justify-between font-semibold text-white mt-2">
              <p>0</p>
              <p>10L</p>
            </div>
            <p className="text-sm text-gray-300 mt-2">
              Your Budget: <span className="font-semibold text-white">{budget} PKR</span>
            </p>
          </div>

          {/* 🔥 Popular Breeds */}
          <div className="px-5 py-5 shadow rounded-lg my-3" style={{ background: 'var(--gradient-hero)' }}>
            <h3 className="text-white font-semibold flex items-center gap-2 mb-3">
              <FaFire className="text-[var(--color-primary)]" /> Popular Breeds
            </h3>
            <div className="space-y-2">
              {popularBreeds.map((breed, i) => {
                const breedCount = apiData.filter((p) => p.breed === breed).length;
                return (
                  <div
                    key={i}
                    onClick={() => setSelectedBreed(breed)}
                    className="hover:text-[var(--color-primary)] cursor-pointer text-sm flex gap-2 text-white transition-colors"
                  >
                    <span>{breed}</span>
                    <span className="text-gray-300">({breedCount})</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 🐶 Pets Grid */}
        <div className="flex-1">
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
              <span className="hover:text-[var(--color-primary)] cursor-pointer transition-colors">
                Home
              </span>
              <span>→</span>
              <span className="hover:text-[var(--color-primary)] cursor-pointer transition-colors">
                Dogs
              </span>
              <span>→</span>
              <span className="text-[var(--color-primary)] font-medium">
                {selectedBreed
                  ? `${selectedBreed} for Sale`
                  : "All Dogs for Sale"}
              </span>
            </div>

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent mb-2" style={{ color: "var(--gradient-hero)" }}>
                  {selectedBreed
                    ? `${selectedBreed} For Sale`
                    : "Dogs For Sale"}
                </h1>
                {/* <p className="text-gray-600 flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600 font-semibold text-sm">
                    {loading ? '...' : totalAds}
                  </span>
                  Premium pets available near you
                </p> */}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {loading ? (
              // Loading state
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="rounded-2xl overflow-hidden shadow-sm animate-pulse" style={{ background: 'var(--gradient-hero)' }}>
                  <div className="h-64 bg-gray-600"></div>
                  <div className="p-5">
                    <div className="h-6 bg-gray-600 rounded mb-3"></div>
                    <div className="space-y-2.5 mb-4">
                      <div className="flex justify-between">
                        <div className="h-4 bg-gray-600 rounded w-16"></div>
                        <div className="h-4 bg-gray-600 rounded w-20"></div>
                      </div>
                      <div className="flex justify-between">
                        <div className="h-4 bg-gray-600 rounded w-20"></div>
                        <div className="h-4 bg-gray-600 rounded w-24"></div>
                      </div>
                      <div className="flex justify-between">
                        <div className="h-4 bg-gray-600 rounded w-16"></div>
                        <div className="h-4 bg-gray-600 rounded w-18"></div>
                      </div>
                    </div>
                    <div className="h-10 bg-gray-600 rounded-lg"></div>
                  </div>
                </div>
              ))
            ) : filteredPetsList.length === 0 ? (
              <div className="col-span-3 text-center py-20">
                <div className="text-6xl mb-4">🐕</div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                  No pets found
                </h3>
                <p className="text-gray-500">Try adjusting your filters</p>
              </div>
            ) : (
              filteredPetsList.map((pet) => (
                <div
                  key={pet.id || pet._id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                 <div className="relative overflow-hidden">
                    <img
                      src={pet.img || pet.images?.[0] || '/default-pet.jpg'}
                      alt={pet.name}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />                    {/* <div className="absolute top-3 left-3">
                      <span className="px-3 py-1.5 bg-white/95 backdrop-blur-sm text-purple-600 text-xs font-semibold rounded-full shadow-lg">
                        :star: Premium
                      </span>
                    </div> */}
                  </div>           
                  
                  
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-purple-600 transition-colors">
                      {pet.name}
                    </h3>                    <div className="space-y-2.5 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Breed</span>
                        <span className="font-semibold text-gray-800">
                          {pet.breed}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Gender & Age</span>
                        <span className="font-semibold text-gray-800">
                          {pet.gender}, {pet.age} {pet.age === 1 ? 'month' : 'months'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Location</span>
                        <span className="font-semibold text-purple-600">
                          {pet.city}
                        </span>
                      </div>
                    </div>                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <a
                        href={`tel:${pet.contactNumber}`}
                        className="px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium text-center flex items-center justify-center gap-1"
                      >
                        <FiPhone className="text-sm" />
                        Call
                      </a>
                      <a
                        href={`https://wa.me/${pet.contactNumber}?text=${encodeURIComponent('Hi, I saw your ad, I am interested')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium text-center flex items-center justify-center gap-1"
                      >
                        <SiWhatsapp className="text-sm" />
                        Chat
                      </a>
                      {/* <a
                        href={`/dogs/pet/${pet._id || pet.id}`}
                        className="px-3 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors text-sm font-medium text-center flex items-center justify-center gap-1"
                      >
                        <FiInfo className="text-sm" />
                        Info
                      </a> */}

<button
  type="button"
  onClick={() => handleViewPet(pet)}
  className="px-3 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors text-sm font-medium text-center flex items-center justify-center gap-1 cursor-pointer"
>
  <FiInfo className="text-sm" />
  Info
</button>         </div>
                    <button className="w-full py-3 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-[1.02]" style={{ background: "var(--gradient-hero" }}>
                      {pet.price?.toLocaleString() || 'N/A'} PKR
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-4">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`px-6 py-2.5 rounded-full font-medium transition-all duration-200 ${currentPage === 1
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "text-white hover:bg-[var(--color-primary-hover)] shadow-sm hover:shadow-md hover:scale-105"
                  }`}
                style={currentPage !== 1 ? { background: 'var(--bg-dark-accent)' } : {}}
              >
                Previous
              </button>

              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-full font-semibold transition-all duration-200 ${currentPage === page
                          ? "bg-[var(--color-primary)] text-white shadow-lg scale-110"
                          : "text-white hover:bg-[var(--color-primary-hover)] hover:text-white"
                        }`}
                      style={currentPage !== page ? { background: 'var(--bg-dark-accent)' } : {}}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage >= totalPages}
                className={`px-6 py-2.5 rounded-full font-medium transition-all duration-200 ${currentPage >= totalPages
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "text-white hover:bg-[var(--color-primary-hover)] shadow-sm hover:shadow-md hover:scale-105"
                  }`}
                style={currentPage < totalPages ? { background: 'var(--bg-dark-accent)' } : {}}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
