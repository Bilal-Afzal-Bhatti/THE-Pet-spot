"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import BlogSidebar from "./BlogSidebar";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useEffect, useState } from "react";
import { BlogStore } from "@/Store/BlogStore";

export default function BlogSection() {
  const router = useRouter();
  const { blogsAll, loading, error, page, totalPages, fetchBlogs, setPage } =
    BlogStore();

  const [index, setIndex] = useState(0);

  const images = [
    "/customers/dog1.webp",
    "/customers/dog2.webp",
    "/customers/dog4.webp",
  ];

  const nextSlide = () => setIndex((prev) => (prev + 1) % images.length);
  const prevSlide = () =>
    setIndex((prev) => (prev - 1 + images.length) % images.length);

  // ⭐ Fetch blogs from Zustand
  useEffect(() => {
    fetchBlogs("", page); // "" = all blogs
  }, [page]);

  const goToBlog = (slug: string) => {
    router.push(`/blog/${slug}`); // Navigate to single blog page
  };

  return (
    <section className="max-w-6xl mx-auto py-10 flex flex-col lg:flex-row gap-10">
      {/* LEFT */}
      <div className="w-full lg:w-2/3">
        {/* Slider */}
        <div className="relative mb-8">
          <div className="relative w-full h-[350px] overflow-hidden rounded-md shadow">
            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 z-10 bg-gray-200 p-3 rounded-md"
            >
              <FaArrowLeft />
            </button>

            <img src={images[index]} className="w-full h-full object-cover" />

            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 z-10 bg-gray-200 p-3 rounded-md"
            >
              <FaArrowRight />
            </button>
          </div>
        </div>

        <Image
          src="/blogadd.jpg"
          width={800}
          height={100}
          alt="banner"
          className="pb-10 rounded-md"
        />

        {/* Loading */}
        {loading && <p>Loading blogs...</p>}

        {/* Error */}
        {error && <p className="text-red-600">{error}</p>}

        {/* All Blogs */}
        <div className="grid md:grid-cols-2 gap-6">
          {blogsAll.map((blog: any) => (
            <div
              key={blog._id}
              onClick={() => goToBlog(blog.slug)} // Navigate on click
              className="overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition"
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

        {/* ⭐ Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-3 mt-8">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span className="px-4 py-2 bg-gray-100 rounded">
              Page {page} / {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="w-full lg:w-1/3">
        <div className="lg:sticky lg:top-24">
          <BlogSidebar />
        </div>
      </div>
    </section>
  );
}
