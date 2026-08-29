"use client";

import Image from "next/image";
import React from "react";

const considerations = [
  {
    title: "Indoor vs. Outdoor Needs",
    desc: "Most purebred cats are best kept indoors.",
  },
  {
    title: "Grooming & Maintenance",
    desc: "Persian cats need regular grooming; British Shorthairs are low-maintenance.",
  },
  {
    title: "Temperament",
    desc: "Long-haired breeds prefer cooler homes; shorthairs adapt better to Indian summers.",
  },
  {
    title: "Climate Suitability",
    desc: "Choose breeds suited to Indian weather, Dobermans for heat, Huskies for colder regions.",
  },
  {
    title: "Time Commitment",
    desc: "Some cats are independent, others need constant affection. Choose based on your availability and lifestyle.",
  },
  {
    title: "Budget",
    desc: "Consider not only purchase cost but also ongoing vet care, grooming, and food expenses.",
  },
];

export default function ThingsToConsider() {
  return (
    <section className="px-6 md:px-16 lg:px-52 py-16 text-gray-800 bg-white">
      <div className=" mb-10">
        <h2 className="text-3xl font-medium mb-2">
          Things To Consider While Selecting a Cat Breed
        </h2>
        <p className="text-gray-500 text-sm md:text-base">
          Choosing the right cat starts with your lifestyle. Here’s what to keep
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
