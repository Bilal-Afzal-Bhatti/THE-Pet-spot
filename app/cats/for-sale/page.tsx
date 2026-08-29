import AvailablePets from "@/Components/cat-for-sale/AvailablePetsNearMe";
import PetListingPage from "@/Components/cat-for-sale/catsListingPage";
import PopularCatSearches from "@/Components/cat-for-sale/PopularCatSearches";
import ThingsToConsider from "@/Components/cat-for-sale/ThingsToConsider";
import WinningFormula from "@/Components/cat-for-sale/WinningFormula";
import BlogSection from "@/Components/dogs-for-sale/BlogSection";
import HeroSection from "@/Components/dogs-for-sale/HeroSection";


export default function DogsForSalePage() {
  return (
    <div>
      {/* <Navbar /> */}
      <HeroSection />
      <PetListingPage />
      {/* <NotFoundPets /> */}
      <ThingsToConsider />
      <AvailablePets />
      <WinningFormula />
      {/* <AreYouResponsible /> */}
      <PopularCatSearches />
      {/* <Feedback /> */}
      {/* <FAQSection /> */}
      <BlogSection />
      {/* <Footer /> */}
    </div>
  );
}
