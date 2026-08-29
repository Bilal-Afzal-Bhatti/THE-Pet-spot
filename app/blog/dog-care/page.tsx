import PetsNavbar from "@/Components/Blogs/Cats-care/PetsNavbar";
import DogsCareMainSection from "@/Components/Blogs/Dogs-care/CatsCareMainSection";
import DogssCareHeroSection from "@/Components/Blogs/Dogs-care/DogsCareHeroSection";
import GuaranteeBadges from "@/Components/Blogs/LastSection";

export default function DogCarePage() {
  return (
    <div>
      <DogssCareHeroSection />
      <PetsNavbar />
      <DogsCareMainSection />
      <GuaranteeBadges />
    </div>
  );
}
