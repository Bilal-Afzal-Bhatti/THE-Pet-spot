"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { FaCheckCircle, FaHome, FaSpinner } from "react-icons/fa";
import { useEffect, useState, Suspense } from "react";
import { useBuyStore } from "@/Store/buyStore";
import { api } from "@/utils/api/axiosInstance"; // 👈 Using your centralized API instance

function OrderSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type"); // 'cod' or null for online
  const sessionId = searchParams.get("session_id");
  const orderId = searchParams.get("orderId");
  
  const clearCheckout = useBuyStore((state) => state.clearCheckout);
  const [verifying, setVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<string>("");

  useEffect(() => {
    let isMounted = true;

    const verifyOnlinePayment = async () => {
      if (type === "cod") {
        clearCheckout();
        return;
      }

      if (sessionId) {
        setVerifying(true);
        try {
          // Using the centralized api instance instead of raw axios and localhost strings
          const response = await api.get(
            `/api/orders/verify-payment?session_id=${sessionId}&orderId=${orderId}`
          );
          
          if (isMounted && response.data.success) {
            setVerificationStatus("Payment verified & status updated to PAID!");
          }
        } catch (err: any) {
          console.error("Payment verification call failed:", err);
          if (isMounted) {
            setVerificationStatus("Verification failed or already completed.");
          }
        } finally {
          if (isMounted) {
            setVerifying(false);
            clearCheckout();
          }
        }
      } else {
        clearCheckout();
      }
    };

    verifyOnlinePayment();

    return () => {
      isMounted = false;
    };
  }, [sessionId, orderId, type, clearCheckout]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center py-12 px-4 bg-gray-50 mt-16">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-500 text-4xl shadow-inner">
            {verifying ? <FaSpinner className="animate-spin text-green-600" /> : <FaCheckCircle />}
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black text-gray-900">
            {verifying ? "Verifying Payment..." : "Order Placed Successfully!"}
          </h1>
          <p className="text-sm text-gray-500">
            {type === "cod"
              ? "Your Cash on Delivery order has been placed. Our team will contact you shortly."
              : verificationStatus || "Thank you! Your payment was processed successfully through Stripe."}
          </p>
        </div>

        <div className="pt-4">
          <button
            onClick={() => router.push("/")}
            disabled={verifying}
            className="w-full py-4 bg-black text-white font-bold rounded-2xl shadow-lg flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            <FaHome /> Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
        <FaSpinner className="animate-spin text-green-600 text-4xl" />
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}