import { availableCatsNearMe } from "@/Data/catsData";

export default function AvailablePets() {
  return (
    <section className="py-12 text-center text-black bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading & Subtitle */}
        <h2 className="text-2xl sm:text-3xl font-semibold mb-2">
          Available Cats & Kittens Near You
        </h2>
        <p className="text-sm text-gray-600 mb-8 max-w-2xl mx-auto">
          Discover more about your favourite cat breed and determine if it suits your lifestyle.
        </p>

        {/* Responsive Grid: 2 columns on mobile, 3 on tablet, 6 on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {availableCatsNearMe.map((img, i) => (
            <div
              key={i}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transform hover:scale-105 transition duration-200"
            >
              <img
                src={img.src}
                alt={img.name}
                className="w-full h-36 sm:h-44 object-cover"
              />
              <h3 className="text-center text-xs sm:text-sm font-semibold text-white bg-[#8957E9] py-1.5 px-2 truncate">
                {img.name}
              </h3>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}