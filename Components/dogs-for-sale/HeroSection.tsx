import Image from "next/image";

export default function HeroSection() {
  return (
    <section
      className="relative w-full flex items-center justify-between px-10 md:px-20 lg:px-52  h-[83vh]"
      style={{
        background: "var(--gradient-hero)",
      }}
    >
      {/* Left Content */}
      <div className="max-w-xl z-10 mt-28">
        <h1 className="text-white text-4xl md:text-4xl font-medium leading-tight mb-6">
          Because every home deserves a loyal companion
        </h1>
        <p className="text-white text-sm md:text-base leading-relaxed">
          Finding a furry companion became easy peasy with Pets Corner. Choose
          your dream pup and bring home tons of happiness and goofiness.
        </p>
      </div>

      {/* Right Image */}
      <div className="relative w-[350px] md:w-[450px] lg:w-[480px] h-[350px] md:h-[450px] mt-28">
        <Image
          src="/dog-listing-hero-img.png"
          alt="Hero Section Dog and Owner"
          fill
          className="object-contain"
          priority
        />
      </div>
    </section>
  );
}
