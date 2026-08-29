import { FiArrowRight } from "react-icons/fi";

export default function AreYouResponsible() {
  return (
    <section className="bg-[#FFFFFF] py-20 px-6 lg:px-44">
      <div
        className="bg-white rounded-2xl px-8 py-4 relative overflow-hidden flex flex-col lg:flex-row justify-between items-center gap-6
                   shadow-[0_0_20px_rgba(0,0,0,0.1)]"
      >
        {/* LEFT CONTENT */}
        <div className="text-center lg:text-left">
          <h3 className="text-xl font-medium text-gray-900 mb-3">
            Are you a responsible breeder?
          </h3>
          <p className="text-gray-700  mb-6">
            Be part of our pet-lovers community — list your litters online and
            get discovered nationwide!
          </p>
        </div>

        {/* BUTTON */}
        <button
          className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-medium
                     w-28 h-12 rounded flex items-center justify-center
                     gap-2 transition-all duration-200 shrink-0"
        >
          Join Now!
        </button>
      </div>
    </section>
  );
}
