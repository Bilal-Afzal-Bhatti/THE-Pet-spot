import HeroSection from "@/Components/Blogs/blogHeroSection";
import BlogSection from "@/Components/Blogs/BlogSection";
import BlogsNavbar from "@/Components/Blogs/BlogsNavbar";
import GuaranteeBadges from "@/Components/Blogs/LastSection";

export default function blogPage() {
  return (
    <div>
      <HeroSection />
      <BlogsNavbar />
      <BlogSection />
      <GuaranteeBadges />
    </div>
  );
}
