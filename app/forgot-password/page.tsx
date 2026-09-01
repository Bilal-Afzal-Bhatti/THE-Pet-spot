"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authStore } from "@/Store/authStore";

interface AuthStore {
  forgotPassword: (email: string) => Promise<boolean>;
  isForgotPassword: boolean;
  authUser: any;
  isCheckingAuth: boolean;
  checkAuth: () => Promise<void>;
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const router = useRouter();
  const store = authStore() as AuthStore;
  const { forgotPassword, isForgotPassword, authUser, isCheckingAuth, checkAuth } = store;

  // Check authentication on mount and handle redirects
  useEffect(() => {
    const verifyAuth = async () => {
      await checkAuth();
    };
    verifyAuth();
  }, [checkAuth]);

  // Redirect if already authenticated
  useEffect(() => {
    if (!isCheckingAuth && authUser) {
      router.push('/dashboard');
    }
  }, [authUser, isCheckingAuth, router]);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      return;
    }

    const success = await forgotPassword(email.trim());

    if (success) {
      setOtpSent(true);
      // Redirect to reset password page after a short delay
      setTimeout(() => {
        router.push('/reset-password');
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen flex justify-center py-5 pb-10" style={{background: 'var(--gradient-hero)'}}>
      <div className="w-full max-w-5xl bg-white shadow-[0_4px_25px_rgba(0,0,0,0.08)] grid grid-cols-1 md:grid-cols-2 overflow-hidden rounded-4xl">
        {/* Left Section */}
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
              Forgot Your Password?
            </h2>
            <p className="text-lg leading-snug font-medium">
              Don't worry! We'll help you <br /> reset it securely.
            </p>
          </div>
          {/* <Image
            src="/taddy.png"
            alt="pets"
            width={260}
            height={260}
            className="relative z-20 mt-8"
          /> */}
        </div>

        {/* Right Section */}
        <div className="flex flex-col justify-center px-20 py-14">
          <h2 className="text-2xl font-semibold text-center mb-2 text-(--color-primary)">
            Reset Your Password
          </h2>
          <p className="text-center text-sm text-gray-600 mb-8">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          <hr className="mb-4 font-light text-gray-200" />

          {/* Form */}
          <form onSubmit={handleForgotPassword} className="space-y-5">
            <div>
              <input
                type="email"
                placeholder="Enter Your Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-[#F1F1F1] rounded-md text-sm focus:outline-none focus:border-(--color-primary) focus:ring-1 focus:ring-(--color-primary)"
                required
                disabled={otpSent}
              />
            </div>

            <button
              type="submit"
              disabled={isForgotPassword || otpSent}
              className={`w-full py-2 rounded-md font-medium text-white transition ${
                isForgotPassword || otpSent
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-(--color-primary) hover:bg-(--color-primary-hover)"
              }`}
            >
              {isForgotPassword
                ? "Sending..."
                : otpSent
                ? "OTP Sent! Check your email"
                : "Send Reset Link"
              }
            </button>
          </form>

          {/* Back to Login Link */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Remember your password?
              <a
                href="/login"
                className="text-(--color-secondary) ml-1 font-medium hover:underline"
              >
                Back to Login
              </a>
            </p>
          </div>

          {otpSent && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-green-600 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-sm text-green-800">
                  Password reset OTP sent! Redirecting to reset password page...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}