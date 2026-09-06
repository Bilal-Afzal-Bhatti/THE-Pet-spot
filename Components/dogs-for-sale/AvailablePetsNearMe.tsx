export default function AvailablePets() {
  const images = [
    { src: "/pets/image1.jpg", name: "Buddy" },
    { src: "/pets/image2.webp", name: "Milo" },
    { src: "/pets/image3.webp", name: "Luna" },
    { src: "/pets/image4.webp", name: "Charlie" },
    { src: "/pets/image5.webp", name: "Bella" },
    { src: "/pets/image1.jpg", name: "Buddy" },
    // { src: "/pets/image2.webp", name: "Milo" },
  ];

  return (
    <section className="py-12 text-center text-black bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading & Subtitle */}
        <h2 className="text-2xl sm:text-3xl font-semibold mb-2">
          Available Dogs & Puppies Near You
        </h2>
        <p className="text-sm text-gray-600 mb-8 max-w-2xl mx-auto">
          Discover more about your favourite dog breed and determine if it suits your lifestyle.
        </p>

        {/* Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {images.map((img, i) => (
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

        {/* Optional View More Button */}
        {/* <div className="px-3 py-1 bg-[#028d8f] hover:bg-[#00595F] hover:cursor-pointer border-2 inline-block mt-10 text-white rounded">
          View More Puppies
        </div> */}

      </div>
    </section>
  );
}