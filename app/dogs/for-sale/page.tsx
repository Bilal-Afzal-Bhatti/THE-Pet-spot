import AreYouResponsible from "@/Components/dogs-for-sale/AreYouResponsible";
import AvailablePets from "@/Components/dogs-for-sale/AvailablePetsNearMe";
import BlogSection from "@/Components/dogs-for-sale/BlogSection";
import PetListingPage from "@/Components/dogs-for-sale/dogsListingPage";
import FAQSection from "@/Components/dogs-for-sale/FAQSection";
import Feedback from "@/Components/dogs-for-sale/feedback";
import HeroSection from "@/Components/dogs-for-sale/HeroSection";
import NotFoundPets from "@/Components/dogs-for-sale/NotFoundPets";
import PopularDogSearches from "@/Components/dogs-for-sale/PopularDogSearches";
import ThingsToConsider from "@/Components/dogs-for-sale/ThingsToConsider";
import WinningFormula from "@/Components/dogs-for-sale/WinningFormula";
import Footer from "@/Components/LandingPage/Footer";
import Navbar from "@/Components/Navbar";

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
      <PopularDogSearches />
      {/* <Feedback /> */}
      {/* <FAQSection /> */}
      <BlogSection />
      {/* <Footer /> */}
    </div>
  );
}
