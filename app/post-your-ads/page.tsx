import PetsAd from "@/Components/PetsAd";
import HeroSection from "../components/HeroSection";

export default function PostYourAdsPage() {
  return (
    <div>
      <HeroSection
        title="About Pets Corner"
        bgImage="/aboutBg.webp"
        currentPage="Pet for sale"
      />

      <PetsAd />
    </div>
  );
}
