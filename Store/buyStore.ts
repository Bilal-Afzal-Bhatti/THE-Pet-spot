import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

const hostname = typeof window !== 'undefined' ? window.location.hostname : '';

let Base_URL: string;

if (process.env.NEXT_PUBLIC_API_BASE_URL) {
  Base_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
} else if (hostname === 'localhost' || hostname === '127.0.0.1') {
  Base_URL = 'http://localhost:5000';
} else {
  Base_URL = 'https://the-pet-spot-backend.vercel.app';
}

console.log("BASE_URL:", Base_URL);
export { Base_URL };

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
        email: "",
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

        try {
          const response = await axios.post(
            `${Base_URL}/api/orders/checkout`,
            {
              petId: selectedPet._id || selectedPet.id,
              title: selectedPet.name || selectedPet.title || selectedPet.breed,
              price: selectedPet.price,
              // ⬅️ Added petImage mapping to match your Mongoose schema
              petImage: selectedPet.image || selectedPet.imageUrl || selectedPet.petImage || "",
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