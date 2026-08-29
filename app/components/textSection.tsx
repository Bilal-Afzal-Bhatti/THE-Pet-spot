interface TextSectionProps {
  heading: string;
  paragraphs: string[];
}

export default function TextSection({ heading, paragraphs }: TextSectionProps) {
  return (
    <section className="py-4 bg-white text-center">
      <div className="flex flex-wrap items-center justify-center gap-8 pb-16 text-lg">
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

      <div className="max-w-6xl mx-auto px-6">
        <div className="bg-[#018F98] text-center block px-8 py-2 rounded-md mb-8">
          <h2 className="text-white text-xl font-semibold block">{heading}</h2>
        </div>
        {paragraphs && (
          <ol className="list-decimal pl-6 text-left space-y-3 text-gray-700 text-base leading-relaxed">
            {paragraphs.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
