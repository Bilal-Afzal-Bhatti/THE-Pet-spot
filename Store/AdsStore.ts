import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const Base_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";




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
          'Content-Type': 'multipart/form-data',
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
          'Content-Type': 'multipart/form-data',
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
      
      // Map backend field names to frontend field names
      const mappedAds = res.data.ads.map((ad: any) => ({
        ...ad,
        title: ad.name || ad.title, 
        location: ad.city || ad.location, // Backend uses 'city', frontend expects 'location'
        category: ad.type || ad.category, 
        // Ensure all optional fields exist
        breed: ad.breed || '',
        age: ad.age?.toString() || '',
        gender: ad.gender || '',
        weight: ad.weight?.toString() || '',
        height: ad.height?.toString() || '',
        maxLife: ad.maxLife?.toString() || '',
        contactNumber: ad.contactNumber || '',
        vaccinated: ad.vaccinated || false,
        kcpRegistered: ad.kcpRegistered || false,
        suitableFor: Array.isArray(ad.suitableFor) ? ad.suitableFor.join(', ') : (ad.suitableFor || ''),
        isApproved: ad.isApproved || 'pending',
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
      const res = await axios.get(`${Base_URL}/api/ads/approved/dogs?page=${page}&limit=${limit}`, {
        withCredentials: true,
      });
      
      // Map backend field names to frontend field names
      const mappedAds = res.data.ads.map((ad: any) => ({
        ...ad,
        id: ad._id, // Add id field for compatibility
        name: ad.name || ad.title,
        title: ad.name || ad.title,
        location: ad.city || ad.location,
        category: ad.type || ad.category,
        img: ad.images?.[0] || '/default-pet.jpg', // Use first image or default
        // Ensure all fields exist with proper defaults
        breed: ad.breed || '',
        age: ad.age?.toString() || '',
        gender: ad.gender || '',
        price: ad.price || 0,
        city: ad.city || '',
        vaccinated: ad.vaccinated || false,
        kcpRegistered: ad.kcpRegistered || false,
        suitableFor: Array.isArray(ad.suitableFor) ? ad.suitableFor : (ad.suitableFor ? ad.suitableFor.split(', ') : []),
        isApproved: ad.isApproved || 'pending',
      }));
      
      return {
        ads: mappedAds,
        pagination: res.data.pagination
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to fetch approved dog ads");
      } else {
        toast.error("Failed to fetch approved dog ads");
      }
      return { ads: [], pagination: { currentPage: 1, totalPages: 1, totalAds: 0 } };
    } finally {
      set({ isLoading: false });
    }
  },

  getApprovedDogAdById: async (id: string) => {
    try {
      const res = await axios.get(`${Base_URL}/api/ads/approved/dogs/${id}`, {
        withCredentials: true,
      });
      
      // Map backend field names to frontend field names
      const ad = res.data;
      const mappedAd = {
        ...ad,
        id: ad._id,
        name: ad.name || ad.title,
        title: ad.name || ad.title,
        location: ad.city || ad.location,
        category: ad.type || ad.category,
        img: ad.images?.[0] || '/default-pet.jpg',
        breed: ad.breed || '',
        age: ad.age?.toString() || '',
        gender: ad.gender || '',
        price: ad.price || 0,
        city: ad.city || '',
        vaccinated: ad.vaccinated || false,
        kcpRegistered: ad.kcpRegistered || false,
        suitableFor: Array.isArray(ad.suitableFor) ? ad.suitableFor : (ad.suitableFor ? ad.suitableFor.split(', ') : []),
        isApproved: ad.isApproved || 'pending',
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
      const res = await axios.get(`${Base_URL}/api/ads/approved/cats?page=${page}&limit=${limit}`, {
        withCredentials: true,
      });
      
      // Map backend field names to frontend field names
      const mappedAds = res.data.ads.map((ad: any) => ({
        ...ad,
        id: ad._id, // Add id field for compatibility
        name: ad.name || ad.title,
        title: ad.name || ad.title,
        location: ad.city || ad.location,
        category: ad.type || ad.category,
        img: ad.images?.[0] || '/default-pet.jpg', // Use first image or default
        // Ensure all fields exist with proper defaults
        breed: ad.breed || '',
        age: ad.age?.toString() || '',
        gender: ad.gender || '',
        price: ad.price || 0,
        city: ad.city || '',
        vaccinated: ad.vaccinated || false,
        kcpRegistered: ad.kcpRegistered || false,
        suitableFor: Array.isArray(ad.suitableFor) ? ad.suitableFor : (ad.suitableFor ? ad.suitableFor.split(', ') : []),
        isApproved: ad.isApproved || 'pending',
      }));
      
      return {
        ads: mappedAds,
        pagination: res.data.pagination
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to fetch approved cat ads");
      } else {
        toast.error("Failed to fetch approved cat ads");
      }
      return { ads: [], pagination: { currentPage: 1, totalPages: 1, totalAds: 0 } };
    } finally {
      set({ isLoading: false });
    }
  },

  getApprovedCatAdById: async (id: string) => {
    try {
      const res = await axios.get(`${Base_URL}/api/ads/approved/cats/${id}`, {
        withCredentials: true,
      });
      
      // Map backend field names to frontend field names
      const ad = res.data;
      const mappedAd = {
        ...ad,
        id: ad._id,
        name: ad.name || ad.title,
        title: ad.name || ad.title,
        location: ad.city || ad.location,
        category: ad.type || ad.category,
        img: ad.images?.[0] || '/default-pet.jpg',
        breed: ad.breed || '',
        age: ad.age?.toString() || '',
        gender: ad.gender || '',
        price: ad.price || 0,
        city: ad.city || '',
        vaccinated: ad.vaccinated || false,
        kcpRegistered: ad.kcpRegistered || false,
        suitableFor: Array.isArray(ad.suitableFor) ? ad.suitableFor : (ad.suitableFor ? ad.suitableFor.split(', ') : []),
        isApproved: ad.isApproved || 'pending',
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
  },
}));
