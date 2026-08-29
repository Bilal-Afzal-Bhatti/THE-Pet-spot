"use client";

import Image from "next/image";
import React from "react";

const considerations = [
  {
    title: "Home Size & Space",
    desc: "Small breeds like Pugs suit apartments, while larger breeds like Labradors or German Shepherds need more space.",
  },
  {
    title: "Family Compatibility",
    desc: "For homes with kids or elderly, friendly breeds like Beagles or Golden Retrievers are ideal.",
  },
  {
    title: "Activity Level",
    desc: "Active owners can go for energetic breeds like Border Collies; calm personalities may prefer Basset Hounds.",
  },
  {
    title: "Climate Suitability",
    desc: "Choose breeds suited to Indian weather, Dobermans for heat, Huskies for colder regions.",
  },
  {
    title: "Budget & Maintenance",
    desc: "Consider ongoing costs like food, grooming, and vet visits. Pick based on your lifestyle and financial comfort.",
  },
  {
    title: "Purpose & Trainability",
    desc: "First-time owners should consider easy-to-train breeds like Labradors or Poodles. Select based on whether you want a guard dog, companion, or therapy dog.",
  },
];

export default function ThingsToConsider() {
  return (
    <section className="px-6 md:px-16 lg:px-52 py-16 text-white" style={{background: 'var(--gradient-hero)'}}>
      <div className=" mb-10">
        <h2 className="text-3xl font-medium mb-2">
          Things To Consider While Selecting a Dog Breed
        </h2>
        <p className="text-gray-500 text-sm md:text-base">
          Choosing the right dog starts with your lifestyle. Here’s what to keep
          in mind:
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {considerations.map((item, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg h-52 p-6 bg-white relative overflow-hidden"
          >
            <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
            <p className="text-black text-base leading-relaxed">{item.desc}</p>
            <Image
              src="/shape_paw.svg"
              alt="paws"
              width={80}
              height={80}
              className="absolute -right-2 -bottom-2 "
            />
          </div>
        ))}
      </div>
    </section>
  );
}
