import BreedListing from "@/Components/DogBreed/BreedListing";
import DogBreedHeroSection from "@/Components/DogBreed/DogBreedHeroSection";
import NotFoundPets from "@/Components/dogs-for-sale/NotFoundPets";

export default function DogsPage() {
  return (
    <div>
      <DogBreedHeroSection />
      <BreedListing />
      <NotFoundPets/>
    </div>
  );
}
