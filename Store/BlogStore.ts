import { create } from "zustand";
import axios from "axios";

interface BlogStoreType {
  blogsAll: any[];
  blogsDogs: any[];
  blogsCats: any[];

  page: number;
  totalPages: number;
  loading: boolean;
  error: string | null;

  singleBlog: any | null; // For single blog

  fetchBlogs: (category?: string, page?: number) => Promise<void>;
  fetchSingleBlog: (slug: string) => Promise<void>; // New method
  setPage: (page: number) => void;
}

const Base_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export const BlogStore = create<BlogStoreType>((set, get) => ({
  blogsAll: [],
  blogsDogs: [],
  blogsCats: [],

  page: 1,
  totalPages: 1,
  loading: false,
  error: null,
  singleBlog: null,

  setPage: (page) => set({ page }),

  fetchBlogs: async (category = "", page = 1) => {
    try {
      set({ loading: true, error: null });

      const url = `${Base_URL}/api/admin/blogs/get-all?category=${category}&page=${page}&limit=10`;
      const response = await axios.get(url);
      const data = response.data;
      console.log(data);
      if (!data) return set({ error: "Failed to fetch blogs", loading: false });

      const blogs = data.blogs || [];
      const pagination = data.pagination || {};

      if (category === "dogs") set({ blogsDogs: blogs });
      else if (category === "cats") set({ blogsCats: blogs });
      else set({ blogsAll: blogs });

      set({
        page: pagination.page || page,
        totalPages: pagination.totalPages || 1,
      });

      console.log("Fetched blogs successfully:", blogs);
    } catch (err: any) {
      set({ error: err.message || "Something went wrong", loading: false });
    } finally {
      set({ loading: false });
    }
  },

  // ✅ Fetch a single blog by slug
  fetchSingleBlog: async (slug: string) => {
    try {
      set({ loading: true, error: null, singleBlog: null });
      // http://localhost:8000/api/admin/blogs/get-single/the-joys-and-challenges-of-owning-a-pet
      const url = `${Base_URL}/api/admin/blogs/get-single/${slug}`;
      const response = await axios.get(url);
      const data = response.data;

      if (!data || !data.success) {
        return set({ error: "Failed to fetch the blog", loading: false });
      }

      set({ singleBlog: data.blog });
      console.log("Fetched single blog:", data.blog);
    } catch (err: any) {
      set({ error: err.message || "Something went wrong", loading: false });
    } finally {
      set({ loading: false });
    }
  },
}));
