"use client";
import { useState, useEffect } from 'react';
import { authStore } from '@/Store/authStore';
import ProfilePictureUpload from './ProfilePictureUpload';

interface AuthUser {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthStore {
  authUser: AuthUser | null;
  isUpdatingProfile: boolean;
  updateUser: (formData: FormData) => Promise<boolean>;
}

interface ProfileInfoFormProps {
  onSuccess?: () => void;
}

export default function ProfileInfoForm({ onSuccess }: ProfileInfoFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const store = authStore() as AuthStore;
  const { authUser, isUpdatingProfile, updateUser } = store;

  // Initialize form with current user data
  useEffect(() => {
    if (authUser) {
      setFormData({
        name: authUser.name || '',
        email: authUser.email || ''
      });
    }
  }, [authUser]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (selectedImage && selectedImage.size > 5 * 1024 * 1024) {
      newErrors.image = 'Image size must be less than 5MB';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const submitData = new FormData();
    submitData.append('name', formData.name.trim());
    submitData.append('email', formData.email.trim());

    if (selectedImage) {
      submitData.append('avatar', selectedImage);
    }

    if (removeImage) {
      submitData.append('removeProfileImage', 'true');
    }

    const success = await updateUser(submitData);
    if (success) {
      setSelectedImage(null);
      setRemoveImage(false);
      onSuccess?.();
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Profile Picture Upload */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Profile Picture
        </label>
        <ProfilePictureUpload
          currentImage={authUser?.avatar}
          onImageChange={(file) => {
            setSelectedImage(file);
            if (errors.image) {
              setErrors(prev => ({ ...prev, image: '' }));
            }
          }}
          onImageRemove={() => setRemoveImage(true)}
        />
        {errors.image && (
          <p className="mt-1 text-sm text-red-600">{errors.image}</p>
        )}
      </div>

      {/* Name Field */}
      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
          Full Name
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#028d8f] focus:border-transparent transition-all ${
            errors.name ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Enter your full name"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#028d8f] focus:border-transparent transition-all ${
            errors.email ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Enter your email address"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isUpdatingProfile}
          className="px-8 py-3 bg-linear-to-r from-[#028d8f] to-[#008080] hover:from-[#00595F] hover:to-[#004d4f] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          style={{ background: "var(--gradient-hero)" }}
        >
          {isUpdatingProfile ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Updating...
            </div>
          ) : (
            'Update Profile'
          )}
        </button>
      </div>
    </form>
  );
}