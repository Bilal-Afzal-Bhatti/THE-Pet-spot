"use client";
import Image from "next/image";

export default function NotFoundPets() {
  return (
    <section className="w-full min-h-screen px-44 bg-white flex flex-col md:flex-row items-center justify-center  py-16 md:py-24">
      {/* Left Side Image */}
      <div className="md:w-4/12 w-full flex justify-center mb-10 md:mb-0">
        <div className="relative w-[320px] md:w-[340px]">
          <Image
            src="/listing-form.webp" // replace with your actual image path
            alt="Man holding dog"
            width={380}
            height={380}
            className="rounded-2xl object-cover"
          />
        </div>
      </div>

      {/* Right Side Form */}
      <div className="md:w-7/12 w-full md:pl-8 lg:pl-16">
        <h2 className="text-xl md:text-xl font-medium text-gray-800 mb-2">
          Hey! Still not found what you are looking for?
        </h2>
        <p className="text-gray-500 text-sm md:text-sm mb-8 leading-relaxed">
          No worries!! Let our pet experts come to your rescue. Fill in your
          details and we will give you a call. Our MMP experts have successfully
          helped in completing 4000+ families by finding and connecting them to
          their lovable furbabies across India.
        </p>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
          {/* Name */}
          <div>
            <input
              type="text"
              placeholder="Your Name"
              className="w-full border-b border-gray-300 focus:border-purple-500 outline-none text-base py-2"
              required
            />
          </div>

          {/* Contact No */}
          <div>
            <input
              type="text"
              placeholder="Contact No"
              className="w-full border-b border-gray-300 focus:border-purple-500 outline-none text-sm py-2"
            />
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Email"
              className="w-full border-b border-gray-300 focus:border-purple-500 outline-none text-sm py-2"
            />
          </div>

          {/* Dogs */}
          <div>
            <select className="w-full border-b border-gray-300 focus:border-purple-500 outline-none text-sm py-2 bg-transparent text-gray-500">
              <option value="">Cats</option>
              <option value="">Dogs</option>
              <option value="">Small pets</option>
            </select>
          </div>

          {/* Breed */}
          <div>
            <select className="w-full border-b border-gray-300 focus:border-purple-500 outline-none text-sm py-2 bg-transparent text-gray-500">
              <option value="">Breed</option>
            </select>
          </div>

          {/* Gender */}
          <div>
            <select className="w-full border-b border-gray-300 focus:border-purple-500 outline-none text-sm py-2 bg-transparent text-gray-500">
              <option value="">Gender</option>
            </select>
          </div>

          {/* Are you a Pet Parent */}
          <div>
            <select className="w-full border-b border-gray-300 focus:border-purple-500 outline-none text-sm py-2 bg-transparent text-gray-500">
              <option value="">Are you a Pet Parent?</option>
            </select>
          </div>

          {/* Plan to Purchase */}
          <div>
            <select className="w-full border-b border-gray-300 focus:border-purple-500 outline-none text-sm py-2 bg-transparent text-gray-500">
              <option value="">Plan to Purchase</option>
            </select>
          </div>

          {/* Schedule a call */}
          <div>
            <input
              type="text"
              placeholder="Schedule a call"
              className="w-full border-b border-gray-300 focus:border-purple-500 outline-none text-sm py-2"
            />
          </div>

          {/* Location */}
          <div>
            <input
              type="text"
              placeholder="Location"
              className="w-full border-b border-gray-300 focus:border-purple-500 outline-none text-sm py-2"
            />
          </div>

          {/* Remark */}
          <div className="md:col-span-2">
            <textarea
              rows={3}
              placeholder="Remark..."
              className="w-full border-b border-gray-300 focus:border-purple-500 outline-none text-sm py-2 resize-none"
            ></textarea>
          </div>

          {/* Button */}
          <div className="md:col-span-2 flex justify-end mt-2">
            <button
              type="button"
              className="bg-[#8E5AF7] hover:bg-[#7a47df] text-white px-12 py-4 rounded-md  font-medium transition-all duration-300"
            >
              Let&apos;s Roll
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
