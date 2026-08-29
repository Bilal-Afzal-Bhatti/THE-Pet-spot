import CatsCareHeroSection from "@/Components/Blogs/Cats-care/CatsCareHeroSection";
import CatsCareMainSection from "@/Components/Blogs/Cats-care/CatsCareMainSection";
import PetsNavbar from "@/Components/Blogs/Cats-care/PetsNavbar";
import GuaranteeBadges from "@/Components/Blogs/LastSection";

export default function catCarePage() {
  return (
    <div>
      <CatsCareHeroSection />
      <PetsNavbar />
      <CatsCareMainSection />
      <GuaranteeBadges />
    </div>
  );
}
