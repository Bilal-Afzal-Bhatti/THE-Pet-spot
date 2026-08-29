"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import BlogSidebar from "../BlogSidebar";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useEffect, useState } from "react";
import { BlogStore } from "@/Store/BlogStore";

export default function CatsCareMainSection() {
  const router = useRouter();
  const { blogsCats, fetchBlogs, page, setPage, totalPages, loading, error } =
    BlogStore();
  const [index, setIndex] = useState(0);

  const IMAGES = [
    "https://images.unsplash.com/photo-1574158622682-e40e69881006",
    "https://images.unsplash.com/photo-1518791841217-8f162f1e1131",
    "https://images.unsplash.com/photo-1601758174888-3729b23d23e3",
  ];

  const nextSlide = () => setIndex((prev) => (prev + 1) % IMAGES.length);
  const prevSlide = () =>
    setIndex((prev) => (prev - 1 + IMAGES.length) % IMAGES.length);

  // ⭐ Fetch Cats blogs from API
  useEffect(() => {
    fetchBlogs("cats", page);
  }, [page]);

  const goToBlog = (slug: string) => {
    router.push(`/blog/${slug}`); // Navigate to single blog page
  };

  return (
    <section className="max-w-6xl mx-auto py-10 flex flex-col lg:flex-row gap-10">
      {/* LEFT: Main Blog Area */}
      <div className="w-full lg:w-2/3">
        {/* Featured blog slider */}
        <div className="relative mb-8">
          <div className="relative w-full h-[350px] overflow-hidden rounded-md shadow ">
            <button
              onClick={prevSlide}
              aria-label="Previous"
              className="absolute left-2 top-1/2 z-10 bg-gray-200 hover:bg-gray-300 text-gray-700 p-3 rounded-md"
            >
              <FaArrowLeft />
            </button>

            <img
              src={IMAGES[index]}
              alt="Featured"
              className="w-full h-full object-cover transition-all duration-500 ease-in-out"
            />

            <button
              onClick={nextSlide}
              aria-label="Next"
              className="absolute right-2 top-1/2 z-10 bg-gray-200 hover:bg-gray-300 text-gray-700 p-3 rounded-md"
            >
              <FaArrowRight />
            </button>
          </div>

          {/* Overlay text */}
          <div className="absolute bottom-4 left-4 text-white">
            <span className="bg-yellow-500 text-xs px-2 py-1 rounded">
              Cat Care
            </span>
            <h2 className="text-xl font-semibold mt-2">
              Winter Food Guide For Cats
            </h2>
            <p className="text-sm">By Debopriya Ghosh | October 2025</p>
          </div>
        </div>

        <div className="bg-[#018F98] block w-fit text-white text-lg font-semibold px-4 py-2 rounded-md mb-5">
          Cat Care
        </div>

        {/* Loading */}
        {loading && <p>Loading blogs...</p>}

        {/* Error */}
        {error && <p className="text-red-600">{error}</p>}

        {/* Blog Grid */}
        <div className="grid md:grid-cols-3 gap-3">
          {blogsCats.map((blog: any) => (
            <div
              key={blog._id}
              onClick={() => goToBlog(blog.slug)} // Navigate on click
              className="overflow-hidden shadow-sm bg-white rounded-md cursor-pointer hover:shadow-md transition"
            >
              <div className="relative w-full h-48">
                <Image
                  src={blog.image}
                  alt={blog.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-3">
                <p className="text-xs text-[#018F98] font-medium">
                  {blog.category}
                </p>
                <h3 className="font-semibold text-sm">{blog.title}</h3>
                <p className="text-xs text-gray-600 mt-1">{blog.excerpt}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className={`px-4 py-2 text-sm font-medium rounded transition-all ${
                page === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-[#E0F7F8] text-[#018F98] hover:bg-[#C9F0F2]"
              }`}
            >
              Previous Page
            </button>

            <div className="text-sm text-gray-700">
              Page {page} of {totalPages}
            </div>

            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page >= totalPages}
              className={`px-4 py-2 text-sm font-medium rounded transition-all ${
                page >= totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-[#E0F7F8] text-[#018F98] hover:bg-[#C9F0F2]"
              }`}
            >
              Next Page
            </button>
          </div>
        )}
      </div>

      {/* RIGHT: Sidebar */}
      <div className="w-full lg:w-1/3">
        <div className="lg:sticky lg:top-24">
          <BlogSidebar />
        </div>
      </div>
    </section>
  );
}
