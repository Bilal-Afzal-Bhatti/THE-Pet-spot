"use client";
import { use } from "react";
import CatsCareHeroSection from "@/Components/Blogs/Cats-care/CatsCareHeroSection";
import PetsNavbar from "@/Components/Blogs/Cats-care/PetsNavbar";
import GuaranteeBadges from "@/Components/Blogs/LastSection";
import SingleBlog from "@/Components/Blogs/singleBlog";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function SingleBlogPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  return (
    <div>
      <CatsCareHeroSection />
      <PetsNavbar />
      <SingleBlog slug={slug} />
      <GuaranteeBadges />
    </div>
  );
}