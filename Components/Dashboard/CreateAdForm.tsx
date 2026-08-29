"use client";
import { useState } from 'react';
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

interface CreateAdFormProps {
  onSubmit: (formData: FormData) => Promise<boolean>;
  isSubmitting: boolean;
}

export default function CreateAdForm({ onSubmit, isSubmitting }: CreateAdFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
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

  const totalSteps = 3;

//   const suitableForOptions = [
//     'Kids',
//     'Apartments',
//     'First-time owners',
//     'Families',
//     'Seniors',
//     'Active lifestyle',
//     'Indoor living',
//     'Outdoor living',
//     'Other pets'
//   ];

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

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.title && formData.category && formData.breed && formData.gender);
      case 2:
        return !!(formData.age && formData.weight && formData.height && formData.maxLife && formData.description);
      case 3:
        return !!(formData.province && formData.city && formData.contactNumber && formData.price && formData.images.length > 0);
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep) && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep(currentStep)) {
      return;
    }

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

    const success = await onSubmit(formDataToSend);

    if (success) {
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
      setCurrentStep(1);
    }
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

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-center space-x-4">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200 ${
                step <= currentStep
                  ? 'text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
              style={step <= currentStep ? { background: 'var(--gradient-hero)' } : {}}
            >
              {step}
            </div>
            {step < totalSteps && (
              <div
                className={`w-12 h-1 mx-2 transition-all duration-200`}
                style={step < currentStep ? { background: 'var(--gradient-hero)' } : { backgroundColor: '#e5e7eb' }}
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-4">
        <div className="text-sm text-gray-600">
          Step {currentStep} of {totalSteps}
        </div>
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
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
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#55c5d0] focus:border-transparent transition-all duration-200"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#55c5d0] focus:border-transparent transition-all duration-200"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#55c5d0] focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#55c5d0] focus:border-transparent transition-all duration-200"
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
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

      <div>
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
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Location & Contact</h3>

        {/* First row: Province and City */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#55c5d0] focus:border-transparent transition-all duration-200"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#55c5d0] focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
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

        {/* Second row: Price and Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
        <div className="grid grid-cols-1 gap-6">
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
    </div>
  );

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Step {currentStep} of {totalSteps}</h2>
        <p className="text-gray-600 mt-1">Fill in the details to post your pet ad</p>
      </div>

      {renderStepIndicator()}

      <form onSubmit={handleSubmit} className="space-y-6">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}

        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-700 font-semibold rounded-xl transition-all duration-200 flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>

          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={!validateStep(currentStep)}
              className="px-6 py-3 text-white font-semibold rounded-xl transition-all duration-200 flex items-center disabled:bg-gray-400 disabled:cursor-not-allowed"
              style={!validateStep(currentStep) || isSubmitting ? {} : { background: 'var(--gradient-hero)' }}
              onMouseEnter={(e) => {
                if (validateStep(currentStep) && !isSubmitting) {
                  e.currentTarget.style.backgroundColor = '#e55e00';
                }
              }}
              onMouseLeave={(e) => {
                if (validateStep(currentStep) && !isSubmitting) {
                  e.currentTarget.style.background = 'var(--gradient-hero)';
                }
              }}
            >
              Next
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting || !validateStep(currentStep)}
              className="px-6 py-3 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 disabled:scale-100 transition-all duration-200 flex items-center disabled:from-gray-400 disabled:to-gray-500"
              style={!validateStep(currentStep) || isSubmitting ? {} : { background: 'var(--gradient-hero)' }}
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
          )}
        </div>
      </form>
    </div>
  );
}