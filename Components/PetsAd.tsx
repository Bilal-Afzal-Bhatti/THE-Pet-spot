"use client";
import React, {
  useReducer,
  useRef,
  useCallback,
  useState,
  useEffect,
} from "react";
import { useAdStore } from "../Store/AdsStore";

type FormState = {
  price: number | "";
  name: string;
  description: string;
  city: string;
  contactNumber: string;
  type: string;
  breed: string;
  images: string[];
  age: number | "";
  gender: string;
  weight: number | "";
  height: number | "";
  maxLife: number | "";
  province: string;
  vaccinated: boolean;
  kcpRegistered: boolean;
  suitableFor: string[];
  isAvailable: boolean;
};

type Action =
  | { type: "SET"; key: keyof FormState; value: any }
  | { type: "TOGGLE_SUITABLE"; value: string }
  | { type: "ADD_IMAGES"; images: string[] }
  | { type: "REMOVE_IMAGE"; index: number }
  | { type: "RESET" };

const initialState: FormState = {
  price: "",
  name: "",
  description: "",
  city: "",
  contactNumber: "",
  type: "",
  breed: "",
  images: [],
  age: "",
  gender: "",
  weight: "",
  height: "",
  maxLife: "",
  province: "Punjab", // Set default province fallback
  vaccinated: false,
  kcpRegistered: false,
  suitableFor: [],
  isAvailable: true,
};

function reducer(state: FormState, action: Action): FormState {
  switch (action.type) {
    case "SET":
      return { ...state, [action.key]: action.value };
    case "TOGGLE_SUITABLE": {
      const exists = state.suitableFor.includes(action.value);
      return {
        ...state,
        suitableFor: exists
          ? state.suitableFor.filter((v) => v !== action.value)
          : [...state.suitableFor, action.value],
      };
    }
    case "ADD_IMAGES":
      return {
        ...state,
        images: [...state.images, ...action.images].slice(0, 8),
      };
    case "REMOVE_IMAGE":
      return {
        ...state,
        images: state.images.filter((_, i) => i !== action.index),
      };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export default function PetsAd() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const dragCounter = useRef(0);
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [descChars, setDescChars] = useState(0);

  const themeStyle = {
    ["--primary" as any]: "#028D8F",
    ["--accent" as any]: "#8957E9",
  } as React.CSSProperties;

  const revokeAllUrls = useCallback((urls: string[]) => {
    urls.forEach((u) => {
      try {
        if (u.startsWith("blob:")) URL.revokeObjectURL(u);
      } catch (e) {}
    });
  }, []);

  useEffect(() => {
    return () => {
      revokeAllUrls(state.images);
    };
  }, [revokeAllUrls, state.images]);

  const handleInput =
    (key: keyof FormState) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const target = e.target as HTMLInputElement;
      if (target.type === "number") {
        const val = target.value === "" ? "" : Number(target.value);
        dispatch({ type: "SET", key, value: val });
        setErrors((prev) => ({ ...prev, [key]: "" }));
      } else if (target.type === "checkbox") {
        dispatch({
          type: "SET",
          key,
          value: target.checked,
        });
      } else {
        dispatch({ type: "SET", key, value: target.value });
        if (key === "description") setDescChars(target.value.length);
        setErrors((prev) => ({ ...prev, [key]: "" }));
      }
    };

  const handleSuitableToggle = (value: string) => {
    dispatch({ type: "TOGGLE_SUITABLE", value });
  };

  const addFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files);
    const urls = arr.map((f) => URL.createObjectURL(f));
    dispatch({ type: "ADD_IMAGES", images: urls });
  }, []);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    addFiles(e.target.files);
    if (fileRef.current) fileRef.current.value = "";
  };

  const removeImage = (index: number) => {
    const url = state.images[index];
    try {
      if (url.startsWith("blob:")) URL.revokeObjectURL(url);
    } catch (err) {}
    dispatch({ type: "REMOVE_IMAGE", index });
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!state.name.trim()) next.name = "Name is required";
    if (!state.contactNumber.trim()) next.contactNumber = "Contact is required";
    if (
      state.contactNumber &&
      !/^\+?\d{7,15}$/.test(state.contactNumber.trim())
    )
      next.contactNumber = "Enter a valid phone number";
    if (!state.type) next.type = "Select a category";
    if (!state.province) next.province = "Select a province";
    if (descChars > 500) next.description = "Description max 500 characters";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const { postAd, isPosting } = useAdStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...state,
      province: state.province || "Punjab", // Explicit fallback
      price: typeof state.price === "number" ? state.price : Number(state.price || 0),
      age: typeof state.age === "number" ? state.age : Number(state.age || 0),
      weight: typeof state.weight === "number" ? state.weight : Number(state.weight || 0),
      height: typeof state.height === "number" ? state.height : Number(state.height || 0),
      maxLife: typeof state.maxLife === "number" ? state.maxLife : Number(state.maxLife || 0),
    };

    try {
      await postAd(payload as any);
      revokeAllUrls(state.images);
      dispatch({ type: "RESET" });
      setDescChars(0);
      setErrors({});
    } catch (error) {
      console.error("Failed to post ad:", error);
    }
  };

  const handleReset = () => {
    revokeAllUrls(state.images);
    dispatch({ type: "RESET" });
    setDescChars(0);
    setErrors({});
  };

  return (
    <div className="min-h-screen flex justify-center py-8 px-4 bg-gray-50" style={themeStyle}>
      <form onSubmit={handleSubmit} className="w-full max-w-4xl bg-white rounded-3xl shadow-md p-6 md:p-8">
        <header className="mb-6">
          <h1 className="text-center text-3xl md:text-4xl font-extrabold" style={{ color: "var(--accent)" }}>
            Sale Your Pets
          </h1>
          <p className="text-center text-sm text-gray-500 mt-2">
            Fill details below to post your pet ad.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Category / Type</label>
            <select
              name="type"
              value={state.type}
              onChange={handleInput("type")}
              className={`mt-1 block w-full border rounded p-2 transition ${errors.type ? "border-red-500" : "border-gray-200"}`}
            >
              <option value="">Select...</option>
              <option value="dog">Dog</option>
              <option value="cat">Cat</option>
              <option value="bird">Bird</option>
              <option value="other">Other</option>
            </select>
            {errors.type && <p className="text-xs text-red-500 mt-1">{errors.type}</p>}
          </div>

          <div>
            <label className="text-sm font-medium">Ad Title / Name</label>
            <input
              name="name"
              value={state.name}
              onChange={handleInput("name")}
              placeholder="Pet name"
              className={`mt-1 block w-full border rounded p-2 transition ${errors.name ? "border-red-500" : "border-gray-200"}`}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="text-sm font-medium">Breed</label>
            <input
              name="breed"
              value={state.breed}
              onChange={handleInput("breed")}
              placeholder="Breed name"
              className="mt-1 block w-full border rounded p-2 border-gray-200"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Price (PKR)</label>
            <input
              name="price"
              type="number"
              value={state.price as any}
              onChange={handleInput("price")}
              placeholder="1000"
              className="mt-1 block w-full border rounded p-2 border-gray-200"
            />
          </div>

          {/* ADDED PROVINCE SELECT FIELD */}
          <div>
            <label className="text-sm font-medium">Province</label>
            <select
              name="province"
              value={state.province}
              onChange={handleInput("province")}
              className={`mt-1 block w-full border rounded p-2 transition ${errors.province ? "border-red-500" : "border-gray-200"}`}
            >
              <option value="Punjab">Punjab</option>
              <option value="Sindh">Sindh</option>
              <option value="KPK">Khyber Pakhtunkhwa</option>
              <option value="Balochistan">Balochistan</option>
              <option value="Islamabad">Islamabad Capital Territory</option>
            </select>
            {errors.province && <p className="text-xs text-red-500 mt-1">{errors.province}</p>}
          </div>

          <div>
            <label className="text-sm font-medium">City</label>
            <input
              name="city"
              value={state.city}
              onChange={handleInput("city")}
              placeholder="City"
              className="mt-1 block w-full border rounded p-2 border-gray-200"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Contact Number</label>
            <input
              name="contactNumber"
              value={state.contactNumber}
              onChange={handleInput("contactNumber")}
              placeholder="+92..."
              className={`mt-1 block w-full border rounded p-2 transition ${errors.contactNumber ? "border-red-500" : "border-gray-200"}`}
            />
            {errors.contactNumber && <p className="text-xs text-red-500 mt-1">{errors.contactNumber}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={state.description}
              onChange={handleInput("description")}
              placeholder="Write a short description (max 500 chars)"
              className={`mt-1 block w-full border rounded p-2 transition ${errors.description ? "border-red-500" : "border-gray-200"}`}
              rows={4}
              maxLength={1000}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{errors.description || "Be descriptive — size, behavior, health"}</span>
              <span>{descChars} / 500</span>
            </div>
          </div>
        </div>

        {/* Physical specifications */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <input
            name="weight"
            value={state.weight as any}
            onChange={handleInput("weight")}
            placeholder="Weight (kg)"
            type="number"
            className="border p-2 rounded border-gray-200"
          />
          <input
            name="height"
            value={state.height as any}
            onChange={handleInput("height")}
            placeholder="Height (cm)"
            type="number"
            className="border p-2 rounded border-gray-200"
          />
          <input
            name="maxLife"
            value={state.maxLife as any}
            onChange={handleInput("maxLife")}
            placeholder="Max life (yrs)"
            type="number"
            className="border p-2 rounded border-gray-200"
          />
        </div>

        {/* Toggles and options */}
        <div className="flex flex-wrap items-center gap-4 mt-4">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={state.vaccinated}
              onChange={() => dispatch({ type: "SET", key: "vaccinated", value: !state.vaccinated })}
              className="rounded"
            />
            <span className="text-sm">Vaccinated</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={state.kcpRegistered}
              onChange={() => dispatch({ type: "SET", key: "kcpRegistered", value: !state.kcpRegistered })}
              className="rounded"
            />
            <span className="text-sm">KCP Registered</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={state.isAvailable}
              onChange={() => dispatch({ type: "SET", key: "isAvailable", value: !state.isAvailable })}
              className="rounded"
            />
            <span className="text-sm">Available</span>
          </label>

          <div className="ml-auto flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium mr-2">Suitable for:</span>
            {["children", "families", "farm", "breeding"].map((s) => {
              const active = state.suitableFor.includes(s);
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleSuitableToggle(s)}
                  className={`text-sm px-3 py-1 rounded-full border transition transform active:scale-95 ${
                    active ? "bg-(--accent) text-white border-(--accent)" : "bg-white text-gray-700 border-gray-200 hover:shadow"
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        {/* Image Input */}
        <div className="mt-6">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            onChange={onFileChange}
            className="hidden"
            id="image_upload_input"
          />
          <label htmlFor="image_upload_input" className="cursor-pointer inline-block w-full">
            <div className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 p-4 rounded-xl">
              <span className="font-medium" style={{ color: "var(--primary)" }}>
                Click to add images
              </span>
              <p className="text-xs text-gray-400">(jpg, png, webp — max 8 images)</p>
            </div>
          </label>

          {state.images.length > 0 && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {state.images.map((src, i) => (
                <div key={i} className="relative group rounded overflow-hidden border">
                  <img src={src} alt={`preview-${i}`} className="w-full h-36 object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="mt-6 flex gap-3 items-center">
          <button
            type="submit"
            className="px-5 py-2 rounded text-white font-medium hover:opacity-95 transition disabled:opacity-50"
            style={{ backgroundColor: "var(--primary)" }}
            disabled={isPosting}
          >
            {isPosting ? "Posting..." : "Submit Ad"}
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 rounded border hover:shadow transition"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}