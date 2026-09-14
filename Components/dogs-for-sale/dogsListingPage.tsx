"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { FiMapPin, FiPlus, FiDollarSign, FiPhone, FiInfo } from "react-icons/fi";
import { FaDog, FaFire } from "react-icons/fa";
import { SiWhatsapp } from "react-icons/si";
import { useAdStore } from "@/Store/AdsStore";
import { pets, breeds, popularBreeds, statesWithCities } from "./data"; // adjust path if needed
import { dogBreeds } from "@/utils/breeds";

// ---------- Tiny shimmer placeholder for next/image (industry-standard blur-up) ----------
const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#eee" offset="20%" />
      <stop stop-color="#ddd" offset="50%" />
      <stop stop-color="#eee" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#eee" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite" />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === "undefined" ? Buffer.from(str).toString("base64") : window.btoa(str);

const shimmerURL = (w: number, h: number) => `data:image/svg+xml;base64,${toBase64(shimmer(w, h))}`;

// ---------- Framer Motion variants ----------
const gridVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

const dropdownVariants: Variants = {
  hidden: { opacity: 0, y: -6, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.15, ease: "easeOut" } },
  exit: { opacity: 0, y: -6, scale: 0.98, transition: { duration: 0.1 } },
};

const sidebarCardVariants: Variants = {
  hidden: { opacity: 0, x: -16 },
  show: (delay: number = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, delay, ease: "easeOut" },
  }),
};

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

    const petId = pet._id || pet.id;
    if (typeof window !== "undefined") {
      sessionStorage.setItem("selectedPetData", JSON.stringify(pet));
      sessionStorage.setItem("currentPetId", petId);
    }

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
        console.error("Failed to fetch approved dog ads:", error);
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

    if (selectedBreed && selectedBreed.trim() !== "") {
      const q = selectedBreed.trim().toLowerCase();
      result = result.filter(
        (p) => p.breed.toLowerCase().includes(q) || p.name.toLowerCase().includes(q)
      );
    }

    if (selectedCity) {
      result = result.filter((p) => p.city === selectedCity);
    } else if (selectedState) {
      const cities = statesWithCities[selectedState as keyof typeof statesWithCities] || [];
      if (cities.length > 0) {
        result = result.filter((p) => cities.includes(p.city) || p.city === selectedState);
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
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    setFilteredPetsList(result);
  };

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBreed, selectedState, selectedCity, budget, selectedGender, selectedFeature, sortBy, apiData]);

  const dropdownClass = `absolute z-20 left-0 w-full bg-white border border-gray-300 rounded-md max-h-48 overflow-y-auto shadow-lg`;
  const dropdownStyle = { background: "white" };

  // ---------- URL push (client-side only) ----------
  const pushUrlClientSide = () => {
    applyFilters();

    const breedSlug = slugify(selectedBreed);
    const citySlug = slugify(selectedCity);

    let path = "/dogs/for-sale";
    if (breedSlug && citySlug) {
      path = `/dogs/${breedSlug}/for-sale/in/${citySlug}`;
    } else if (breedSlug) {
      path = `/dogs/${breedSlug}/for-sale`;
    } else if (citySlug) {
      path = `/dogs/for-sale/in/${citySlug}`;
    }

    if (typeof window !== "undefined") {
      window.history.pushState({}, "", path);
      const prettyTitle = selectedBreed
        ? `${selectedBreed} for sale${selectedCity ? " in " + selectedCity : ""}`
        : "Dogs for sale";
      document.title = prettyTitle;
    }
  };

  // ---------- popstate handler ----------
  useEffect(() => {
    const onPop = () => {
      const parts = window.location.pathname.split("/").filter(Boolean);
      if (parts[0] !== "dogs") return;

      const inIdx = parts.indexOf("in");
      const forSaleIdx = parts.indexOf("for-sale");

      let breed = "";
      let city = "";

      if (parts[1] && parts[1] !== "for-sale") {
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
      }
    };

    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const parts = window.location.pathname.split("/").filter(Boolean);
    if (parts[0] !== "dogs") return;

    const inIdx = parts.indexOf("in");

    let breed = "";
    let city = "";

    if (parts[1] && parts[1] !== "for-sale") breed = unSlug(parts[1]);
    if (inIdx !== -1 && parts.length > inIdx + 1) city = unSlug(parts[inIdx + 1]);

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
    <div className="min-h-screen font-raleway p-4 sm:p-6 px-4 sm:px-8 lg:px-20 xl:px-44 bg-orange-50">
      {/* 🔍 Integrated Search Bar */}
      <div
        ref={searchRef}
        className="w-full max-w-6xl mx-auto bg-white border border-gray-200 
        rounded-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 
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
          <AnimatePresence>
            {showBreeds && (
              <motion.ul
                variants={dropdownVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                className={`${dropdownClass} ${openUp ? "bottom-full mb-1" : "top-full mt-1"}`}
                style={dropdownStyle}
              >
                {dogBreeds
                  .filter((b) => b.toLowerCase().includes(selectedBreed.toLowerCase()))
                  .map((breed) => (
                    <li
                      key={breed}
                      onClick={() => {
                        setSelectedBreed(breed);
                        setShowBreeds(false);
                      }}
                      className="px-3 py-2 hover:bg-(--color-primary) hover:text-white cursor-pointer text-gray-800 transition-colors"
                    >
                      {breed}
                    </li>
                  ))}
              </motion.ul>
            )}
          </AnimatePresence>
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
          <AnimatePresence>
            {showStates && (
              <motion.ul
                variants={dropdownVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                className={`${dropdownClass} ${openUp ? "bottom-full mb-1" : "top-full mt-1"}`}
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
                    className="px-3 py-2 hover:bg-(--color-primary) hover:text-white cursor-pointer text-gray-800 transition-colors"
                  >
                    {state}
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
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
          <AnimatePresence>
            {showCities && selectedState && (
              <motion.ul
                variants={dropdownVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                className={`${dropdownClass} ${openUp ? "bottom-full mb-1" : "top-full mt-1"}`}
                style={dropdownStyle}
              >
                {statesWithCities[selectedState as keyof typeof statesWithCities].map((city) => (
                  <li
                    key={city}
                    onClick={() => {
                      setSelectedCity(city);
                      setShowCities(false);
                    }}
                    className="px-3 py-2 hover:bg-(--color-primary) hover:text-white cursor-pointer text-gray-800 transition-colors"
                  >
                    {city}
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        {/* 🔍 Search Button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => applyFilters()}
          className="w-full md:w-auto bg-(--color-primary) hover:bg-(--color-primary-hover) text-white font-medium 
          rounded-md px-6 md:px-18 py-2.5 flex items-center justify-center gap-2 
          transition-colors duration-200 shrink-0"
        >
          Search
        </motion.button>
      </div>

      {/* 🔽 Combined Layout: Sidebar (left on lg+) + Pets Grid (right on lg+) */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
        {/* 🧭 Sidebar — order-2 on mobile (after grid), order-1 on lg+ (left) */}
        <div className="w-full lg:w-60 shrink-0 order-2 lg:order-1">
          {/* Clear All Filters */}
          <motion.div
            variants={sidebarCardVariants}
            custom={0}
            initial="hidden"
            animate="show"
            className="px-3 py-2 shadow rounded-lg mb-3"
            style={{ background: "var(--color-primary)" }}
          >
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
              className="w-full text-white text-sm font-semibold hover:bg-white hover:text-(--color-primary) transition-all duration-200 py-1.5 rounded-md"
            >
              Clear All Filters
            </button>
          </motion.div>

          {/* Active Filters Display */}
          <AnimatePresence>
            {(selectedBreed || selectedState || selectedCity || selectedGender || selectedFeature || sortBy) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="px-5 py-3 shadow rounded-lg mb-3 bg-white border overflow-hidden"
              >
                <h3 className="text-gray-700 font-semibold text-sm mb-2">Active Filters:</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedBreed && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-(--color-primary) text-white text-xs rounded-full">
                      {selectedBreed}
                      <button
                        onClick={() => setSelectedBreed("")}
                        className="ml-1 hover:bg-white hover:text-(--color-primary) rounded-full w-4 h-4 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {selectedState && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
                      {selectedState}
                      <button
                        onClick={() => {
                          setSelectedState("");
                          setSelectedCity("");
                        }}
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
                      Sort:{" "}
                      {sortBy === "priceLowHigh"
                        ? "Price ↑"
                        : sortBy === "priceHighLow"
                        ? "Price ↓"
                        : sortBy === "ageLowHigh"
                        ? "Age ↑"
                        : sortBy === "ageHighLow"
                        ? "Age ↓"
                        : "Newest"}
                      <button
                        onClick={() => setSortBy("")}
                        className="ml-1 hover:bg-white hover:text-gray-500 rounded-full w-4 h-4 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </span>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sorted By */}
          <motion.div
            variants={sidebarCardVariants}
            custom={0.05}
            initial="hidden"
            animate="show"
            className="px-5 py-5 shadow rounded-lg my-3"
            style={{ background: "var(--gradient-hero)" }}
          >
            <div className="text-(--color-primary) flex items-center justify-between">
              <h3 className="font-semibold text-base flex items-center gap-2 text-white">Sort By</h3>
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
                  className="accent-(--color-primary) w-4 h-4"
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
                  className="accent-(--color-primary) w-4 h-4"
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
                  className="accent-(--color-primary) w-4 h-4"
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
                  className="accent-(--color-primary) w-4 h-4"
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
                  className="accent-(--color-primary) w-4 h-4"
                  checked={sortBy === "newest"}
                  onChange={() => setSortBy("newest")}
                />
                Whats New
              </label>
            </div>
          </motion.div>

          {/* Gender */}
          <motion.div
            variants={sidebarCardVariants}
            custom={0.1}
            initial="hidden"
            animate="show"
            className="px-5 py-5 shadow rounded-lg my-3"
            style={{ background: "var(--gradient-hero)" }}
          >
            <div className="text-(--color-primary) flex items-center justify-between">
              <h3 className="font-semibold text-base flex items-center gap-2 text-white">Gender</h3>
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
                  <label className="flex items-center gap-2 font-semibold cursor-pointer active:text-(--color-primary)">
                    <input
                      type="radio"
                      name="gender"
                      value={opt}
                      className="accent-(--color-primary) w-4 h-4 mb-2 "
                      checked={selectedGender === opt}
                      onChange={() => setSelectedGender(opt)}
                    />
                    {opt}
                  </label>
                  {idx < genderOptions.length - 1 && <hr className="border-gray-400 my-1.5" />}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Pet Features Section */}
          <motion.div
            variants={sidebarCardVariants}
            custom={0.15}
            initial="hidden"
            animate="show"
            className="px-5 py-5 shadow rounded-lg my-3"
            style={{ background: "var(--gradient-hero)" }}
          >
            <div className="text-(--color-primary) flex items-center justify-between">
              <h3 className="font-semibold text-base flex items-center gap-2 text-white">Pet Features</h3>
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
                      className="accent-(--color-primary) w-4 h-4"
                      checked={selectedFeature === opt}
                      onChange={() => setSelectedFeature(opt)}
                    />
                    {opt}
                  </label>
                  {idx < featureOptions.length - 1 && <hr className="border-gray-400 my-1.5" />}
                </div>
              ))}
            </div>
          </motion.div>

          {/* 💰 Budget Range */}
          <motion.div
            variants={sidebarCardVariants}
            custom={0.2}
            initial="hidden"
            animate="show"
            className="mb-5 px-5 py-5 shadow rounded-lg"
            style={{ background: "var(--gradient-hero)" }}
          >
            <h3 className="text-white font-semibold flex items-center gap-2 mb-3">
              <FiDollarSign className="text-(--color-primary)" /> Budget
            </h3>
            <input
              type="range"
              min="0"
              max="1000000"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full appearance-none h-2 bg-gray-600 rounded-lg accent-(--color-primary) cursor-pointer outline-none"
            />
            <div className="flex justify-between font-semibold text-white mt-2">
              <p>0</p>
              <p>10L</p>
            </div>
            <p className="text-sm text-gray-300 mt-2">
              Your Budget: <span className="font-semibold text-white">{budget} PKR</span>
            </p>
          </motion.div>

          {/* 🔥 Popular Breeds */}
          <motion.div
            variants={sidebarCardVariants}
            custom={0.25}
            initial="hidden"
            animate="show"
            className="px-5 py-5 shadow rounded-lg my-3"
            style={{ background: "var(--gradient-hero)" }}
          >
            <h3 className="text-white font-semibold flex items-center gap-2 mb-3">
              <FaFire className="text-(--color-primary)" /> Popular Breeds
            </h3>
            <div className="space-y-2">
              {popularBreeds.map((breed, i) => {
                const breedCount = apiData.filter((p) => p.breed === breed).length;
                return (
                  <div
                    key={i}
                    onClick={() => setSelectedBreed(breed)}
                    className="hover:text-(--color-primary) cursor-pointer text-sm flex gap-2 text-white transition-colors"
                  >
                    <span>{breed}</span>
                    <span className="text-gray-300">({breedCount})</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* 🐶 Pets Grid — order-1 on mobile (shows first), order-2 on lg+ (right side) */}
        <div className="flex-1 order-1 lg:order-2">
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
              <span className="hover:text-(--color-primary) cursor-pointer transition-colors">Home</span>
              <span>→</span>
              <span className="hover:text-(--color-primary) cursor-pointer transition-colors">Dogs</span>
              <span>→</span>
              <span className="text-(--color-primary) font-medium">
                {selectedBreed ? `${selectedBreed} for Sale` : "All Dogs for Sale"}
              </span>
            </div>

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <h1
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent mb-2"
                  style={{ color: "var(--gradient-hero)" }}
                >
                  {selectedBreed ? `${selectedBreed} For Sale` : "Dogs For Sale"}
                </h1>
              </div>
            </div>
          </div>

          <motion.div
            variants={gridVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {loading ? (
              // Loading skeleton — kept as instant CSS pulse, no motion delay, for perceived speed
              Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-2xl overflow-hidden shadow-sm animate-pulse"
                  style={{ background: "var(--gradient-hero)" }}
                >
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
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-1 sm:col-span-2 lg:col-span-3 text-center py-20"
              >
                <div className="text-6xl mb-4">🐕</div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">No pets found</h3>
                <p className="text-gray-500">Try adjusting your filters</p>
              </motion.div>
            ) : (
              <AnimatePresence mode="popLayout">
                {filteredPetsList.map((pet, index) => (
                  <motion.div
                    key={pet.id || pet._id}
                    layout
                    variants={cardVariants}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    whileHover={{ y: -6 }}
                    transition={{ layout: { duration: 0.3 } }}
                    className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="relative overflow-hidden h-64 w-full bg-gray-100">
                      <Image
                        src={pet.img || pet.images?.[0] || "/default-pet.jpg"}
                        alt={pet.name || "Pet for sale"}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        // First row of cards (above the fold) loads eagerly for a fast LCP;
                        // everything else lazy-loads automatically (next/image default).
                        priority={index < 3}
                        loading={index < 3 ? "eager" : "lazy"}
                        placeholder="blur"
                        blurDataURL={shimmerURL(400, 256)}
                        quality={75}
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </div>

                    <div className="p-5">
                      <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-purple-600 transition-colors">
                        {pet.name}
                      </h3>
                      <div className="space-y-2.5 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Breed</span>
                          <span className="font-semibold text-gray-800">{pet.breed}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Gender & Age</span>
                          <span className="font-semibold text-gray-800">
                            {pet.gender}, {pet.age} {pet.age === 1 ? "month" : "months"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Location</span>
                          <span className="font-semibold text-purple-600">{pet.city}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mb-3 text-xs sm:text-sm">
                        <a
                          href={`tel:${pet.contactNumber}`}
                          className="px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium text-center flex items-center justify-center gap-1"
                        >
                          <FiPhone className="text-sm" />
                          Call
                        </a>
                        <a
                          href={`https://wa.me/${pet.contactNumber}?text=${encodeURIComponent(
                            "Hi, I saw your ad, I am interested"
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium text-center flex items-center justify-center gap-1"
                        >
                          <SiWhatsapp className="text-sm" />
                          Chat
                        </a>
                        <button
                          type="button"
                          onClick={() => handleViewPet(pet)}
                          className="px-3 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors text-sm font-medium text-center flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <FiInfo className="text-sm" />
                          Info
                        </button>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-3 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow duration-200"
                        style={{ background: "var(--gradient-hero)" }}
                      >
                        {pet.price?.toLocaleString() || "N/A"} PKR
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </motion.div>

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-4">
              <motion.button
                whileHover={currentPage !== 1 ? { scale: 1.05 } : {}}
                whileTap={currentPage !== 1 ? { scale: 0.95 } : {}}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`px-6 py-2.5 rounded-full font-medium transition-colors duration-200 ${
                  currentPage === 1
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "text-white hover:bg-(--color-primary-hover) shadow-sm hover:shadow-md"
                }`}
                style={currentPage !== 1 ? { background: "var(--bg-dark-accent)" } : {}}
              >
                Previous
              </motion.button>

              <div className="flex items-center gap-2 overflow-x-auto max-w-full px-1 py-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <motion.button
                    key={page}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-full font-semibold transition-colors duration-200 ${
                      currentPage === page
                        ? "bg-(--color-primary) text-white shadow-lg"
                        : "text-white hover:bg-(--color-primary-hover) hover:text-white"
                    }`}
                    style={currentPage !== page ? { background: "var(--bg-dark-accent)" } : {}}
                    animate={currentPage === page ? { scale: 1.1 } : { scale: 1 }}
                  >
                    {page}
                  </motion.button>
                ))}
              </div>

              <motion.button
                whileHover={currentPage < totalPages ? { scale: 1.05 } : {}}
                whileTap={currentPage < totalPages ? { scale: 0.95 } : {}}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className={`px-6 py-2.5 rounded-full font-medium transition-colors duration-200 ${
                  currentPage >= totalPages
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "text-white hover:bg-(--color-primary-hover) shadow-sm hover:shadow-md"
                }`}
                style={currentPage < totalPages ? { background: "var(--bg-dark-accent)" } : {}}
              >
                Next
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}