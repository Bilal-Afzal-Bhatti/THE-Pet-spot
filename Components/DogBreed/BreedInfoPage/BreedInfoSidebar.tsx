"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function BreedInfoSidebar() {
  const params = useParams();
  const breedParam = params?.breed;
  const breed =
    typeof breedParam === "string"
      ? breedParam
      : Array.isArray(breedParam)
      ? breedParam[0]
      : "";
  const router = useRouter();
  const [selectedBreed, setSelectedBreed] = useState("");

  const dogs = [
    "Labrador Retriever",
    "German Shepherd",
    "Golden Retriever",
    "Pug",
    "Bulldog",
    "Beagle",
  ];

  // When user selects a breed → navigate
  const handleBreedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const breed = e.target.value;
    setSelectedBreed(breed);

    if (breed) {
      const slug = breed.toLowerCase().replace(/\s+/g, "-");
      router.push(`/dog-breed/${slug}`);
    }
  };

  // Navigate to sale page
  const handleViewClick = () => {
    if (breed) {
      const slug = breed.toLowerCase().replace(/\s+/g, "-");
      router.push(`/dogs/${slug}/for-sale`);
    } else {
      router.push(`/dogs`);
    }
  };

  return (
    <aside className="w-full px-4">
      <h3 className="font-semibold mb-3 text-(--color-primary-hover)">Choose Your Breed</h3>

      <select
        value={selectedBreed}
        onChange={handleBreedChange}
        className="rounded-md border border-gray-300 p-3 w-full font-medium text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#018F98]"
      >
        <option value="">Select a Dog Breed</option>
        {dogs.map((breed) => (
          <option key={breed} value={breed}>
            {breed}
          </option>
        ))}
      </select>

      <div
        onClick={handleViewClick}
        className=" block w-full text-white text-center px-6 py-4 rounded my-5 font-medium cursor-pointer hover:bg-[#027B82] transition-colors"
        style={{background: "var(--gradient-hero)"}}
      >
        View {breed ? `${breed} Puppies` : "All Dogs"}
      </div>

      <h3 className="text-2xl font-semibold mb-3 text-(--color-primary-hover)">
        Why Choose Pets Corner?
      </h3>

      {/* === Why Choose MMP Section === */}
      <div className="space-y-5 text-gray-700 leading-relaxed">
        <div>
          <h4 className="font-semibold text-lg text-gray-900">Healthy Pet</h4>
          <p className="text-sm mt-1">
            Being pet lovers ourselves, we understand the importance of a pet’s
            health. All our puppies are at least eight weeks old when they are
            sent to you. Before your bundle of joy reaches you, they undergo a
            complete health checkup by a licensed veterinarian.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-lg text-gray-900">
            Vaccinated & Insured Pet
          </h4>
          <p className="text-sm mt-1">
            To make your first experience with your furry family member smooth
            and worry-free, we ensure that all our puppies are up-to-date on
            their vaccinations and are fully insured.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-lg text-gray-900">
            Responsible Breeders
          </h4>
          <p className="text-sm mt-1">
            All our puppies are raised by responsible breeders who prioritize
            their pet’s health above all. We strictly oppose puppy mills — every
            breeder we work with is a genuine pet lover committed to finding the
            best homes for their fur babies.
          </p>
        </div>
      </div>
    </aside>
  );
}
