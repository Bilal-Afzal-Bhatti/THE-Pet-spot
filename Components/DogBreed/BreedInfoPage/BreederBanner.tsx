"use client";

import Image from "next/image";
import { FaAngleRight } from "react-icons/fa";

export default function BreederBanner() {
  return (
    <div className="  max-w-6xl mx-auto bg-white">
      <div className=" mx-auto px-6 flex flex-col md:flex-row items-center justify-between rounded-md py-7">
        <div className="flex items-center gap-3 text-center md:text-left">
          <div className="w-10 h-10 flex items-center justify-center rounded bg-amber-100">
            <Image
              src="/breed_register.webp"
              alt="Breed Register"
              height={36}
              width={36}
              className="object-contain object-center"
            />
          </div>
          <div>
            <div className="text-lg font-semibold text-[#17a2b8]">
              ARE YOU A BREEDER?
            </div>
            <div className="text-base text-black">
              It takes only a few clicks to connect with genuine pet lovers.
              <span className="text-[#17a2b8] font-medium ml-1">
                Register Now!
              </span>
            </div>
          </div>
        </div>

        <button className="mt-5 md:mt-0 bg-[#028d8f] text-white px-5 py-3 rounded-full text-xs hover:bg-[#037273] flex items-center">
          Add Your Pet
          <FaAngleRight className="ml-2" />
        </button>
      </div>
    </div>
  );
}
