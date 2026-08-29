"use client";
import Image from "next/image";
import BlogSidebar from "./BlogSidebar";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useEffect, useState } from "react";
import { BlogStore } from "@/Store/BlogStore";

interface BlogDetailProps {
  slug: string; // slug of the blog you want to fetch
}

export default function SingleBlog({ slug }: BlogDetailProps) {
  const { singleBlog, fetchSingleBlog, loading, error } = BlogStore();
  const [index, setIndex] = useState(0);

  const IMAGES = [
    "https://images.unsplash.com/photo-1574158622682-e40e69881006",
    "https://images.unsplash.com/photo-1518791841217-8f162f1e1131",
    "https://images.unsplash.com/photo-1601758174888-3729b23d23e3",
  ];

  const nextSlide = () => setIndex((prev) => (prev + 1) % IMAGES.length);
  const prevSlide = () =>
    setIndex((prev) => (prev - 1 + IMAGES.length) % IMAGES.length);

  // ⭐ Fetch single blog by slug
  useEffect(() => {
    if (slug) fetchSingleBlog(slug);
  }, [slug]);

  if (loading) return <p>Loading blog...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!singleBlog) return <p>No blog found.</p>;

  return (
    <section className="max-w-6xl mx-auto py-10 flex flex-col lg:flex-row gap-10">
      {/* LEFT: Blog Content */}
      <div className="w-full lg:w-2/3">
        {/* Featured Image */}
        <div className="relative w-full h-[350px] mb-6 rounded-md overflow-hidden shadow">
          <Image
            src={singleBlog.image}
            alt={singleBlog.title}
            fill
            className="object-cover"
          />
        </div>

        {/* Blog Content */}
        <div className="p-3 bg-white shadow-sm rounded-md">
          <p className="text-xs text-[#018F98] font-medium">
            {singleBlog.category}
          </p>
          <h1 className="text-2xl font-bold mt-1">{singleBlog.title}</h1>
          <p className="text-sm text-gray-500 mt-1">
            By {singleBlog.author?.name} |{" "}
            {new Date(singleBlog.createdAt).toDateString()}
          </p>
          <div
            className="mt-4 text-gray-700"
            dangerouslySetInnerHTML={{ __html: singleBlog.content }}
          />
        </div>
      </div>

      {/* RIGHT Sidebar */}
      <div className="w-full lg:w-1/3">
        <div className="lg:sticky lg:top-24">
          <BlogSidebar />
        </div>
      </div>
    </section>
  );
}
