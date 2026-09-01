"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { authStore } from "@/Store/authStore";

interface AuthStore {
  login: (formData: any) => Promise<boolean>;
  isLoggingIn: boolean;
  authUser: any;
  isCheckingAuth: boolean;
  checkAuth: () => Promise<void>;
}

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<"password" | "otp">("password");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [mobileOtp, setMobileOtp] = useState("");

  const router = useRouter();
  const store = authStore() as AuthStore;
  const { login, isLoggingIn, authUser, isCheckingAuth, checkAuth } = store;

  // Check authentication on mount
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

  // Show loading while checking auth
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex justify-center items-center" style={{background: 'var(--gradient-hero)'}}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-(--color-primary) border-t-transparent mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if authenticated (will redirect)
  if (authUser) {
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    let formData;
    if (activeTab === "password") {
      formData = { email, password };
    } else {
      formData = { mobile: mobileOtp };
    }

    const success = await login(formData);

    if (success) {
      router.push("/dashboard"); 
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
              We Welcome You,
            </h2>
            <p className="text-lg leading-snug font-medium">
              with our open <br /> Heart and Paws!
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
        <div className="flex flex-col px-10 py-10">
          <div className="text-left mb-4">
            <Link href="/" className="text-(--color-secondary) font-medium hover:underline">
              ← Back to Home
            </Link>
          </div>
          <div className="grow flex flex-col justify-center">
            <h2 className="text-2xl font-semibold text-center mb-2 text-(--color-primary)">
              Login to Continue
            </h2>
            <p className="text-center text-sm text-gray-600 mb-8">
              Don't have an account with us?
              <a
                href="/sign-up"
                className="text-(--color-secondary) ml-1 font-medium hover:underline"
              >
                Click here to Register
              </a>
            </p>

            {/* Tabs */}
            {/* <div className="flex justify-center text-base font-bold mb-4">
              <button
                className={`pb-1 px-5 border-b-3 transition font-bold ${
                  activeTab === "password"
                    ? "text-[#04a4c3] border-[#04a4c3]"
                    : "text-gray-500 border-transparent hover:text-black"
                }`}
                onClick={() => setActiveTab("password")}
              >
                Login with Password
              </button>
              <button
                className={`pb-1 px-4 border-b-3 transition font-bold ${
                  activeTab === "otp"
                    ? "text-[#04a4c3] border-[#04a4c3]"
                    : "text-gray-500 border-transparent hover:text-black"
                }`}
                onClick={() => setActiveTab("otp")}
              >
                Login with OTP
              </button>
            </div> */}

            <hr className="mb-4 font-light text-gray-200" />

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              {activeTab === "password" ? (
                <>
                  <input
                    type="text"
                    placeholder="Enter Your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 bg-[#F1F1F1] rounded-md text-sm focus:outline-none focus:border-[#169bb6]"
                    required
                  />
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-3 bg-[#F1F1F1] rounded-md text-sm focus:outline-none focus:border-(--color-primary)"
                      required
                    />
                    <span
                      onClick={() => setShowPassword((v) => !v)}
                      className={`fa fa-fw field-icon toggle-password absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer ${
                        showPassword ? "fa-eye-slash" : "fa-eye"
                      }`}
                      style={{ fontSize: 20 }}
                    />
                  </div>

                  {/* Forgot Password Link */}
                  <div className="text-right">
                    <a
                      href="/forgot-password"
                      className="text-sm text-(--color-secondary) font-medium hover:underline"
                    >
                      Forgot Password?
                    </a>
                  </div>
                </>
              ) : (
                <input
                  type="text"
                  placeholder="Mobile No."
                  value={mobileOtp}
                  onChange={(e) => setMobileOtp(e.target.value)}
                  className="w-full p-3 bg-[#F1F1F1] rounded-md text-sm focus:outline-none focus:border-[#169bb6]"
                  required
                />
              )}

              <button
                type="submit"
                disabled={isLoggingIn}
                className={`w-full py-2 rounded-md font-medium text-white transition ${
                  isLoggingIn
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-(--color-primary) hover:bg-(--color-primary-hover)"
                }`}
              >
                {isLoggingIn ? "Logging in..." : "Log in"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
