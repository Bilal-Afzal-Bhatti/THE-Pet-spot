"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { authStore } from "@/Store/authStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
// Import FontAwesome for eye icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

export default function SignUpPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
    city: "",
    isPetParent: "",
  });

  // Get signup function and loading state from zustand
  type AuthStore = {
    signup: (data: Record<string, any>) => Promise<any>;
    isSigningUp: boolean;
    authUser: any;
    isCheckingAuth: boolean;
    checkAuth: () => Promise<void>;
  };
  const { signup, isSigningUp, authUser, isCheckingAuth, checkAuth } = authStore() as AuthStore;

  // Check authentication on mount
  useEffect(() => {
    const verifyAuth = async () => {
      await checkAuth();
    };
    verifyAuth();
  }, [checkAuth]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isCheckingAuth) return;

    if (authUser) {
      router.push('/dashboard');
      return;
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Combine formData with phone
    const data = { ...formData, phone };

    try {
      await signup(data); // ✅ call zustand signup
      router.push("/verify-otp"); // ✅ navigate after signup
    } catch (err) {
      toast.error("Signup failed!");
    }
  };

  return (
    <div className="min-h-screen flex justify-center py-5 pb-10" style={{background: 'var(--gradient-hero)'}}>
      <div className="w-full max-w-5xl bg-white shadow-[0_4px_25px_rgba(0,0,0,0.08)] grid grid-cols-1 md:grid-cols-2 overflow-hidden rounded-4xl">
        {/* Left Section */}
         <div className="flex flex-col px-10 py-10">
          <div className="text-left mb-4">
            <Link href="/" className="text-(--color-secondary) font-medium hover:underline">
              ← Back to Home
            </Link>
          </div>
          <div className="grow flex flex-col justify-center">
            <h2 className="text-2xl font-semibold text-center mb-2 text-(--color-primary)">
              Sign Up
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5 mt-8">
              {/* Full Name */}
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 bg-[#F1F1F1] rounded-md text-sm focus:outline-none focus:border-(--color-primary)"
                required
              />

              {/* Phone Input */}
              {/* <PhoneInput
                country={"in"}
                value={phone}
                onChange={setPhone}
                enableSearch={true}
                disableSearchIcon={true}
                preferredCountries={[
                  "in",
                  "pk",
                  "us",
                  "gb",
                  "ca",
                  "au",
                  "ae",
                  "de",
                  "fr",
                  "it",
                  "es",
                  "id",
                  "sg",
                  "bd",
                  "sa",
                  "qa",
                  "kw",
                  "my",
                  "th",
                  "vn",
                ]}
                inputStyle={{
                  width: "100%",
                  backgroundColor: "#F1F1F1",
                  borderRadius: "0.375rem",
                  border: "none",
                  height: "45px",
                  fontSize: "14px",
                }}
                dropdownStyle={{ maxHeight: "250px" }}
              /> */}

              {/* Email */}
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 bg-[#F1F1F1] rounded-md text-sm focus:outline-none focus:border-(--color-primary)"
                required
              />

              {/* Password */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-3 bg-[#F1F1F1] rounded-md text-sm focus:outline-none focus:border-(--color-primary) pr-12"
                  required
                />
                <FontAwesomeIcon
                  icon={showPassword ? faEyeSlash : faEye}
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
                  style={{ fontSize: 20 }}
                />
              </div>

              {/* Gender */}
              {/* <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full p-3 bg-[#F1F1F1] rounded-md text-sm focus:outline-none focus:border-[#169bb6]"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select> */}

              {/* City */}
              {/* <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                className="w-full p-3 bg-[#F1F1F1] rounded-md text-sm focus:outline-none focus:border-[#169bb6]"
                required
              /> */}

              {/* Pet Parent */}
              <div>
                <p className="text-gray-700 text-sm mb-1">
                  Are you a Pet Parent?
                </p>
                <div className="flex items-center gap-5">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="isPetParent"
                      value="Yes"
                      onChange={handleChange}
                      className="accent-(--color-primary)"
                    />
                    Yes
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="isPetParent"
                      value="No"
                      onChange={handleChange}
                      className="accent-(--color-primary)"
                    />
                    No
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSigningUp} // ✅ disable while signing up
                className={`w-full py-2 rounded-md font-medium text-white transition ${
                  isSigningUp
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-(--color-primary) hover:bg-(--color-primary-hover)"
                }`}
              >
                {isSigningUp ? "Signing Up..." : "Create an account"}
              </button>
            </form>

            <p className="text-center text-sm text-gray-600 mt-4">
              Already a member?{" "}
              <a
                href="/login"
                className="text-(--color-secondary) font-medium hover:underline"
              >
                Login
              </a>
            </p>
            {/* <p className="text-center text-sm text-gray-600 mt-1">
              Sign up as a Service Provider{" "}
              <a href="#" className="text-[#32b5ce] font-medium hover:underline">
                Join Us
              </a>
            </p> */}
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
      </div>
    </div>
  );
}
