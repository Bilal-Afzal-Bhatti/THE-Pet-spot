"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { authStore } from "@/Store/authStore";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const router = useRouter();
  const store = authStore() as AuthStore;
  const { authUser, logout } = store;
  const navRef = useRef<HTMLDivElement>(null);

  const toggleMenu = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const closeAllMenus = () => {
    setOpenMenu(null);
    setMobileMenuOpen(false);
  };

  const dropdownLinkClasses =
    "block px-6 py-3 w-full border-b text-[#202020] border-transparent transition-colors hover:bg-[#FFAC0D] hover:border-gray-300 border-b-gray-300";
  const dropdownLinkClassesLogin =
    "block px-3 py-1.5 border-b text-[#202020] border-transparent transition-colors hover:bg-[var(--color-primary)] border-gray-300 border-r-gray-300";

  const handleLogout = async () => {
    await logout();
    closeAllMenus();
    router.push("/");
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        closeAllMenus();
      }
    };

    if (openMenu || mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenu, mobileMenuOpen]);

  return (
    <header className="w-full bg-transparent absolute top-0 right-0 z-30" ref={navRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-6 flex items-center justify-between relative">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 cursor-pointer z-40"
          onClick={closeAllMenus}
        >
          <img src="/petLogo.png" alt="logo" className="h-10 sm:h-12 w-auto" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex gap-10 items-center text-[#ffffff] text-base font-semibold relative">
          {/* Pets Dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleMenu("pets")}
              className="flex items-center gap-1 hover:opacity-90 cursor-pointer"
            >
              <span>Pets</span>
              <svg
                className={`w-4 h-4 mb-0.5 transition-transform duration-200 ${
                  openMenu === "pets" ? "rotate-180" : ""
                }`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M5.25 7.5L10 12.25 14.75 7.5z" />
              </svg>
            </button>
            {openMenu === "pets" && (
              <div className="absolute right-0 mt-2 w-40 bg-white text-sm text-gray-700 rounded-md shadow-lg overflow-hidden">
                <Link href="/dogs/for-sale" className={dropdownLinkClasses} onClick={closeAllMenus}>
                  Dog
                </Link>
                <Link href="/cats/for-sale" className={dropdownLinkClasses} onClick={closeAllMenus}>
                  Cat
                </Link>
              </div>
            )}
          </div>

          {/* Breeds Dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleMenu("breeds")}
              className="flex items-center gap-2 hover:opacity-90 cursor-pointer"
            >
              <span>Breeds</span>
              <svg
                className={`w-4 h-4 mb-0.5 transition-transform duration-200 ${
                  openMenu === "breeds" ? "rotate-180" : ""
                }`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M5.25 7.5L10 12.25 14.75 7.5z" />
              </svg>
            </button>
            {openMenu === "breeds" && (
              <div className="absolute right-0 mt-2 w-40 bg-white text-gray-700 rounded-md shadow-lg overflow-hidden">
                <Link href="/dog-breed" className={dropdownLinkClasses} onClick={closeAllMenus}>
                  Dog Breeds
                </Link>
                <Link href="/cat-breed" className={dropdownLinkClasses} onClick={closeAllMenus}>
                  Cat Breeds
                </Link>
              </div>
            )}
          </div>

          {/* Blog Dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleMenu("blog")}
              className="flex items-center gap-2 hover:opacity-90 cursor-pointer"
            >
              <span>Blog</span>
              <svg
                className={`w-4 h-4 mb-0.5 transition-transform duration-200 ${
                  openMenu === "blog" ? "rotate-180" : ""
                }`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M5.25 7.5L10 12.25 14.75 7.5z" />
              </svg>
            </button>
            {openMenu === "blog" && (
              <div className="absolute right-0 mt-2 w-40 bg-white text-gray-700 rounded-md shadow-lg overflow-hidden">
                <Link href="/blog/dog-care" className={dropdownLinkClasses} onClick={closeAllMenus}>
                  Dog Care
                </Link>
                <Link href="/blog/cat-care" className={dropdownLinkClasses} onClick={closeAllMenus}>
                  Cat Care
                </Link>
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
                    {authUser.name[0]?.toUpperCase()}
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
                  className={`w-4 h-4 mb-0.5 transition-transform duration-200 ${
                    openMenu === "login" ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M5.25 7.5L10 12.25 14.75 7.5z" />
                </svg>
              </button>
            )}

            {openMenu === "login" && !authUser && (
              <div className="absolute flex text-sm right-0 mt-2 w-40 bg-white text-gray-700 rounded-md shadow-lg px-3 py-1.5 overflow-hidden">
                <Link href="/login" className={dropdownLinkClassesLogin} onClick={closeAllMenus}>
                  Login
                </Link>
                <Link href="/sign-up" className={dropdownLinkClassesLogin} onClick={closeAllMenus}>
                  Signup
                </Link>
              </div>
            )}

            {openMenu === "user" && authUser && (
              <div className="absolute right-0 mt-2 w-44 bg-white text-gray-700 rounded-md shadow-lg overflow-hidden">
                <Link
                  href="/dashboard"
                  className={dropdownLinkClasses}
                  onClick={closeAllMenus}
                >
                  Dashboard
                </Link>
                <button
                  className={`text-start ${dropdownLinkClasses}`}
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile / Tablet Controls */}
        <div className="flex items-center gap-4 lg:hidden z-40">
          {/* Profile Quick Access (Mobile) */}
          {authUser && (
            <button
              onClick={() => toggleMenu("user-mobile")}
              className="w-9 h-9 rounded-full overflow-hidden border-2 border-white shadow-lg cursor-pointer"
            >
              {authUser.profileImage ? (
                <img
                  src={authUser.profileImage}
                  alt={`${authUser.name}'s profile`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#FFAC0D] flex items-center justify-center text-white font-semibold text-sm">
                  {authUser.name[0]?.toUpperCase()}
                </div>
              )}
            </button>
          )}

          {/* Three Bars Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white p-2 focus:outline-none cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            <div className="w-6 h-5 relative flex flex-col justify-between">
              <span
                className={`w-full h-0.5 bg-white rounded-full transition-all duration-300 transform origin-left ${
                  mobileMenuOpen ? "rotate-45 translate-x-1 -translate-y-0.5" : ""
                }`}
              />
              <span
                className={`w-full h-0.5 bg-white rounded-full transition-all duration-300 ${
                  mobileMenuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`w-full h-0.5 bg-white rounded-full transition-all duration-300 transform origin-left ${
                  mobileMenuOpen ? "-rotate-45 translate-x-1 translate-y-0.5" : ""
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile / Tablet Accordion Menu Layer */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-x-0 top-[88px] bg-[#1a1a1a]/95 backdrop-blur-md border-b border-white/10 shadow-2xl px-6 py-6 transition-all duration-300 ease-in-out text-white">
            <div className="flex flex-col gap-4 font-semibold text-base max-h-[75vh] overflow-y-auto">
              {/* Pets Accordion */}
              <div>
                <button
                  onClick={() => toggleMenu("pets-mobile")}
                  className="flex items-center justify-between w-full py-2 hover:text-[#FFAC0D]"
                >
                  <span>Pets</span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${
                      openMenu === "pets-mobile" ? "rotate-180" : ""
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M5.25 7.5L10 12.25 14.75 7.5z" />
                  </svg>
                </button>
                {openMenu === "pets-mobile" && (
                  <div className="pl-4 flex flex-col gap-2 mt-2 text-sm text-gray-300 border-l border-white/20">
                    <Link href="/dogs/for-sale" onClick={closeAllMenus} className="py-1 hover:text-[#FFAC0D]">
                      Dog
                    </Link>
                    <Link href="/cats/for-sale" onClick={closeAllMenus} className="py-1 hover:text-[#FFAC0D]">
                      Cat
                    </Link>
                  </div>
                )}
              </div>

              {/* Breeds Accordion */}
              <div>
                <button
                  onClick={() => toggleMenu("breeds-mobile")}
                  className="flex items-center justify-between w-full py-2 hover:text-[#FFAC0D]"
                >
                  <span>Breeds</span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${
                      openMenu === "breeds-mobile" ? "rotate-180" : ""
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M5.25 7.5L10 12.25 14.75 7.5z" />
                  </svg>
                </button>
                {openMenu === "breeds-mobile" && (
                  <div className="pl-4 flex flex-col gap-2 mt-2 text-sm text-gray-300 border-l border-white/20">
                    <Link href="/dog-breed" onClick={closeAllMenus} className="py-1 hover:text-[#FFAC0D]">
                      Dog Breeds
                    </Link>
                    <Link href="/cat-breed" onClick={closeAllMenus} className="py-1 hover:text-[#FFAC0D]">
                      Cat Breeds
                    </Link>
                  </div>
                )}
              </div>

              {/* Blog Accordion */}
              <div>
                <button
                  onClick={() => toggleMenu("blog-mobile")}
                  className="flex items-center justify-between w-full py-2 hover:text-[#FFAC0D]"
                >
                  <span>Blog</span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${
                      openMenu === "blog-mobile" ? "rotate-180" : ""
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M5.25 7.5L10 12.25 14.75 7.5z" />
                  </svg>
                </button>
                {openMenu === "blog-mobile" && (
                  <div className="pl-4 flex flex-col gap-2 mt-2 text-sm text-gray-300 border-l border-white/20">
                    <Link href="/blog/dog-care" onClick={closeAllMenus} className="py-1 hover:text-[#FFAC0D]">
                      Dog Care
                    </Link>
                    <Link href="/blog/cat-care" onClick={closeAllMenus} className="py-1 hover:text-[#FFAC0D]">
                      Cat Care
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile Auth Actions */}
              <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
                {authUser ? (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={closeAllMenus}
                      className="py-2 hover:text-[#FFAC0D]"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="text-left py-2 text-red-400 hover:text-red-300"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="flex gap-4 pt-2">
                    <Link
                      href="/login"
                      onClick={closeAllMenus}
                      className="px-5 py-2 text-center rounded bg-[#FFAC0D] text-[#202020] font-bold w-full"
                    >
                      Login
                    </Link>
                    <Link
                      href="/sign-up"
                      onClick={closeAllMenus}
                      className="px-5 py-2 text-center rounded border border-[#FFAC0D] text-[#FFAC0D] font-bold w-full"
                    >
                      Signup
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}