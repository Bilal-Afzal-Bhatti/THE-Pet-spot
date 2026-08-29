// Next.js + Tailwind FAQ page component
// Usage: Drop this file as `pages/index.jsx` in a Next.js project with Tailwind CSS configured.
// It is a self-contained component that renders an FAQ accordion with 10 items (all closed by default).
// Clicking anywhere on a question row toggles its answer. Multiple items can be open at once.
"use client";
import { useState } from "react";

export default function FAQPage() {
  const [open, setOpen] = useState<Record<number, boolean>>({});

  const toggle = (i: number) => {
    setOpen((prev) => ({ ...prev, [i]: !prev[i] }));
  };

  const faqs = [
    {
      q: "Should I get a dog?",
      a: "Dogs need time, care, patience, and consistent love. If you can provide a stable home, daily attention, and long-term responsibility, getting a dog can be one of the most rewarding decisions you'll ever make.",
    },
    {
      q: "How much does a dog cost in India?",
      a: "Price varies by breed, age, and seller — from low-cost adoption fees to several lakhs for rare pedigree pups. Consider lifetime costs (food, vet, grooming) too.",
    },
    {
      q: "Where can I get dogs in India from?",
      a: "You can adopt from local shelters, rescue groups, or buy from registered breeders. Always verify breeder credentials and prioritise adoption.",
    },
    {
      q: "Is it safe to buy dogs online in India?",
      a: "Buying online is possible but requires caution — verify seller reviews, request health records, and prefer meet-and-greet before payment.",
    },
    {
      q: "Why is Pets Corner a reliable option to buy dogs online in India?",
      a: "We list verified breeders, provide health reports, and enable secure communication between buyers and sellers (example placeholder answer).",
    },
    {
      q: "How do I prepare my home for a new dog?",
      a: "Dog-proofing your home, setting up a sleeping area, buying essentials (collar, leash, bowls), and scheduling a vet check are good first steps.",
    },
    {
      q: "What vaccinations does a puppy need?",
      a: "Puppies require core vaccines (distemper, parvo, hepatitis, rabies) and boosters — consult your vet for a schedule.",
    },
    {
      q: "How often should I groom my dog?",
      a: "Grooming frequency depends on coat type: short-haired dogs monthly, long-haired dogs weekly, and regular nail trims and ear cleaning as needed.",
    },
    {
      q: "Can I travel with my dog on public transport?",
      a: "Rules vary by city and transport provider. Many public systems require muzzles or carriers — check local regulations.",
    },
    {
      q: "What is the average lifespan of common dog breeds?",
      a: "Small breeds often live longer (12–16 years) while larger breeds have shorter lifespans (8–12 years). Many factors like genetics and care affect lifespan.",
    },
  ];

  return (
    <div className="min-h-screen bg-white py-16 px-6 md:px-12">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-3xl text-black font-medium">
          Frequently Asked Questions
        </h1>
        <p className="mt-6 text-gray-500 font-medium">
          These are questions that people commonly search for on Pets Corner
        </p>
      </div>

      <div className="max-w-4xl mx-auto mt-12 space-y-8">
        {faqs.map((item, i) => (
          <div key={i} className="relative">
            {/* Card */}
            <div className="bg-white rounded-lg  shadow-[0_0_20px_rgba(0,0,0,0.1)] ring-1 ring-gray-100 overflow-hidden">
              {/* entire clickable area */}
              <button
                onClick={() => toggle(i)}
                className="w-full text-left px-3 pt-5 pb-3 flex items-start focus:outline-none"
              >
                <div className="flex-1 pr-6">
                  <h3 className="text-lg md:text-xl font-medium text-gray-800">
                    {item.q}
                  </h3>
                  {/* answer placed immediately but hidden/collapsed; we show it below for smoother layout */}
                </div>
                {/* empty space on the right because the purple square sits absolute on the card's top-right */}
                {/* <div style={{ width: 48 }} aria-hidden /> */}
              </button>

              {/* answer area with smooth max-height transition */}
              <div
                className={`px-6 pb-3 transition-all duration-300 ${
                  open[i] ? "max-h-96 pt-0" : "max-h-0 pt-0 overflow-hidden"
                }`}
              >
                <p
                  className={`text-gray-600 leading-relaxed ${
                    open[i] ? "mt-3" : "hidden"
                  }`}
                >
                  {item.a}
                </p>
              </div>
            </div>

            {/* Purple toggle square positioned at the far right and sitting on top of the card */}
            <div className="absolute right-6 -top-3">
              <div className="w-5 h-5 md:w-7 md:h-7 bg-violet-400 rounded-sm shadow-md flex items-center justify-center pointer-events-none">
                {open[i] ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white transform rotate-180"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0l-4.25-4.25a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0l-4.25-4.25a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </div>

            {/* A subtle outer glow beneath the card to mimic the screenshot's soft surrounding shadow */}
            <div className="absolute inset-0 -z-10 rounded-lg shadow-[0_15px_40px_rgba(0,0,0,0.06)]"></div>
          </div>
        ))}
      </div>

      
    </div>
  );
}
