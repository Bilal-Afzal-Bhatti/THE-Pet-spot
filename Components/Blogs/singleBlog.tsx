"use client";
import Image from "next/image";
import BlogSidebar from "./BlogSidebar";
import { useEffect, useState } from "react";
import { BlogStore } from "@/Store/BlogStore";

interface BlogDetailProps {
  slug: string; // slug of the blog you want to fetch
}

export default function SingleBlog({ slug }: BlogDetailProps) {
  const { singleBlog, fetchSingleBlog, loading, error } = BlogStore();
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration mismatch for dates
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // ⭐ Fetch single blog by slug
  useEffect(() => {
    if (slug) {
      fetchSingleBlog(slug);
    }
  }, [slug, fetchSingleBlog]);

  if (loading) return <p className="text-center py-10 text-gray-500">Loading blog...</p>;
  if (error) return <p className="text-center py-10 text-red-500">{error}</p>;
  if (!singleBlog) return <p className="text-center py-10 text-gray-500">No blog found.</p>;

  return (
    <section className="max-w-6xl mx-auto py-10 flex flex-col lg:flex-row gap-10">
      {/* LEFT: Blog Content */}
      <div className="w-full lg:w-2/3">
        {/* Featured Image */}
        <div className="relative w-full h-[350px] mb-6 rounded-md overflow-hidden shadow bg-gray-100">
          <Image
            src={
              singleBlog.coverImage ||
              singleBlog.image ||
              "https://images.unsplash.com/photo-1574158622682-e40e69881006"
            }
            alt={singleBlog.title || "Blog Image"}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Blog Details & Content */}
        <div className="p-4 bg-white shadow-sm rounded-md">
          <p className="text-xs text-[#018F98] font-semibold uppercase tracking-wide">
            {singleBlog.category || "General"}
          </p>
          <h1 className="text-2xl font-bold mt-2 text-gray-900">{singleBlog.title}</h1>
          <p className="text-sm text-gray-500 mt-1">
            By {typeof singleBlog.author === "object" ? singleBlog.author?.name : singleBlog.author || "Admin"} |{" "}
            {isMounted && singleBlog.createdAt
              ? new Date(singleBlog.createdAt).toDateString()
              : "Recent"}
          </p>
          <div
            className="mt-6 text-gray-700 prose max-w-none leading-relaxed"
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