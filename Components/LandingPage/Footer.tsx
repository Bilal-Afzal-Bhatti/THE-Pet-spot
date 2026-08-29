"use client";

import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaTimes,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";

export default function Footer() {
  const links = [
    { name: "About us", href: "/about-us" },
    { name: "Contact us", href: "/contact-us" },
    { name: "Terms & Conditions", href: "/terms-and-conditions" },
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Term of Use", href: "/term-of-use" },
    { name: "Refund Policy", href: "/return-and-refund-policy" },
    { name: "Shipping Policy", href: "/shipping-policy" },
    { name: "Grievance Policy", href: "/grievance-redressal-policy" },
  ];

  return (
    <footer
      className="text-white pt-12 pb-6 border-t border-gray-200/20 px-4 sm:px-8 lg:px-16 xl:px-24 w-full"
      style={{ background: "var(--gradient-hero)" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* Company Info & Logo */}
          <div className="flex flex-col">
            <img
              src="/petLogo.png"
              alt="Pets Corner Logo"
              className="h-10 w-auto mb-4 self-start"
            />
            <p className="text-sm leading-relaxed text-gray-200">
              A house is not home without paw prints. We are one-stop destination
              for all your pet care needs.
            </p>

            <div className="mt-5 space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <FaPhoneAlt className="text-gray-300 shrink-0" />
                <span className="break-all">+92-333333333</span>
              </div>
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-gray-300 shrink-0" />
                <span className="break-all">hello@petscorner.com</span>
              </div>
              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-gray-300 mt-1 shrink-0" />
                <span>123, Pet Street, Animal City, Country - 123456</span>
              </div>
            </div>
          </div>

          {/* Our Company */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-[#FFAC0D]">
              Our Company
            </h4>
            <ul className="space-y-2 text-sm">
              {links.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="hover:text-[var(--color-primary)] transition-colors cursor-pointer inline-block py-0.5"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Our Services */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-[#FFAC0D]">
              Our Services
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                "Dog Hostel",
                "Dog Training",
                "Dog Walking",
                "Grooming",
                "Veterinary",
                "Pet Mating",
                "Blog",
              ].map((item) => (
                <li
                  key={item}
                  className="hover:text-[var(--color-primary)] transition-colors cursor-pointer py-0.5"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-[#FFAC0D]">
              Newsletter
            </h4>
            <p className="text-sm mb-4 text-gray-200">
              Subscribe to our newsletter & get all the latest news
            </p>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex items-center mb-6 w-full"
            >
              <input
                type="email"
                placeholder="Enter Email ID"
                className="w-full px-3.5 py-2 bg-white text-gray-900 border border-gray-300 rounded-l-md text-sm outline-none focus:ring-2 focus:ring-[#FFAC0D]"
              />
              <button
                type="submit"
                className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-black px-4 sm:px-5 py-2 rounded-r-md text-sm font-semibold transition-colors shrink-0"
              >
                Go
              </button>
            </form>

            <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
              {[
                <FaFacebookF key="fb" />,
                <FaTimes key="x" />,
                <FaWhatsapp key="wa" />,
                <FaInstagram key="ig" />,
              ].map((Icon, i) => (
                <div
                  key={i}
                  className="w-9 h-9 rounded-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-black flex items-center justify-center text-base sm:text-lg cursor-pointer transition-transform hover:scale-105"
                >
                  {Icon}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Copyright Section */}
        <div className="mt-10 border-t border-white/20 pt-6 text-center text-xs sm:text-sm text-gray-200">
          <p>
            © 2018-2026 Wanderlust Pet Services Private Limited. All Rights
            Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}