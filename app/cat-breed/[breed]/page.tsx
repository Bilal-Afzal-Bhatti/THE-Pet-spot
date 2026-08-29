import CatBreedInfoHeroSection from "@/Components/CatBreed/CatBreedInfoPage/CatBreedInfoHeroSection";
import BreederBanner from "@/Components/DogBreed/BreedInfoPage/BreederBanner";
import BreedInfoMainSection from "@/Components/DogBreed/BreedInfoPage/BreedInfoMainSection";
import BreedNavbar from "@/Components/DogBreed/BreedInfoPage/BreedNavbar";
import BreedWhyMMP from "@/Components/DogBreed/BreedInfoPage/BreedWhyMMP";

export default function BreedPage() {
  return (
    <div>
      <BreedNavbar />
      <CatBreedInfoHeroSection />
      <BreedInfoMainSection />
      <BreederBanner />
      <BreedWhyMMP />
    </div>
  );
}
