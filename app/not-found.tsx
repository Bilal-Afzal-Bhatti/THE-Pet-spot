"use client";

import Link from "next/link";
import Image from "next/image";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-b from-[#037273] to-white px-4 text-center">
      {/* Illustration */}
      {/* <div className="relative w-full max-w-lg h-80 mb-8">
        <Image
          src="/404-illustration.svg" // Add your own SVG or PNG
          alt="404 Not Found"
          fill
          className="object-contain"
        />
      </div> */}

      {/* Title */}
      <h1 className="text-6xl font-extrabold text-[#04A4C3] mb-4">404</h1>
      <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-700">
        Oops! Page Not Found
      </h2>
      <p className="text-gray-500 mb-8 max-w-md mx-auto">
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </p>

      {/* Button */}
      <Link
        href="/"
        className="inline-block bg-[#04A4C3] text-white font-medium px-6 py-3 rounded-lg shadow-lg hover:bg-[#118196] transition-colors duration-300"
      >
        Go Back Home
      </Link>
    </div>
  );
}
