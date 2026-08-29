"use client";
import Image from "next/image";
import React from "react";

const WinningFormula = () => {
  const stepsLeft = [
    {
      id: 1,
      title: "Confirmation",
      desc: "Our post-sales team confirms your chosen furbaby and forwards it for expert checks.",
    },
    {
      id: 2,
      title: "Expert Health Screening",
      desc: "MMP pet experts perform a 20+ parameter health assessment for initial evaluation.",
    },
    {
      id: 3,
      title: "Vet Check & Vaccination",
      desc: "A certified vet conducts a full-body checkup, vaccinations, and parvo testing.",
    },
  ];

  const stepsRight = [
    {
      id: 4,
      title: "Travel Planning",
      desc: "We plan your pet’s journey considering health, festivals, weather, and other factors.",
    },
    {
      id: 5,
      title: "Live Journey Updates",
      desc: "Receive feeding videos and real-time updates as your furbaby travels to you.",
    },
    {
      id: 6,
      title: "Post-Arrival Support",
      desc: "Once your pet arrives, we offer complete guidance to support your parenting journey.",
    },
  ];

  return (
    <section className="bg-[#FFF6F0] py-16 px-6 lg:px-44">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-semibold text-gray-900">
          Our Winning Formula
        </h2>
        <p className="text-gray-600 mt-2">
          MMP ensures quality, safety, and love in every step of your pet’s
          journey.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16">
        {/* LEFT SIDE */}
        <div className="flex flex-col gap-6 w-full lg:w-1/3">
          {stepsLeft.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 flex items-start gap-4"
            >
              <div className="bg-[#FDDDC6] text-white font-bold w-8 h-8 flex items-center justify-center rounded-full text-sm text-[#E4823A] shrink-0">
                {item.id}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CENTER IMAGE */}
        <div className="relative w-full lg:w-1/3 flex justify-center">
          <Image
            src="/combodog.svg" // ⬅️ Replace this with your uploaded pet image name
            alt="Pets Group"
            width={350}
            height={350}
            className="object-contain"
          />
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col gap-6 w-full lg:w-1/3">
          {stepsRight.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 flex items-start gap-4"
            >
              <div className="bg-[#FFCEA7] text-white font-bold w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium shrink-0">
                {item.id}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WinningFormula;
