"use client";

import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import Image from "next/image";

export default function ContactSection() {
  return (
    <section className="w-full bg-white py-4 px-6 md:px-12 max-w-6xl mx-auto mb-10">
      <div className="flex flex-wrap items-center justify-center gap-2 pb-6 text-lg mb-10">
        {/* Item 1 */}
        <div className="flex items-center space-x-2">
          <span className="text-teal-600 text-2xl">🍃</span>
          <p className="text-gray-700 font-semibold">
            VACCINATED & INSURED PETS
          </p>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px h-6 bg-gray-300"></div>

        {/* Item 2 */}
        <div className="flex items-center space-x-2">
          <span className="text-teal-600 text-2xl">🐾</span>
          <p className="text-gray-700 font-semibold">
            <span className="text-[#018F98]">100+</span> HAPPY FAMILIES
          </p>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px h-6 bg-gray-300"></div>

        {/* Item 3 */}
        <div className="flex items-center space-x-2">
          <span className="text-teal-600 text-2xl">🐕</span>
          <p className="text-gray-700 font-semibold">RESPONSIBLE BREEDERS</p>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px h-6 bg-gray-800"></div>

        {/* Item 4 */}
        <div className="flex items-center space-x-2">
          <span className="text-teal-600 text-2xl">🐶</span>
          <p className="text-gray-700 font-semibold">
            <span className="text-[#018F98]">50+</span> BREEDS
          </p>
        </div>
      </div>
      <div className="bg-[#018F98] text-center block px-8 py-2 rounded-md mb-8">
        <h2 className="text-white text-xl font-semibold block">
          What can I use MMP for?
        </h2>
      </div>
      <div className="max-w-6xl mx-auto">
        {/* Top Section: Form + Images */}
        <div className="grid md:grid-cols-2 gap-10">
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-semibold mb-1">Contact Us</h2>
            <p className="text-gray-600 text-sm mb-6">
              Please write your query below
            </p>

            <form className="space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  className="border border-gray-300 rounded-sm px-3 py-2 text-sm w-full focus:outline-[#018F98]"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="border border-gray-300 rounded-sm px-3 py-2 text-sm w-full focus:outline-[#018F98]"
                />
              </div>

              {/* Mobile */}
              <input
                type="text"
                placeholder="Mobile Number"
                className="border border-gray-300 rounded-sm px-3 py-2 text-sm w-full focus:outline-[#018F98]"
              />

              {/* Email */}
              <input
                type="email"
                placeholder="Email Id"
                className="border border-gray-300 rounded-sm px-3 py-2 text-sm w-full focus:outline-[#018F98]"
              />

              {/* Message */}
              <textarea
                placeholder="How Can We Help You ?"
                rows={4}
                className="border border-gray-300 rounded-sm px-3 py-2 text-sm w-full focus:outline-[#018F98] resize-none"
              ></textarea>

              {/* Submit */}
              <button
                type="submit"
                className="bg-[#2a7394] hover:bg-[#1C536B] text-white text-sm font-semibold px-6 py-2 w-full rounded-sm  transition-colors"
              >
                Submit Now !
              </button>
            </form>
          </div>

          {/* Right Side - Image Collage */}
          <div className="grid grid-cols-2 gap-4">
            <Image
              src="https://images.unsplash.com/photo-1501594907352-04cda38ebc29"
              alt="Office"
              width={500}
              height={300}
              className="rounded-md object-cover w-full h-full"
            />
            <Image
              src="https://images.unsplash.com/photo-1557804506-669a67965ba0"
              alt="Workspace"
              width={500}
              height={300}
              className="rounded-md object-cover w-full h-full"
            />
            <Image
              src="https://images.unsplash.com/photo-1505691938895-1758d7feb511"
              alt="Building"
              width={500}
              height={300}
              className="rounded-md object-cover w-full h-full"
            />
            <Image
              src="https://images.unsplash.com/photo-1517849845537-4d257902454a"
              alt="Camera"
              width={500}
              height={300}
              className="rounded-md object-cover w-full h-full"
            />
          </div>
        </div>

        {/* Bottom Contact Info */}
        <div className="mt-16">
          <h3 className="text-base text-gray-600 mb-8">Contact For</h3>

          <div className="grid md:grid-cols-3 gap-10">
            {/* General Info */}
            <div>
              <h4 className="font-light text-2xl mb-3 text-black">
                General Information!
              </h4>
              <p className="flex items-center gap-2 text-sm text-black mb-2">
                <FaPhoneAlt className="text-[#018F98]" /> +91-75979-72222
              </p>
              <p className="flex items-center gap-2 text-sm text-gray-700 mb-2">
                <FaEnvelope className="text-[#018F98]" /> hello@mrnmrspet.com
              </p>
              <p className="flex items-start gap-2 text-sm text-gray-700">
                <FaMapMarkerAlt className="text-[#018F98] mt-1" />
                Plot No. 10, Ground Floor, Jayshree Nagar, Malviya Nagar,
                Jaipur, Rajasthan 302017
              </p>
            </div>

            {/* Sales Support */}
            <div>
              <h4 className="font-light text-2xl mb-3 text-black">
                Sales Support !
              </h4>
              <p className="flex items-center gap-2 text-sm text-gray-700 mb-2">
                <FaPhoneAlt className="text-[#018F98]" /> +91-75979-72222
              </p>
              <p className="flex items-center gap-2 text-sm text-gray-700">
                <FaEnvelope className="text-[#018F98]" /> sales@mrnmrspet.com
              </p>
            </div>

            {/* Technical Support */}
            <div>
              <h4 className="font-light text-2xl mb-3 text-black">
                Technical Support !
              </h4>
              <p className="flex items-center gap-2 text-sm text-gray-700 mb-2">
                <FaPhoneAlt className="text-[#018F98]" /> +91-75979-72222
              </p>
              <p className="flex items-center gap-2 text-sm text-gray-700">
                <FaEnvelope className="text-[#018F98]" /> tech@mrnmrspet.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
