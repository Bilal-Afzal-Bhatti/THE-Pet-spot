import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface CheckoutDetails {
  fullName: string;
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

  setSelectedPet: (pet: any) => void;
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
        phone: "",
        address: "",
        city: "",
        postalCode: "",
        paymentMethod: "ONLINE",
      },
      loading: false,
      error: null,

      setSelectedPet: (pet) => {
        const newKey = get().idempotencyKey || crypto.randomUUID();
        set({ selectedPet: pet, idempotencyKey: newKey });
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

        try {
          const response = await axios.post(
            `${API_BASE}/api/orders/checkout`,
            {
              petId: selectedPet._id || selectedPet.id,
              title: selectedPet.name || selectedPet.title || selectedPet.breed,
              price: selectedPet.price,
              customerInfo: checkoutDetails,
            },
            {
              headers: {
                "Content-Type": "application/json",
                "Idempotency-Key": currentKey,
              },
              withCredentials: true,
            }
          );

          set({ loading: false });

          // Returns either Stripe URL or COD Success URL
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