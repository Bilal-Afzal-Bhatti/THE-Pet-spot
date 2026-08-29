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
  images: string[]; // object URLs for preview (or uploaded urls)
  age: number | "";
  gender: string;
  weight: number | "";
  height: number | "";
  maxLife: number | "";
  vaccinated: boolean;
  kcpRegistered: boolean;
  suitableFor: string[]; // e.g. ['children','families']
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
      // concat, but ensure max maybe 8 images
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

  // theme CSS variables inline style applied to top container
  const themeStyle = {
    ["--primary" as any]: "#028D8F",
    ["--accent" as any]: "#8957E9",
  } as React.CSSProperties;

  // revoke all blob URLs (cleanup)
  const revokeAllUrls = useCallback((urls: string[]) => {
    urls.forEach((u) => {
      try {
        if (u.startsWith("blob:")) URL.revokeObjectURL(u);
      } catch (e) {
        // ignore
      }
    });
  }, []);

  useEffect(() => {
    // cleanup on unmount: revoke any created object URLs
    return () => {
      revokeAllUrls(state.images);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          value: (target as HTMLInputElement).checked,
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

  // create object URLs for previews and add to state
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
    } catch (err) {
      /* ignore */
    }
    dispatch({ type: "REMOVE_IMAGE", index });
  };

  // Drag & Drop handlers
  const onDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current++;
    setDragActive(true);
  };
  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current = Math.max(0, dragCounter.current - 1);
    if (dragCounter.current === 0) setDragActive(false);
  };
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current = 0;
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!state.name.trim()) next.name = "Name is required";
    if (!state.contactNumber.trim()) next.contactNumber = "Contact is required";
    if (
      state.contactNumber &&
      !/^\+?\d{7,15}$/.test(state.contactNumber.trim())
    )
      next.contactNumber =
        "Enter a valid phone number (digits only, optional +)";
    if (!state.type) next.type = "Select a category";
    if (descChars > 500) next.description = "Description max 500 characters";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const { postAd, isPosting } = useAdStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      // scroll to first error
      const firstKey = Object.keys(errors)[0];
      if (firstKey) {
        const el = document.querySelector(
          `[name="${firstKey}"]`
        ) as HTMLElement | null;
        el?.focus();
      }
      return;
    }

    // convert to final payload
    const payload = {
      ...state,
      price:
        typeof state.price === "number"
          ? state.price
          : Number(state.price || 0),
      age: typeof state.age === "number" ? state.age : Number(state.age || 0),
      weight:
        typeof state.weight === "number"
          ? state.weight
          : Number(state.weight || 0),
      height:
        typeof state.height === "number"
          ? state.height
          : Number(state.height || 0),
      maxLife:
        typeof state.maxLife === "number"
          ? state.maxLife
          : Number(state.maxLife || 0),
    };

    try {
      await postAd(payload as any);
      // cleanup blob urls on reset
      revokeAllUrls(state.images);
      dispatch({ type: "RESET" });
      setDescChars(0);
      setErrors({});
    } catch (error) {
      // Error handling is done in the store
      console.error("Failed to post ad:", error);
    }
  };

  // Reset handler that revokes blob urls before resetting
  const handleReset = () => {
    revokeAllUrls(state.images);
    dispatch({ type: "RESET" });
    setDescChars(0);
    setErrors({});
  };

  return (
    <div
      className="min-h-screen flex justify-center py-8 px-4 bg-gray-50"
      style={themeStyle}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl bg-white rounded-3xl shadow-md p-6 md:p-8"
        aria-label="Post your pet ad"
      >
        <header className="mb-6">
          <h1
            className="text-center text-3xl md:text-4xl font-extrabold"
            style={{ color: "var(--accent)" }}
          >
            Sale Your Pets
          </h1>
          <p className="text-center text-sm text-gray-500 mt-2">
            Fill details below to post your pet ad — it will appear after
            review.
          </p>
        </header>

        {/* Grid top */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Category / Type</label>
            <select
              name="type"
              value={state.type}
              onChange={handleInput("type")}
              className={`mt-1 block w-full border rounded p-2 transition ${
                errors.type ? "border-red-500" : "border-gray-200"
              } focus:outline-none focus:ring-2`}
              style={{
                boxShadow: errors.type
                  ? "0 0 0 3px rgba(248,113,113,0.08)"
                  : "none",
                borderColor: errors.type ? "#f87171" : undefined,
              }}
            >
              <option value="">Select...</option>
              <option value="dog">Dog</option>
              <option value="cat">Cat</option>
              <option value="bird">Bird</option>
              <option value="other">Other</option>
            </select>
            {errors.type && (
              <p className="text-xs text-red-500 mt-1">{errors.type}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Ad Title / Name</label>
            <input
              name="name"
              value={state.name}
              onChange={handleInput("name")}
              placeholder="Pet name"
              className={`mt-1 block w-full border rounded p-2 transition focus:ring-2 ${
                errors.name ? "border-red-500" : "border-gray-200"
              }`}
              style={{
                boxShadow: errors.name
                  ? "0 0 0 3px rgba(248,113,113,0.08)"
                  : "none",
              }}
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Breed</label>
            <input
              name="breed"
              value={state.breed}
              onChange={handleInput("breed")}
              placeholder="Breed name"
              className="mt-1 block w-full border rounded p-2 transition focus:ring-2 border-gray-200"
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
              className="mt-1 block w-full border rounded p-2 transition focus:ring-2 border-gray-200"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={state.description}
              onChange={handleInput("description")}
              placeholder="Write a short description (max 500 chars)"
              className={`mt-1 block w-full border rounded p-2 transition focus:ring-2 ${
                errors.description ? "border-red-500" : "border-gray-200"
              }`}
              rows={4}
              maxLength={1000}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <div>
                {errors.description ? (
                  <span className="text-red-500">{errors.description}</span>
                ) : (
                  <span>Be descriptive — size, behavior, health</span>
                )}
              </div>
              <div>{descChars} / 500</div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Age (Years)</label>
            <input
              type="number"
              name="age"
              value={state.age as any}
              onChange={handleInput("age")}
              className="mt-1 block w-full border rounded p-2 transition focus:ring-2 border-gray-200"
              min={0}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Gender</label>
            <select
              name="gender"
              value={state.gender}
              onChange={handleInput("gender")}
              className="mt-1 block w-full border rounded p-2 transition focus:ring-2 border-gray-200"
            >
              <option value="">Select...</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Unknown">Unknown</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">City</label>
            <input
              name="city"
              value={state.city}
              onChange={handleInput("city")}
              placeholder="City"
              className="mt-1 block w-full border rounded p-2 transition focus:ring-2 border-gray-200"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Contact Number</label>
            <input
              name="contactNumber"
              value={state.contactNumber}
              onChange={handleInput("contactNumber")}
              placeholder="+92..."
              className={`mt-1 block w-full border rounded p-2 transition focus:ring-2 ${
                errors.contactNumber ? "border-red-500" : "border-gray-200"
              }`}
            />
            {errors.contactNumber && (
              <p className="text-xs text-red-500 mt-1">
                {errors.contactNumber}
              </p>
            )}
          </div>
        </div>

        {/* physical */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <input
            name="weight"
            value={state.weight as any}
            onChange={handleInput("weight")}
            placeholder="Weight (kg)"
            type="number"
            className="border p-2 rounded transition focus:ring-2 border-gray-200"
          />
          <input
            name="height"
            value={state.height as any}
            onChange={handleInput("height")}
            placeholder="Height (cm)"
            type="number"
            className="border p-2 rounded transition focus:ring-2 border-gray-200"
          />
          <input
            name="maxLife"
            value={state.maxLife as any}
            onChange={handleInput("maxLife")}
            placeholder="Max life (yrs)"
            type="number"
            className="border p-2 rounded transition focus:ring-2 border-gray-200"
          />
        </div>

        {/* toggles & chips */}
        <div className="flex flex-wrap items-center gap-4 mt-4">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={state.vaccinated}
              onChange={() =>
                dispatch({
                  type: "SET",
                  key: "vaccinated",
                  value: !state.vaccinated,
                })
              }
              className="rounded"
            />
            <span className="text-sm">Vaccinated</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={state.kcpRegistered}
              onChange={() =>
                dispatch({
                  type: "SET",
                  key: "kcpRegistered",
                  value: !state.kcpRegistered,
                })
              }
              className="rounded"
            />
            <span className="text-sm">KCP Registered</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={state.isAvailable}
              onChange={() =>
                dispatch({
                  type: "SET",
                  key: "isAvailable",
                  value: !state.isAvailable,
                })
              }
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
                    active
                      ? "bg-[color:var(--accent)] text-white border-[color:var(--accent)]"
                      : "bg-white text-gray-700 border-gray-200 hover:shadow"
                  }`}
                  aria-pressed={active}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        {/* Image upload / drag drop */}
        <div className="mt-6">
          <input
            type="text"
            placeholder="Paste Image URL"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-[--primary]"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (e.target.value) {
                dispatch({
                  type: "SET",
                  key: "images",
                  value: [...state.images, e.target.value],
                });
                e.target.value = ""; // Clear input after adding URL
              }
            }}
          />
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          onChange={onFileChange}
          className="hidden"
          id="image_upload_input"
        />
        <label
          htmlFor="image_upload_input"
          className="cursor-pointer inline-block w-full"
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <path
                d="M12 5v11"
                stroke="var(--primary)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M19 12l-7-7-7 7"
                stroke="var(--primary)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="flex items-center gap-2">
              <span className="font-medium" style={{ color: "var(--primary)" }}>
                Drag & drop images here
              </span>
              <span className="ml-2 text-sm text-gray-500">or</span>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="ml-2 px-3 py-1 rounded text-white"
                style={{ backgroundColor: "var(--primary)" }}
              >
                Browse
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              (jpg, png, webp, gif — max 8 images)
            </p>
          </div>
        </label>

        {state.images.length > 0 && (
          <>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {state.images.map((src, i) => (
                <div
                  key={i}
                  className="relative group rounded overflow-hidden border"
                >
                  <img
                    src={src}
                    alt={`preview-${i}`}
                    className="w-full h-36 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    aria-label={`Remove image ${i + 1}`}
                    className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm shadow"
                    style={{ backgroundColor: "var(--accent)" }}
                  >
                    ×
                  </button>
                  <div className="absolute bottom-1 left-1 bg-black/40 text-white text-xs px-2 py-0.5 rounded">
                    {i + 1}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
              <div>{state.images.length} / 8 images selected</div>
              <div className="w-2/5 bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full"
                  style={{
                    width: `${(state.images.length / 8) * 100}%`,
                    backgroundColor: "var(--primary)",
                  }}
                />
              </div>
            </div>
          </>
        )}
        {/* </div> */}

        <div className="mt-6 flex gap-3 items-center">
          <button
            type="submit"
            className="px-5 py-2 rounded text-white font-medium hover:opacity-95 transition transform active:scale-95 disabled:opacity-50"
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

          <div className="ml-auto text-sm text-gray-500 self-center">
            Tip: Click the × on an image to remove it
          </div>
        </div>
      </form>
    </div>
  );
}
