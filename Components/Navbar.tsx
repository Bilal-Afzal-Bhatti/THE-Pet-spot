"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { authStore } from "@/Store/authStore"; // ✅ import your zustand store

interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  profileImage?: string;
}

interface AuthStore {
  authUser: AuthUser | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
  signup: (data: any) => Promise<void>;
  login: (formData: any) => Promise<boolean>;
  logout: () => Promise<boolean>;
  checkAuth: () => Promise<void>;
}

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const router = useRouter();
  const store = authStore() as AuthStore;
  const { authUser, logout } = store;
  const dropdownRef = useRef<HTMLDivElement>(null);
  // console.log("Hello authUser", authUser);
  const toggleMenu = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const dropdownLinkClasses =
    "block px-6 py-3 w-full border-b text-[#202020] border-transparent transition-colors hover:bg-[#FFAC0D] hover:border-gray-300 border-b-gray-300";
  const dropdownLinkClassesLogin =
    "block px-3 py-1.5 border-b text-[#202020] border-transparent transition-colors hover:bg-[var(--color-primary)] border-gray-300 border-r-gray-300";

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    };

    if (openMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenu]);

  return (
    <header className="w-full bg-transparent absolute top-0 right-0 z-30">
      <div className="mx-auto px-52 py-6 flex items-center justify-between relative">
        {/* Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <img src="/petLogo.png" alt="logo" className="h-12 w-auto" />
        </div>

        {/* Navigation */}
        <nav ref={dropdownRef} className="hidden lg:flex gap-10 items-center text-[#ffffff] text-base font-semibold relative">
          {/* Pets Dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleMenu("pets")}
              className="flex items-center gap-1 hover:opacity-90 cursor-pointer"
            >
              <span>Pets</span>
              <svg
                className="w-4 h-4 mb-0.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M5.25 7.5L10 12.25 14.75 7.5z" />
              </svg>
            </button>
            {openMenu === "pets" && (
              <div className="absolute  right-0 mt-2 w-40 bg-white text-sm text-gray-700 rounded-md shadow-lg">
                <a href="/dogs/for-sale" className={dropdownLinkClasses}>
                  Dog
                </a>
                <a href="/cats/for-sale" className={dropdownLinkClasses}>
                  Cat
                </a>
              </div>
            )}
          </div>

          {/* Pet Services Dropdown */}
          {/* <div className="relative">
            <button
              onClick={() => toggleMenu("services")}
              className="flex items-center gap-2 hover:opacity-90 cursor-pointer"
            >
              <span>Pet Services</span>
              <svg
                className="w-4 h-4 mb-0.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M5.25 7.5L10 12.25 14.75 7.5z" />
              </svg>
            </button>
            {openMenu === "services" && (
              <div className="absolute right-0 mt-2 w-40 bg-white  text-gray-700 rounded-md shadow-lg">
                <a href="#" className={dropdownLinkClasses}>
                  Grooming
                </a>
                <a href="#" className={dropdownLinkClasses}>
                  Training
                </a>
                <a href="#" className={dropdownLinkClasses}>
                  Boarding
                </a>
              </div>
            )}
          </div> */}

          {/* Breeds Dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleMenu("breeds")}
              className="flex items-center gap-2 hover:opacity-90 cursor-pointer"
            >
              <span>Breeds</span>
              <svg
                className="w-4 h-4 mb-0.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M5.25 7.5L10 12.25 14.75 7.5z" />
              </svg>
            </button>
            {openMenu === "breeds" && (
              <div className="absolute right-0 mt-2 w-40 bg-white text-gray-700 rounded-md shadow-lg">
                <a href="/dog-breed" className={dropdownLinkClasses}>
                  Dog Breeds
                </a>
                <a href="/cat-breed" className={dropdownLinkClasses}>
                  Cat Breeds
                </a>
              </div>
            )}
          </div>

          {/* Breeds Dropdown */}
          {/* <div className="relative">
            <button
              onClick={() => toggleMenu("food")}
              className="flex items-center gap-2 hover:opacity-90 cursor-pointer"
            >
              <span>Food</span>
              <svg
                className="w-4 h-4 mb-0.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M5.25 7.5L10 12.25 14.75 7.5z" />
              </svg>
            </button>
            {openMenu === "food" && (
              <div className="absolute right-0 mt-2 w-40 bg-white text-gray-700 rounded-md shadow-lg">
                <a href="/dog-food" className={dropdownLinkClasses}>
                  Dog food
                </a>
                <a href="/cat-food" className={dropdownLinkClasses}>
                  Cat food
                </a>
              </div>
            )}
          </div> */}
          {/* Blog */}
          <div className="relative">
            <button
              onClick={() => toggleMenu("blog")}
              className="flex items-center gap-2 hover:opacity-90 cursor-pointer"
            >
              <span>Blog</span>
              <svg
                className="w-4 h-4 mb-0.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M5.25 7.5L10 12.25 14.75 7.5z" />
              </svg>
            </button>

            {openMenu === "blog" && (
              <div className="absolute right-0 mt-2 w-40 bg-white text-gray-700 rounded-md shadow-lg">
                <a href="/blog/dog-care" className={dropdownLinkClasses}>
                  Dog Care
                </a>
                <a href="/blog/cat-care" className={dropdownLinkClasses}>
                  Cat Care
                </a>
              </div>
            )}
          </div>

          {/* Auth / User Menu */}
          <div className="relative">
            {authUser ? (
              <button
                onClick={() => toggleMenu("user")}
                className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-lg cursor-pointer"
              >
                {authUser.profileImage ? (
                  <img
                    src={authUser.profileImage}
                    alt={`${authUser.name}'s profile`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[#FFAC0D] flex items-center justify-center text-white font-semibold">
                    {authUser.name[0].toUpperCase()}
                  </div>
                )}
              </button>
            ) : (
              <button
                onClick={() => toggleMenu("login")}
                className="flex items-center gap-1 hover:opacity-90 cursor-pointer"
              >
                <span>Login</span>
                <svg
                  className="w-4 h-4 mb-0.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M5.25 7.5L10 12.25 14.75 7.5z" />
                </svg>
              </button>
            )}

            {openMenu === "login" && !authUser && (
              <div className="absolute flex text-sm right-0 mt-2 w-40 bg-white text-gray-700 rounded-md shadow-lg px-3 py-1.5">
                <a href="/login" className={dropdownLinkClassesLogin}>
                  Login
                </a>
                <a href="/sign-up" className={dropdownLinkClassesLogin}>
                  Signup
                </a>
              </div>
            )}

            {openMenu === "user" && authUser && (
              <div className="absolute right-0 mt-2 w-44 bg-white text-gray-700 rounded-md shadow-lg">
                {/* <a
                  href="/profile"
                  className={dropdownLinkClasses}
                  onClick={() => setOpenMenu(null)}
                >
                  Profile
                </a> */}
                <a
                  href="/dashboard"
                  className={dropdownLinkClasses}
                  onClick={() => setOpenMenu(null)}
                >
                  Dashboard
                </a>
                <button
                  className={`text-start ${dropdownLinkClasses} `}
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
