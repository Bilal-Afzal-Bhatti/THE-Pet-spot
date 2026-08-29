"use client";
import Image from "next/image";
import { FaRegCalendarAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  image: string;
  createdAt: string;
  category: string;
}

export default function BlogSidebar({ category = "" }: { category?: string }) {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const page = 1;
  const limit = 6;
  const Base_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(
          `${Base_URL}/api/admin/blogs/get-all?category=${category}&page=${page}&limit=${limit}`
        );
        setBlogs(res.data.blogs);
      } catch (err: any) {
        setError(err.message || "Failed to fetch blogs");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [category]);

  const categories = [
    { name: "Dog Care", count: 285 },
    { name: "Cat Care", count: 46 },
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
              className="flex gap-2 font-semibold text-sm hover:text-[#018F98] cursor-pointer"
            >
              <span>{cat.name}</span>
              <span>({cat.count})</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Ads */}
      <Image
        src="/walking_ad.jpg"
        alt="Ads"
        width={600}
        height={200}
        className="mb-6"
      />

      {/* Other Blogs */}
      <div>
        <h3 className="text-lg font-semibold mb-4 border-b pb-2">
          Other Blogs
        </h3>

        {loading && <p>Loading blogs...</p>}
        {error && <p className="text-red-600">{error}</p>}

        <div className="space-y-4">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="flex gap-3 items-start cursor-pointer"
              onClick={() => router.push(`/blog/${blog.slug}`)}
            >
              <div className="w-[80px] h-[60px] relative flex-shrink-0">
                <Image
                  src={blog.image}
                  alt={blog.title}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
              <div>
                <p className="text-sm font-medium hover:text-[#018F98] leading-tight">
                  {blog.title}
                </p>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <FaRegCalendarAlt className="mr-1" />
                  {new Date(blog.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
