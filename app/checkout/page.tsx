"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { FaShieldAlt, FaCreditCard, FaMoneyBillWave, FaArrowLeft, FaSpinner } from "react-icons/fa";
import { useBuyStore } from "@/Store/buyStore";
import { useAuthStore } from "@/Store/authStore"; // ⬅️ 1. Import your auth store

// 1. Separate component that uses useSearchParams
function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const petIdFromUrl = searchParams.get("petId");

  const { selectedPet, setSelectedPet, checkoutDetails, setCheckoutDetails, processCheckout, loading, error } =
    useBuyStore();

  const { user } = useAuthStore(); // ⬅️ 2. Get user from authStore

  const [formError, setFormError] = useState("");
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initPet = async () => {
      if (petIdFromUrl && (!selectedPet || selectedPet._id !== petIdFromUrl)) {
        await setSelectedPet(petIdFromUrl);
      }
      
      // ⬅️ 3. Auto-populate email from authStore if available and not already set
      if (user?.email && !checkoutDetails.email) {
        setCheckoutDetails({ email: user.email });
      }

      setIsInitializing(false);
    };
    initPet();
  }, [petIdFromUrl, selectedPet, setSelectedPet, user, checkoutDetails.email, setCheckoutDetails]);

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--gradient-hero)" }}>
        <div className="text-center bg-white p-8 rounded-3xl shadow-xl">
          <FaSpinner className="animate-spin text-3xl mx-auto mb-2 text-orange-600" />
          <p className="text-gray-600 font-medium">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (!selectedPet) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: "var(--gradient-hero)" }}>
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md w-full">
          <h2 className="text-xl font-bold mb-4">No Pet Selected</h2>
          <p className="text-gray-500 text-sm mb-6">Please choose a pet from the marketplace first.</p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-(--color-primary) text-black font-bold rounded-xl cursor-pointer"
          >
            Go to Marketplace
          </button>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setCheckoutDetails({ [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!checkoutDetails.fullName || !checkoutDetails.phone || !checkoutDetails.address || !checkoutDetails.city || !checkoutDetails.email) {
      setFormError("Please fill out all required shipping fields.");
      return;
    }

    try {
      const redirectUrl = await processCheckout();
      if (redirectUrl) {
        window.location.href = redirectUrl;
      }
    } catch (err: any) {
      console.error("Checkout submission error:", err);
    }
  };

  const petImage = selectedPet.images?.[0] || selectedPet.image || "https://via.placeholder.com/200";

  return (
    <div className="min-h-screen w-full flex justify-center py-5 pb-10" style={{ background: "var(--gradient-hero)" }}>
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-6 sm:p-10 mt-20">
        
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-black mb-6 font-semibold text-sm cursor-pointer"
        >
          <FaArrowLeft /> Back to Details
        </button>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-8">Secure Checkout</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <form onSubmit={handleSubmit} className="md:col-span-2 space-y-6">
            
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-800 border-b pb-2">1. Shipping & Contact Information</h2>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={checkoutDetails.fullName || ""}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-(--color-primary) text-sm"
                />
              </div>

              {/* ⬅️ Added Email Input Field */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Email Address (Linked to Account)</label>
                <input
                  type="email"
                  name="email"
                  required
                  disabled
                  value={checkoutDetails.email || user?.email || ""}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={checkoutDetails.phone || ""}
                    onChange={handleInputChange}
                    placeholder="+92 300 1234567"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-(--color-primary) text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={checkoutDetails.city || ""}
                    onChange={handleInputChange}
                    placeholder="Islamabad"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-(--color-primary) text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Street Address</label>
                <input
                  type="text"
                  name="address"
                  required
                  value={checkoutDetails.address || ""}
                  onChange={handleInputChange}
                  placeholder="House #123, Street Name"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-(--color-primary) text-sm"
                />
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <h2 className="text-lg font-bold text-gray-800 border-b pb-2">2. Payment Method</h2>

              <div className="grid grid-cols-2 gap-4">
                <label
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    checkoutDetails.paymentMethod === "ONLINE"
                      ? "border-(--color-primary) bg-(--color-primary)/10"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="ONLINE"
                    checked={checkoutDetails.paymentMethod === "ONLINE"}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <FaCreditCard className="text-2xl mb-2 text-gray-800" />
                  <span className="font-bold text-sm">Online (Stripe)</span>
                  <span className="text-xs text-gray-400">Instant Checkout</span>
                </label>

                <label
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    checkoutDetails.paymentMethod === "COD"
                      ? "border-(--color-primary) bg-(--color-primary)/10"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={checkoutDetails.paymentMethod === "COD"}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <FaMoneyBillWave className="text-2xl mb-2 text-gray-800" />
                  <span className="font-bold text-sm">Cash on Delivery</span>
                  <span className="text-xs text-gray-400">Pay upon arrival</span>
                </label>
              </div>
            </div>

            {(formError || error) && (
              <p className="text-red-500 text-xs font-semibold">{formError || error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-(--color-primary) text-black font-extrabold rounded-2xl shadow-lg hover:scale-102 transition-transform text-base cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <FaSpinner className="animate-spin text-xl" /> : `Confirm & Pay PKR ${selectedPet.price}`}
            </button>
          </form>

          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col justify-between h-fit">
            <div>
              <h3 className="font-bold text-gray-900 mb-4 border-b pb-2">Order Summary</h3>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-200 shrink-0">
                  <Image src={petImage} alt="Pet" fill className="object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900">{selectedPet.name || selectedPet.breed}</h4>
                  <p className="text-xs text-gray-500">{selectedPet.category || selectedPet.breed}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600 border-t pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">PKR {selectedPet.price}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Inspection</span>
                  <span className="font-semibold text-green-600">FREE</span>
                </div>
                <div className="flex justify-between border-t pt-2 text-base font-extrabold text-gray-900">
                  <span>Total</span>
                  <span>PKR {selectedPet.price}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t text-xs text-gray-400 flex items-center gap-2">
              <FaShieldAlt className="text-green-500 text-base" /> Secured with industry-grade encryption & idempotency safeguards.
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// 2. Main wrapper component with Suspense boundary
export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--gradient-hero)" }}>
          <div className="text-center bg-white p-8 rounded-3xl shadow-xl">
            <FaSpinner className="animate-spin text-3xl mx-auto mb-2 text-orange-600" />
            <p className="text-gray-600 font-medium">Loading checkout...</p>
          </div>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}