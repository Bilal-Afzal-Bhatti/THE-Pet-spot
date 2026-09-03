import { create } from "zustand";
import { api } from "@/utils/api/axiosInstance";

export interface Breed {
  _id: string;
  name: string;
  category: string;
  image?: string;
  maxWeight?: string | number;
  weight?: string | number;
  maxHeight?: string | number;
  height?: string | number;
  maxLife?: string | number;
  life?: string | number;
  lifeSpan?: string | number;
  suitableFor?: string[];
  createdAt: string;
  [key: string]: any;
}

interface BreedState {
  breeds: Breed[];
  total: number;
  page: number;
  pages: number;
  limit: number;
  loading: boolean;
  error: string | null;
  category: string;
  search: string;

  setCategory: (category: string) => void;
  setSearch: (search: string) => void;
  setPage: (page: number) => void;
  fetchBreeds: () => Promise<void>;
}

export const useBreedStore = create<BreedState>((set, get) => ({
  breeds: [],
  total: 0,
  page: 1,
  pages: 1,
  limit: 12,
  loading: false,
  error: null,
  category: "all",
  search: "",

  setCategory: (category: string) => {
    set({ category, page: 1 });
    get().fetchBreeds();
  },

  setSearch: (search: string) => {
    set({ search, page: 1 });
    get().fetchBreeds();
  },

  setPage: (page: number) => {
    set({ page });
    get().fetchBreeds();
  },

  fetchBreeds: async () => {
    set({ loading: true, error: null });
    try {
      const { category, search, page, limit } = get();

      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", limit.toString());
      
      if (category && category !== "all") {
        params.append("category", category);
      }
      if (search.trim()) {
        params.append("search", search.trim());
      }

      const response = await api.get(`/api/admin/breeds?${params.toString()}`);
      const data = response.data;

      set({
        breeds: data.breeds || [],
        total: data.total || 0,
        pages: data.pages || 1,
        loading: false,
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || err.message || "Failed to fetch breeds",
        loading: false,
      });
    }
  },
}));