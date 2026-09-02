import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import { api } from "@/utils/api/axiosInstance"; // Centralized API instance
// Get current hostname safely for client-side evaluation


interface CheckoutDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  paymentMethod: "ONLINE" | "COD";
}

interface BuyState {
  selectedPet: any | null;
  idempotencyKey: string | null;
  checkoutDetails: CheckoutDetails;
  loading: boolean;
  error: string | null;

  setSelectedPet: (pet: any, userEmail?: string) => void;
  setCheckoutDetails: (details: Partial<CheckoutDetails>) => void;
  clearCheckout: () => void;
  generateIdempotencyKey: () => string;
  processCheckout: () => Promise<string | null>;
}

export const useBuyStore = create<BuyState>()(
  persist(
    (set, get) => ({
      selectedPet: null,
      idempotencyKey: null,
      checkoutDetails: {
        fullName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        postalCode: "",
        paymentMethod: "ONLINE",
      },
      loading: false,
      error: null,

      setSelectedPet: (pet, userEmail) => {
        const newKey = get().idempotencyKey || crypto.randomUUID();
        set((state) => ({
          selectedPet: pet,
          idempotencyKey: newKey,
          checkoutDetails: {
            ...state.checkoutDetails,
            // Automatically patch email if passed or keep existing
            email: userEmail || state.checkoutDetails.email,
          },
        }));
      },

      setCheckoutDetails: (details) =>
        set((state) => ({
          checkoutDetails: { ...state.checkoutDetails, ...details },
        })),

      clearCheckout: () =>
        set({
          selectedPet: null,
          idempotencyKey: null,
          error: null,
          checkoutDetails: {
            fullName: "",
            email: "",
            phone: "",
            address: "",
            city: "",
            postalCode: "",
            paymentMethod: "ONLINE",
          },
        }),

      generateIdempotencyKey: () => {
        const key = crypto.randomUUID();
        set({ idempotencyKey: key });
        return key;
      },

      processCheckout: async () => {
        const { selectedPet, checkoutDetails, idempotencyKey } = get();
        if (!selectedPet) throw new Error("No pet selected for purchase.");

        set({ loading: true, error: null });
        const currentKey = idempotencyKey || get().generateIdempotencyKey();

        const extractedImage = 
          selectedPet.images?.[0] || 
          selectedPet.image || 
          selectedPet.imageUrl || 
          selectedPet.petImage || 
          "";

        try {
          // Using the centralized api instance instead of raw axios
          const response = await api.post(
            `/api/orders/checkout`,
            {
              petId: selectedPet._id || selectedPet.id,
              title: selectedPet.name || selectedPet.title || selectedPet.breed,
              price: selectedPet.price,
              petImage: extractedImage,
              customerInfo: checkoutDetails,
            },
            {
              headers: {
                "Idempotency-Key": currentKey,
              },
            }
          );

          set({ loading: false });
          return response.data.url || response.data.successUrl;
        } catch (err: any) {
          const errorMsg = err.response?.data?.message || err.message || "Checkout failed.";
          set({ error: errorMsg, loading: false });
          throw new Error(errorMsg);
        }
      },
    }),
    {
      name: "pet-buy-storage",
    }
  )
);