"use client";
import Image from "next/image";
import { FaRegCalendarAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BlogStore } from "@/Store/BlogStore";

export default function BlogSidebar({ category = "" }: { category?: string }) {
  const router = useRouter();
  const { sidebarBlogs, fetchSidebarBlogs, loading, error } = BlogStore();
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration mismatch for dates
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch sidebar blogs from store when category changes
  useEffect(() => {
    fetchSidebarBlogs(category);
  }, [category, fetchSidebarBlogs]);

  const categories = [
    { name: "Dog Care", slug: "dog-care", count: 285 },
    { name: "Cat Care", slug: "cat-care", count: 46 },
  ];

  return (
    <aside className="w-full px-4">
      {/* Categories */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 border-b pb-2">Categories</h3>
        <ul className="space-y-2">
          {categories.map((cat) => (
            <li
              key={cat.name}
              onClick={() => router.push(`/blog/${cat.slug}`)}
              className="flex justify-between items-center font-semibold text-sm hover:text-[#018F98] cursor-pointer transition-colors"
            >
              <span>{cat.name}</span>
              <span className="text-gray-400 font-normal">({cat.count})</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Ads */}
      <div className="relative w-full h-[200px] mb-6 rounded-md overflow-hidden bg-gray-100">
        <Image
          src="/walking_ad.jpg"
          alt="Ads"
          fill
          className="object-cover"
        />
      </div>

      {/* Other Blogs */}
      <div>
        <h3 className="text-lg font-semibold mb-4 border-b pb-2">
          Other Blogs
        </h3>

        {loading && <p className="text-sm text-gray-500">Loading blogs...</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
        {!loading && sidebarBlogs.length === 0 && (
          <p className="text-sm text-gray-500">No other blogs found.</p>
        )}

        <div className="space-y-4">
          {sidebarBlogs.map((blog) => (
            <div
              key={blog._id}
              className="flex gap-3 items-start cursor-pointer group"
              onClick={() => router.push(`/blog/${blog.slug}`)}
            >
              <div className="w-[80px] h-[60px] relative flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                <Image
                  src={
                    blog.coverImage ||
                    blog.image ||
                    "https://images.unsplash.com/photo-1574158622682-e40e69881006"
                  }
                  alt={blog.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              <div>
                <p className="text-sm font-medium group-hover:text-[#018F98] leading-tight line-clamp-2">
                  {blog.title}
                </p>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <FaRegCalendarAlt className="mr-1" />
                  {isMounted && blog.createdAt
                    ? new Date(blog.createdAt).toLocaleDateString()
                    : "Recent"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}