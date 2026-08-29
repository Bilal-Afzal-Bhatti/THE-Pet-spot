"use client";
import { useState, useEffect } from 'react';
import { dogBreeds, catBreeds, suitableForOptions, pakistaniProvinces, provinceCities } from '@/utils/breeds';

interface AdFormData {
  title: string;
  description: string;
  price: string;
  category: string;
  province: string;
  city: string;
  breed: string;
  age: string;
  gender: string;
  weight: string;
  height: string;
  maxLife: string;
  contactNumber: string;
  vaccinated: boolean;
  kcpRegistered: boolean;
  suitableFor: string[];
  images: File[];
}

interface CreateAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
  isSubmitting: boolean;
  originPosition?: { x: number; y: number } | null;
}

export default function CreateAdModal({ isOpen, onClose, onSubmit, isSubmitting, originPosition }: CreateAdModalProps) {
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [animationPhase, setAnimationPhase] = useState<'initial' | 'animating' | 'final'>('initial');

  // Handle animation phases
  useEffect(() => {
    if (isOpen) {
      setAnimationPhase('initial');
      // Start animation after a brief delay
      const timer = setTimeout(() => {
        setAnimationPhase('animating');
        // Complete animation
        setTimeout(() => {
          setAnimationPhase('final');
        }, 300);
      }, 10);
      return () => clearTimeout(timer);
    } else {
      setAnimationPhase('initial');
    }
  }, [isOpen]);
  const [formData, setFormData] = useState<AdFormData>({
    title: '',
    description: '',
    price: '',
    category: '',
    province: '',
    city: '',
    breed: '',
    age: '',
    gender: '',
    weight: '',
    height: '',
    maxLife: '',
    contactNumber: '',
    vaccinated: false,
    kcpRegistered: false,
    suitableFor: [],
    images: []
  });

  const getAvailableBreeds = () => {
    if (formData.category === 'dog') {
      return dogBreeds;
    } else if (formData.category === 'cat') {
      return catBreeds;
    }
    return [];
  };

  const getAvailableCities = () => {
    if (formData.province && provinceCities[formData.province]) {
      return provinceCities[formData.province];
    }
    return [];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'images') {
        value.forEach((file: File) => {
          formDataToSend.append('images', file);
        });
      } else if (key === 'vaccinated' || key === 'kcpRegistered') {
        formDataToSend.append(key, value.toString());
      } else if (key === 'suitableFor') {
        formDataToSend.append(key, (value as string[]).join(', '));
      } else if (key === 'province' || key === 'city') {
        // Skip province and city, we'll combine them into location
      } else {
        formDataToSend.append(key, value as string);
      }
    });

    // Combine province and city into location
    const location = `${formData.city}, ${formData.province}`;
    formDataToSend.append('location', location);

    onSubmit(formDataToSend);

    // Reset form after successful submission
    setFormData({
      title: '',
      description: '',
      price: '',
      category: '',
      province: '',
      city: '',
      breed: '',
      age: '',
      gender: '',
      weight: '',
      height: '',
      maxLife: '',
      contactNumber: '',
      vaccinated: false,
      kcpRegistered: false,
      suitableFor: [],
      images: []
    });
    setImagePreviews([]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFormData(prev => ({
        ...prev,
        images: files
      }));

      // Create preview URLs
      const previews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(previews);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setImagePreviews(prev => {
      // Revoke the object URL to prevent memory leaks
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;

      if (name === 'vaccinated' || name === 'kcpRegistered') {
        setFormData(prev => ({
          ...prev,
          [name]: checked
        }));
      } else if (name.startsWith('suitableFor-')) {
        // Handle suitableFor checkboxes
        const option = name.replace('suitableFor-', '');
        setFormData(prev => ({
          ...prev,
          suitableFor: checked
            ? [...prev.suitableFor, option]
            : prev.suitableFor.filter(item => item !== option)
        }));
      }
    } else {
      setFormData(prev => {
        const newData = {
          ...prev,
          [name]: value
        };

        // Reset breed when category changes
        if (name === 'category' && value !== prev.category) {
          newData.breed = '';
        }

        // Reset city when province changes
        if (name === 'province' && value !== prev.province) {
          newData.city = '';
        }

        return newData;
      });
    }
  };

  if (!isOpen) return null;

  // Calculate transform based on animation phase and origin position
  const getTransformStyle = () => {
    if (!originPosition || animationPhase === 'final') {
      return 'translate(-50%, -50%) scale(1)';
    }
    
    if (animationPhase === 'initial') {
      // Start from within the button - very small scale at button center
      return `translate(${originPosition.x - window.innerWidth / 2}px, ${originPosition.y - window.innerHeight / 2}px) scale(0.01)`;
    }
    
    // animating phase - interpolate between initial and final
    return 'translate(-50%, -50%) scale(1)';
  };

  return (
    <div
      className="fixed inset-0 bg-transparent backdrop-blur-md flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto fixed top-1/2 left-1/2 transition-all duration-300 ease-out ${
          animationPhase === 'initial' ? 'opacity-0' : 'opacity-100'
        }`}
        style={{
          transform: getTransformStyle(),
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white rounded-t-3xl border-b border-gray-100 px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Create New Advertisement</h2>
              <p className="text-gray-600 mt-1">Fill in the details to post your pet ad</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                  Pet Name *
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#028d8f] focus:border-transparent transition-all duration-200"
                  placeholder="e.g., Golden Retriever Puppy"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#028d8f] focus:border-transparent transition-all duration-200"
                >
                  <option value="">Select a category</option>
                  <option value="dog">🐕 Dog</option>
                  <option value="cat">🐱 Cat</option>
                  <option value="small-pet">🐹 Small Pet</option>
                </select>
              </div>

              <div>
                <label htmlFor="breed" className="block text-sm font-semibold text-gray-700 mb-2">
                  Breed *
                </label>
                <select
                  id="breed"
                  name="breed"
                  value={formData.breed}
                  onChange={handleInputChange}
                  required
                  disabled={!formData.category}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#028d8f] focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {formData.category ? 'Select a breed' : 'Please select a category first'}
                  </option>
                  {getAvailableBreeds().map((breed) => (
                    <option key={breed} value={breed}>
                      {breed}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="gender" className="block text-sm font-semibold text-gray-700 mb-2">
                  Gender *
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#028d8f] focus:border-transparent transition-all duration-200"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#028d8f] focus:border-transparent transition-all duration-200"
              placeholder="Describe your pet's personality, health status, and any special requirements..."
            />
          </div>

          {/* Physical Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Physical Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label htmlFor="age" className="block text-sm font-semibold text-gray-700 mb-2">
                  Age (months) *
                </label>
                <input
                  id="age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleInputChange}
                  required
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#028d8f] focus:border-transparent transition-all duration-200"
                  placeholder="Age in months"
                />
              </div>

              <div>
                <label htmlFor="weight" className="block text-sm font-semibold text-gray-700 mb-2">
                  Weight (kg) *
                </label>
                <input
                  id="weight"
                  name="weight"
                  type="number"
                  value={formData.weight}
                  onChange={handleInputChange}
                  required
                  min="0.1"
                  step="0.1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#028d8f] focus:border-transparent transition-all duration-200"
                  placeholder="Weight in kg"
                />
              </div>

              <div>
                <label htmlFor="height" className="block text-sm font-semibold text-gray-700 mb-2">
                  Height (cm) *
                </label>
                <input
                  id="height"
                  name="height"
                  type="number"
                  value={formData.height}
                  onChange={handleInputChange}
                  required
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#028d8f] focus:border-transparent transition-all duration-200"
                  placeholder="Height in cm"
                />
              </div>

              <div>
                <label htmlFor="maxLife" className="block text-sm font-semibold text-gray-700 mb-2">
                  Life Expectancy (years) *
                </label>
                <input
                  id="maxLife"
                  name="maxLife"
                  type="number"
                  value={formData.maxLife}
                  onChange={handleInputChange}
                  required
                  min="1"
                  max="30"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#028d8f] focus:border-transparent transition-all duration-200"
                  placeholder="Expected lifespan"
                />
              </div>
            </div>
          </div>

          {/* Location and Contact */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Location & Contact</h3>
            <div className="grid grid-cols-1 gap-6">
              {/* First row: Province and City */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="province" className="block text-sm font-semibold text-gray-700 mb-2">
                    Province *
                  </label>
                  <select
                    id="province"
                    name="province"
                    value={formData.province}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#028d8f] focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select Province</option>
                    {pakistaniProvinces.map((province) => (
                      <option key={province} value={province}>
                        {province}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-2">
                    City *
                  </label>
                  <select
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    disabled={!formData.province}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#028d8f] focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">
                      {formData.province ? 'Select City' : 'Please select province first'}
                    </option>
                    {getAvailableCities().map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="contactNumber" className="block text-sm font-semibold text-gray-700 mb-2">
                  Contact Number *
                </label>
                <input
                  id="contactNumber"
                  name="contactNumber"
                  type="tel"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#028d8f] focus:border-transparent transition-all duration-200"
                  placeholder="Your contact number"
                />
              </div>
            </div>
          </div>

          {/* Price and Additional Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing & Additional Information</h3>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-2">
                  Price (₨) *
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#028d8f] focus:border-transparent transition-all duration-200"
                  placeholder="Enter price"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Suitable For
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {suitableForOptions.map((option) => (
                    <label key={option} className="flex items-center">
                      <input
                        type="checkbox"
                        name={`suitableFor-${option}`}
                        checked={formData.suitableFor.includes(option)}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-[#028d8f] bg-gray-100 border-gray-300 rounded focus:ring-[#028d8f] focus:ring-2"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
                {formData.suitableFor.length > 0 && (
                  <p className="text-sm text-gray-500 mt-2">
                    Selected: {formData.suitableFor.join(', ')}
                  </p>
                )}
              </div>
            </div>

            {/* Health Status */}
            <div className="mt-6">
              <h4 className="text-md font-semibold text-gray-700 mb-3">Health Status</h4>
              <div className="flex gap-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="vaccinated"
                    checked={formData.vaccinated}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-[#028d8f] bg-gray-100 border-gray-300 rounded focus:ring-[#028d8f] focus:ring-2"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">Vaccinated</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="kcpRegistered"
                    checked={formData.kcpRegistered}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-[#FFAC0D] bg-gray-100 border-gray-300 rounded focus:ring-[#FFAC0D] focus:ring-2"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">KCP Registered</span>
                </label>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="images" className="block text-sm font-semibold text-gray-700 mb-2">
              Pet Images *
            </label>

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="mb-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {imagePreviews.length} image{imagePreviews.length !== 1 ? 's' : ''} selected
                </p>
              </div>
            )}

            <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-[#FFAC0D] transition-colors duration-200">
              <div className="space-y-1 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="images" className="relative cursor-pointer bg-white rounded-md font-medium text-[#028d8f] hover:text-[#00595F] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#028d8f]">
                    <span>{imagePreviews.length > 0 ? 'Add more photos' : 'Upload photos'}</span>
                    <input
                      id="images"
                      name="images"
                      type="file"
                      onChange={handleFileChange}
                      multiple
                      accept="image/*"
                      required={imagePreviews.length === 0}
                      className="sr-only"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB each</p>
              </div>
            </div>
          </div>

          <div className="flex space-x-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-[#028d8f] to-[#008080] hover:from-[#00595F] hover:to-[#004d4f] disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 disabled:scale-100 transition-all duration-200 flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Ad...
                </>
              ) : (
                'Create Advertisement'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}