"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { FaCheckCircle, FaHome } from "react-icons/fa";
import { useEffect } from "react";
import { useBuyStore } from "@/Store/buyStore";

export default function OrderSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type"); // 'cod' or stripe details
  const { clearCheckout } = useBuyStore();

  useEffect(() => {
    // Clear out the checkout and selected pet storage upon successful order completion
    clearCheckout();
  }, [clearCheckout]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center py-12 px-4 bg-gray-50 mt-16">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-500 text-4xl shadow-inner">
            <FaCheckCircle />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black text-gray-900">Order Placed Successfully!</h1>
          <p className="text-sm text-gray-500">
            {type === "cod"
              ? "Your Cash on Delivery order has been placed. Our team will contact you shortly."
              : "Thank you! Your payment was processed successfully through Stripe."}
          </p>
        </div>

        <div className="pt-4">
          <button
            onClick={() => router.push("/")}
            className="w-full py-4 bg-black text-white font-bold rounded-2xl shadow-lg flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-800 transition-colors"
          >
            <FaHome /> Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}