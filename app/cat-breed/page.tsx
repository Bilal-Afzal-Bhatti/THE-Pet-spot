import CatBreedListing from "@/Components/CatBreed/CatBreedListing";
import DogBreedHeroSection from "@/Components/DogBreed/DogBreedHeroSection";
import NotFoundPets from "@/Components/dogs-for-sale/NotFoundPets";

export default function catBreed() {
  return (
    <div>
      <DogBreedHeroSection />
      <CatBreedListing />
      <NotFoundPets />
    </div>
  );
}
