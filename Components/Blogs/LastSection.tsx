import React from "react";
import { FaTag, FaCheckCircle, FaMobileAlt } from "react-icons/fa";

export default function GuaranteeBadges() {
  return (
    <div className="w-full bg-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-center items-center gap-12 flex-wrap">
          {/* Best Price Guarantee */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center">
              <FaTag className="text-yellow-600 text-3xl transform -rotate-12" />
            </div>
            <div className="text-base font-semibold tracking-wide">
              <span className="text-gray-800">BEST PRICE </span>
              <span className="text-[#0F766E]">GUARANTEE</span>
            </div>
          </div>

          {/* Pets You'll Love */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center bg-emerald-100 rounded-full">
              <FaCheckCircle className="text-[#0F766E] text-2xl" />
            </div>
            <div className="text-base font-semibold tracking-wide">
              <span className="text-[#0F766E]">PETS </span>
              <span className="text-gray-800">YOU'LL LOVE</span>
            </div>
          </div>

          {/* Instant Confirmation */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center">
              <FaMobileAlt className="text-blue-500 text-3xl" />
            </div>
            <div className="text-base font-semibold tracking-wide">
              <span className="text-[#0F766E]">INSTANT </span>
              <span className="text-gray-800">CONFIRMATION</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
