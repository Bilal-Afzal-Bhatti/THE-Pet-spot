"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FaStar } from "react-icons/fa";

export default function Feedback() {
  const feedbacks = [
    {
      name: "Anuja Goenka",
      text: "Great service! I'm very happy with their service response and coordination. Mr. & Mrs. deliver very healthy lovable pups — special thanks to Jai who took care of everything till delivery.",
      image: "/Feedback/feedback1.png",
    },
    {
      name: "Rahul Sharma",
      text: "Fantastic experience! The MMP team made the process effortless and kept me informed at every step. My puppy arrived happy and healthy. special thanks to Jai who took care of everything till delivery.",
      image: "/Feedback/feedback2.png",
    },
    {
      name: "Neha Patel",
      text: "Really impressed with the communication and love they show for pets. Transparent process and great care throughout. Highly recommend! special thanks to Jai who took care of everything till delivery.",
      image: "/Feedback/feedback3.png",
    },
  ];

  const [current, setCurrent] = useState(0);

  // Auto-slide every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % feedbacks.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [feedbacks.length]);

  return (
    <section className="relative bg-[#FAFAFA] py-20 overflow-hidden">
      <div className="text-center mb-24 px-4">
        <h2 className="text-3xl font-semibold text-gray-900 mb-3">
          MMP Customer Feedback
        </h2>
        <p className="text-gray-600">
          Have a look at what people say about us. It reflects our commitment to
          offering quality pet care.
        </p>
      </div>

      {/* Purple background bar */}
      <div className="absolute inset-x-0 top-8/12  -translate-y-1/2 h-28 bg-[#9B76E8]" />

      {/* Feedback card */}
      <div className="relative max-w-2xl mx-auto z-10 transition-all duration-700 ease-in-out ">
        <div className="bg-white shadow-[0_0_25px_rgba(0,0,0,0.15)] rounded p-10 text-center relative  border-2 border-[#9a79d7]">
          {/* Profile image */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2">
            <div className="w-20 h-20 overflow-hidden">
              <Image
                src={feedbacks[current].image}
                alt={feedbacks[current].name}
                width={80}
                height={80}
                className="object-cover"
              />
            </div>
          </div>

          <div className="mt-12">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {feedbacks[current].name}
            </h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              {feedbacks[current].text}
            </p>
            <div className="flex justify-center text-[#FFD700]">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <FaStar key={i} />
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
