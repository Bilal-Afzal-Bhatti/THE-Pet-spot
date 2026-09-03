"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import BlogSidebar from "../BlogSidebar";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useEffect, useState } from "react";
import { BlogStore } from "@/Store/BlogStore";

export default function DogsCareMainSection() {
  const router = useRouter();
  const { blogsDogs, fetchBlogs, page, setPage, totalPages, loading, error } =
    BlogStore();
  const [index, setIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration mismatch by tracking client mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // ⭐ Fetch Dog Care blogs from API using the exact database category key
  useEffect(() => {
    fetchBlogs("dog-care", page);
  }, [page]);

  // Reset slider index if blogs list changes or shrinks
  useEffect(() => {
    setIndex(0);
  }, [blogsDogs.length]);

  const nextSlide = () => {
    if (blogsDogs.length === 0) return;
    setIndex((prev) => (prev + 1) % blogsDogs.length);
  };

  const prevSlide = () => {
    if (blogsDogs.length === 0) return;
    setIndex((prev) => (prev - 1 + blogsDogs.length) % blogsDogs.length);
  };

  const goToBlog = (slug: string) => {
    router.push(`/blog/${slug}`); // Navigate to single blog page
  };

  // Get current slide blog dynamically from DB data
  const currentFeaturedBlog = blogsDogs[index];

  return (
    <section className="max-w-6xl mx-auto py-10 flex flex-col lg:flex-row gap-10">
      {/* LEFT: Main Blog Area */}
      <div className="w-full lg:w-2/3">
        {/* Featured blog slider using DB data */}
        {blogsDogs.length > 0 && currentFeaturedBlog ? (
          <div className="relative mb-8">
            <div className="relative w-full h-[350px] overflow-hidden rounded-md shadow bg-gray-100">
              {blogsDogs.length > 1 && (
                <button
                  onClick={prevSlide}
                  aria-label="Previous"
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-700 p-3 rounded-md shadow transition"
                >
                  <FaArrowLeft />
                </button>
              )}

              <Image
                src={
                  currentFeaturedBlog.coverImage ||
                  currentFeaturedBlog.image ||
                  "https://images.unsplash.com/photo-1552053831-71594a27632d"
                }
                alt={currentFeaturedBlog.title}
                fill
                className="object-cover transition-all duration-500 ease-in-out cursor-pointer"
                onClick={() => goToBlog(currentFeaturedBlog.slug)}
                priority
              />

              {blogsDogs.length > 1 && (
                <button
                  onClick={nextSlide}
                  aria-label="Next"
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-700 p-3 rounded-md shadow transition"
                >
                  <FaArrowRight />
                </button>
              )}
            </div>

            {/* Overlay text from DB */}
            <div className="absolute bottom-4 left-4 text-white pointer-events-none drop-shadow-md">
              <span className="bg-yellow-500 text-xs px-2 py-1 rounded uppercase font-semibold">
                {currentFeaturedBlog.category || "Dog Care"}
              </span>
              <h2
                onClick={() => goToBlog(currentFeaturedBlog.slug)}
                className="text-xl font-semibold mt-2 cursor-pointer hover:underline pointer-events-auto"
              >
                {currentFeaturedBlog.title}
              </h2>
              <p className="text-sm mt-1">
                By {currentFeaturedBlog.author || "Admin"} |{" "}
                {isMounted && currentFeaturedBlog.createdAt
                  ? new Date(currentFeaturedBlog.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })
                  : "Recent"}
              </p>
            </div>
          </div>
        ) : null}

        <div className="bg-[#018F98] block w-fit text-white text-lg font-semibold px-4 py-2 rounded-md mb-5">
          Dog Care
        </div>

        {/* Loading */}
        {loading && <p className="text-gray-500 py-4">Loading blogs...</p>}

        {/* Error */}
        {error && <p className="text-red-600 py-4">{error}</p>}

        {/* Blog Grid */}
        {!loading && !error && blogsDogs.length === 0 ? (
          <p className="text-gray-500 py-4">No dog care blogs found.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-3">
            {blogsDogs.map((blog: any) => (
              <div
                key={blog._id}
                onClick={() => goToBlog(blog.slug)}
                className="overflow-hidden shadow-sm bg-white rounded-md cursor-pointer hover:shadow-md transition flex flex-col"
              >
                <div className="relative w-full h-48">
                  <Image
                    src={
                      blog.coverImage ||
                      blog.image ||
                      "https://images.unsplash.com/photo-1552053831-71594a27632d"
                    }
                    alt={blog.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-3 flex flex-col flex-1">
                  <p className="text-xs text-[#018F98] font-medium capitalize">
                    {blog.category}
                  </p>
                  <h3 className="font-semibold text-sm mt-1">{blog.title}</h3>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                    {blog.excerpt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

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