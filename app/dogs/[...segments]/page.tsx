import NotFoundPets from "@/Components/cat-for-sale/NotFoundPets";
import HeroSection from "@/Components/dogs-for-sale/HeroSection";
import DogsCatchAllPage from "@/Components/ForSale/DogsCatchAllPage";
import Navbar from "@/Components/Navbar";
import BlogSection from "@/Components/dogs-for-sale/BlogSection";
import Footer from "@/Components/LandingPage/Footer";

export default function DogSegmentsPage() {
  return (
    <div>
      {/* <Navbar /> */}

      <HeroSection />
      <DogsCatchAllPage />
      <NotFoundPets />
      <BlogSection />
      {/* <Footer /> */}
    </div>
  );
}
