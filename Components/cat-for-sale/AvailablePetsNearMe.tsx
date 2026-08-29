import { availableCatsNearMe } from "@/Data/catsData";
export default function AvailablePets() {
  return (
    <section className=" py-12 text-center text-black mt-0 px-44 bg-white">
      <div className=" mx-auto px-6">
        <h2 className="text-3xl font-semibold mb-2">
          Available Cats & Kittens Near You
        </h2>
        <p className="text-sm mb-8">
          Discover more about your favourite dog breed and determine if it suits
          your lifestyle.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {availableCatsNearMe.map((img, i) => (
            <div
              key={i}
              className="bg-white overflow-hidden shadow-md transform hover:scale-105 transition"
            >
              <img
                src={img.src}
                alt={img.name}
                className="w-full h-44 object-cover"
              />
              <h2 className="text-center text-sm font-semibold text-white bg-[#8957E9] py-1.5">
                {img.name}
              </h2>
            </div>
          ))}
        </div>
        {/* <div className="px-3 py-1 bg-[#028d8f] hover:bg-[#00595F] hover:cursor-pointer border-2 inline mt-40">
          View More Puppies
        </div> */}
      </div>
    </section>
  );
}
