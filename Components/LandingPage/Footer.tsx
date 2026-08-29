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
    <footer className="text-white pt-12 pb-6 border-t border-gray-200 px-44" style={{ background: 'var(--gradient-hero)' }}>
      <div className="flex gap-20">
        <div>
          <img
            src="/petLogo.png"
            alt="Pets Corner Logo"
            className="h-10 mb-4"
          />
          <p className="text-sm leading-relaxed">
            A house is not home without paw prints. We are one-stop destination
            for all your pet care needs.
          </p>

          <div className="mt-5 space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <FaPhoneAlt className="text-[#6B7280]" />
              <span>+92-333333333</span>
            </div>
            <div className="flex items-center gap-3">
              <FaEnvelope className="text-[#6B7280]" />
              <span>hello@petscorner.com</span>
            </div>
            <div className="flex items-start gap-3">
              <FaMapMarkerAlt className="text-[#6B7280] mt-1" />
              <span>
                123, Pet Street, Animal City, Country - 123456
              </span>
            </div>
          </div>
        </div>
        <div className="   grid grid-cols-1 md:grid-cols-3 gap-0">
          {/* Logo + Info */}

          {/* Our Company */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Our Company</h4>
            <ul className="space-y-2 text-sm">
              {links.map((item) => (
                <li key={item.name} className="mb-4">
                  <Link
                    href={item.href}
                    className="hover:text-[var(--color-primary)] transition-colors cursor-pointer"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Our Services */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Our Services</h4>
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
                  className="hover:text-[var(--color-primary)] cursor-pointer mb-4"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Newsletter</h4>
            <p className="text-sm mb-3">
              Subscribe to our newsletter & get all the latest news
            </p>

            <div className="flex items-center mb-5">
              <input
                type="email"
                placeholder="Enter Email ID"
                className="w-full px-4 py-2 border border-gray-300 rounded-l-md text-sm outline-none"
              />
              <button className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-black px-5 py-2 rounded-r-md text-sm font-medium">
                Go
              </button>
            </div>

            <div className="flex items-center gap-4">
              {[
                <FaFacebookF key="fb" />,
                <FaTimes key="x" />,
                <FaWhatsapp key="wa" />,
                <FaInstagram key="ig" />,
              ].map((Icon, i) => (
                <div
                  key={i}
                  className="w-9 h-9 rounded-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-black flex items-center justify-center text-lg cursor-pointer hover:bg-[var(--color-primary-hover)] transition"
                >
                  {Icon}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="max-w-7xl mx-auto px-4 mt-10 border-t border-gray-200 pt-6 text-center text-sm text-white">
        <div className="flex flex-col md:flex-row justify-between items-center justify-center gap-2">
          <p className="">
            © 2018-2025 Wanderlust Pet Services Private Limited. All Rights
            Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
