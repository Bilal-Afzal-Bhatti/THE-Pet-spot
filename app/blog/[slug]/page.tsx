"use client";

import { useParams } from "next/navigation";
import CatsCareHeroSection from "@/Components/Blogs/Cats-care/CatsCareHeroSection";
import PetsNavbar from "@/Components/Blogs/Cats-care/PetsNavbar";
import GuaranteeBadges from "@/Components/Blogs/LastSection";
import SingleBlog from "@/Components/Blogs/singleBlog";

export default function SingleBlogPage() {
  const params = useParams();
  const { slug } = params;

  return (
    <div>
      <CatsCareHeroSection />
      <PetsNavbar />
      <SingleBlog slug={slug as string} /> 
      <GuaranteeBadges />
    </div>
  );
}
