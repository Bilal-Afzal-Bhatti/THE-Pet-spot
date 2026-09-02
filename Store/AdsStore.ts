import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

// const Base_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
// Get current hostname safely for client-side evaluation if needed
const hostname = typeof window !== 'undefined' ? window.location.hostname : '';

// Determine base URL dynamically based on environment or fallback rules
let Base_URL: string;

if (process.env.NEXT_PUBLIC_API_BASE_URL) {
  // Best practice: Read directly from environment variable
  Base_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
} else if (hostname === 'localhost' || hostname === '127.0.0.1') {
  // Local development fallback
  Base_URL = 'http://localhost:5000';
} else {
  // Production fallback (or throw an error if you want strict env enforcement)
  Base_URL = 'https://the-pet-spot-backend.vercel.app';
}

console.log("BASE_URL:", Base_URL);
export { Base_URL };
// Reusable Image Formatter Helper
const getImageUrl = (imagePath?: string) => {
  if (!imagePath) return "/default-pet.jpg";
  if (imagePath.startsWith("http")) return imagePath; // Full URL already
  return `${Base_URL}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
};

interface AdState {
  isPosting: boolean;
  isDeleting: boolean;
  isUpdating: boolean;
  isLoading: boolean;
  postAd: (formData: FormData) => Promise<boolean>;
  deleteAd: (adId: string) => Promise<boolean>;
  updateAd: (adId: string, formData: FormData) => Promise<boolean>;
  getUserAds: () => Promise<any[]>;
  getApprovedDogAds: (page?: number, limit?: number) => Promise<any>;
  getApprovedDogAdById: (id: string) => Promise<any>;
  getApprovedCatAds: (page?: number, limit?: number) => Promise<any>;
  getApprovedCatAdById: (id: string) => Promise<any>;
}

export const useAdStore = create<AdState>((set, get) => ({
  isPosting: false,
  isDeleting: false,
  isUpdating: false,
  isLoading: false,

  postAd: async (formData: FormData) => {
    set({ isPosting: true });
    try {
      const res = await axios.post(`${Base_URL}/api/ads`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success(res.data.message || "Ad posted successfully");
      return true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to post ad");
      } else {
        toast.error("Failed to post ad");
      }
      return false;
    } finally {
      set({ isPosting: false });
    }
  },

  deleteAd: async (adId) => {
    set({ isDeleting: true });
    try {
      const res = await axios.delete(`${Base_URL}/api/ads/${adId}`, {
        withCredentials: true,
      });
      toast.success(res.data.message || "Ad deleted successfully");
      return true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to delete ad");
      } else {
        toast.error("Failed to delete ad");
      }
      return false;
    } finally {
      set({ isDeleting: false });
    }
  },

  updateAd: async (adId, formData) => {
    set({ isUpdating: true });
    try {
      const res = await axios.patch(`${Base_URL}/api/ads/${adId}`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success(res.data.message || "Ad updated successfully");
      return true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to update ad");
      } else {
        toast.error("Failed to update ad");
      }
      return false;
    } finally {
      set({ isUpdating: false });
    }
  },

  getUserAds: async () => {
    try {
      const res = await axios.get(`${Base_URL}/api/ads/my-ads`, {
        withCredentials: true,
      });

      const mappedAds = res.data.ads.map((ad: any) => ({
        ...ad,
        title: ad.name || ad.title,
        location: ad.city || ad.location,
        category: ad.type || ad.category,
        img: getImageUrl(ad.images?.[0]),
        breed: ad.breed || "",
        age: ad.age?.toString() || "",
        gender: ad.gender || "",
        weight: ad.weight?.toString() || "",
        height: ad.height?.toString() || "",
        maxLife: ad.maxLife?.toString() || "",
        contactNumber: ad.contactNumber || "",
        vaccinated: ad.vaccinated || false,
        kcpRegistered: ad.kcpRegistered || false,
        suitableFor: Array.isArray(ad.suitableFor)
          ? ad.suitableFor.join(", ")
          : ad.suitableFor || "",
        isApproved: ad.isApproved || "pending",
      }));

      return mappedAds || [];
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to fetch ads");
      } else {
        toast.error("Failed to fetch ads");
      }
      return [];
    }
  },

  getApprovedDogAds: async (page = 1, limit = 12) => {
    set({ isLoading: true });
    try {
      const res = await axios.get(
        `${Base_URL}/api/ads/approved/dogs?page=${page}&limit=${limit}`,
        {
          withCredentials: true,
        }
      );

      const mappedAds = res.data.ads.map((ad: any) => ({
        ...ad,
        id: ad._id,
        name: ad.name || ad.title,
        title: ad.name || ad.title,
        location: ad.city || ad.location,
        category: ad.type || ad.category,
        img: getImageUrl(ad.images?.[0]), // FIXED HERE
        breed: ad.breed || "",
        age: ad.age?.toString() || "",
        gender: ad.gender || "",
        price: ad.price || 0,
        city: ad.city || "",
        vaccinated: ad.vaccinated || false,
        kcpRegistered: ad.kcpRegistered || false,
        suitableFor: Array.isArray(ad.suitableFor)
          ? ad.suitableFor
          : ad.suitableFor
          ? ad.suitableFor.split(", ")
          : [],
        isApproved: ad.isApproved || "pending",
      }));

      return {
        ads: mappedAds,
        pagination: res.data.pagination,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to fetch approved dog ads"
        );
      } else {
        toast.error("Failed to fetch approved dog ads");
      }
      return {
        ads: [],
        pagination: { currentPage: 1, totalPages: 1, totalAds: 0 },
      };
    } finally {
      set({ isLoading: false });
    }
  },
getApprovedDogAdById: async (slugOrId: string) => {
    try {
      // 1. Check if we have the real ID saved in sessionStorage first
      let targetId = slugOrId;
      if (typeof window !== "undefined") {
        const savedData = sessionStorage.getItem("selectedPetData");
        if (savedData) {
          const parsed = JSON.parse(savedData);
          // If the stored pet matches this slug, use its real MongoDB ID!
          if (parsed._id || parsed.id) {
            targetId = parsed._id || parsed.id;
          }
        }
      }

      // 2. Make the API call using the real database ID
      const res = await axios.get(`${Base_URL}/api/ads/approved/dogs/${targetId}`, {
        withCredentials: true,
      });

      const ad = res.data;
      const mappedAd = {
        ...ad,
        id: ad._id,
        name: ad.name || ad.title,
        title: ad.name || ad.title,
        location: ad.city || ad.location,
        category: ad.type || ad.category,
        img: getImageUrl(ad.images?.[0]),
        breed: ad.breed || "",
        age: ad.age?.toString() || "",
        gender: ad.gender || "",
        price: ad.price || 0,
        city: ad.city || "",
        vaccinated: ad.vaccinated || false,
        kcpRegistered: ad.kcpRegistered || false,
        suitableFor: Array.isArray(ad.suitableFor)
          ? ad.suitableFor
          : ad.suitableFor
          ? ad.suitableFor.split(", ")
          : [],
        isApproved: ad.isApproved || "pending",
        user: ad.user ? {
          name: ad.user.name,
          email: ad.user.email,
          avatar: ad.user.avatar 
            ? (ad.user.avatar.startsWith("http") 
                ? ad.user.avatar 
                : `${Base_URL}${ad.user.avatar.startsWith("/") ? "" : "/"}${ad.user.avatar}`) 
            : null
        } : null,
      };

      return mappedAd;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to fetch ad");
      } else {
        toast.error("Failed to fetch ad");
      }
      return null;
    }
  },
  getApprovedCatAds: async (page = 1, limit = 12) => {
    set({ isLoading: true });
    try {
      const res = await axios.get(
        `${Base_URL}/api/ads/approved/cats?page=${page}&limit=${limit}`,
        {
          withCredentials: true,
        }
      );

      const mappedAds = res.data.ads.map((ad: any) => ({
        ...ad,
        id: ad._id,
        name: ad.name || ad.title,
        title: ad.name || ad.title,
        location: ad.city || ad.location,
        category: ad.type || ad.category,
        img: getImageUrl(ad.images?.[0]),
        breed: ad.breed || "",
        age: ad.age?.toString() || "",
        gender: ad.gender || "",
        price: ad.price || 0,
        city: ad.city || "",
        vaccinated: ad.vaccinated || false,
        kcpRegistered: ad.kcpRegistered || false,
        suitableFor: Array.isArray(ad.suitableFor)
          ? ad.suitableFor
          : ad.suitableFor
          ? ad.suitableFor.split(", ")
          : [],
        isApproved: ad.isApproved || "pending",
      }));

      return {
        ads: mappedAds,
        pagination: res.data.pagination,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to fetch approved cat ads"
        );
      } else {
        toast.error("Failed to fetch approved cat ads");
      }
      return {
        ads: [],
        pagination: { currentPage: 1, totalPages: 1, totalAds: 0 },
      };
    } finally {
      set({ isLoading: false });
    }
  },

getApprovedCatAdById: async (slugOrId: string) => {
  try {
    // Check if the parameter is a slug or if we have an ID stored in sessionStorage
    let idToFetch = slugOrId;
    
    if (typeof window !== "undefined") {
      const storedId = sessionStorage.getItem("currentPetId");
      // If the passed argument looks like a slug (has dashes or isn't a 24-char mongo id), use the stored ID
      if (storedId && (slugOrId.includes("-") || slugOrId.length !== 24)) {
        idToFetch = storedId;
      }
    }

    const res = await axios.get(`${Base_URL}/api/ads/approved/cats/${idToFetch}`, {
      withCredentials: true,
    });

    const ad = res.data;
    const mappedAd = {
      ...ad,
      id: ad._id,
      name: ad.name || ad.title,
      title: ad.name || ad.title,
      location: ad.city || ad.location,
      category: ad.type || ad.category,
      img: getImageUrl(ad.images?.[0]),
      breed: ad.breed || "",
      age: ad.age?.toString() || "",
      gender: ad.gender || "",
      price: ad.price || 0,
      city: ad.city || "",
      vaccinated: ad.vaccinated || false,
      kcpRegistered: ad.kcpRegistered || false,
      suitableFor: Array.isArray(ad.suitableFor)
        ? ad.suitableFor
        : ad.suitableFor
        ? ad.suitableFor.split(", ")
        : [],
      isApproved: ad.isApproved || "pending",
    
        user: ad.user ? {
          name: ad.user.name,
          email: ad.user.email,
          avatar: ad.user.avatar 
            ? (ad.user.avatar.startsWith("http") 
                ? ad.user.avatar 
                : `${Base_URL}${ad.user.avatar.startsWith("/") ? "" : "/"}${ad.user.avatar}`) 
            : null
        } : null,
      };


    return mappedAd;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data?.message || "Failed to fetch cat ad");
    } else {
      toast.error("Failed to fetch cat ad");
    }
    return null;
  }
}
}));