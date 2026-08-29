"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { authStore } from "@/Store/authStore";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function VerifyOtpPage() {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  
  const { verifyOtp, isVerifyingOtp, pendingEmail, authUser, isCheckingAuth, checkAuth } = authStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isCheckingAuth) return;
    if (authUser) {
      router.push("/dashboard");
    }
  }, [authUser, isCheckingAuth, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 6) {
      toast.error("Please enter a valid 6-digit OTP code");
      return;
    }

    const success = await verifyOtp(otp);
    if (success) {
      router.push("/dashboard");
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex justify-center items-center" style={{ background: "var(--gradient-hero)" }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-(--color-primary) border-t-transparent mx-auto mb-4" />
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center py-5 pb-10" style={{ background: "var(--gradient-hero)" }}>
      <div className="w-full max-w-5xl bg-white shadow-[0_4px_25px_rgba(0,0,0,0.08)] grid grid-cols-1 md:grid-cols-2 overflow-hidden rounded-4xl">
        
        {/* Left Section */}
        <div className="flex flex-col px-10 py-10">
          <div className="text-left mb-4">
            <Link href="/sign-up" className="text-(--color-secondary) font-medium hover:underline">
              ← Back to Sign Up
            </Link>
          </div>

          <div className="grow flex flex-col justify-center">
            <h2 className="text-2xl font-semibold text-center mb-2 text-(--color-primary)">
              Verify Your Email
            </h2>
            <p className="text-sm text-center text-gray-600 mb-6">
              Enter the 6-digit verification code sent to{" "}
              <span className="font-semibold text-gray-800">{pendingEmail || "your email"}</span>
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <input
                type="text"
                maxLength={6}
                placeholder="Enter 6-Digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                className="w-full p-3 bg-[#F1F1F1] rounded-md text-center text-lg tracking-[0.5em] font-semibold focus:outline-none focus:border-(--color-primary)"
                required
              />

              <button
                type="submit"
                disabled={isVerifyingOtp}
                className={`w-full py-2 rounded-md font-medium text-white transition ${
                  isVerifyingOtp
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-(--color-primary) hover:bg-(--color-primary-hover)"
                }`}
              >
                {isVerifyingOtp ? "Verifying..." : "Verify Code"}
              </button>
            </form>

            <p className="text-center text-sm text-gray-600 mt-6">
              Didn't receive code?{" "}
              <button
                type="button"
                onClick={() => toast.success("OTP resent successfully!")}
                className="text-(--color-secondary) font-medium hover:underline border-none bg-transparent cursor-pointer"
              >
                Resend Code
              </button>
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="relative flex flex-col justify-center items-center text-white px-10 py-16">
          <Image
            src="/signup-bg.webp"
            alt="bg"
            fill
            className="object-cover z-0"
          />
          <div className="absolute inset-0 bg-(--bg-dark-accent)/70 z-10" />
          <div className="relative z-20 text-center max-w-sm">
            <Image
              src="/petLogoAuth.png"
              alt="logo"
              width={180}
              height={180}
              className="mx-auto mb-6"
            />
            <h2 className="text-3xl font-semibold leading-snug mb-2">
              Almost There!
            </h2>
            <p className="text-lg leading-snug font-medium">
              Verify your code to <br /> unlock your account.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}