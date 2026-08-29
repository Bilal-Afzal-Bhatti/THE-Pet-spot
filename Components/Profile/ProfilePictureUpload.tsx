"use client";
import { useState, useEffect, useRef } from 'react';

interface ProfilePictureUploadProps {
  currentImage?: string;
  onImageChange: (file: File | null) => void;
  onImageRemove?: () => void;
}

export default function ProfilePictureUpload({ currentImage, onImageChange, onImageRemove }: ProfilePictureUploadProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to append backend URL to relative paths
  const getImageUrl = (path?: string) => {
    if (!path) return null;
    if (path.startsWith('http') || path.startsWith('data:') || path.startsWith('blob:')) {
      return path;
    }
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    return `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  // Sync state when currentImage changes or after async fetch
  useEffect(() => {
    if (currentImage) {
      setPreviewImage(getImageUrl(currentImage));
    } else {
      setPreviewImage(null);
    }
  }, [currentImage]);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      onImageChange(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    onImageChange(null);
    onImageRemove?.();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
     

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-[#028d8f] bg-[#028d8f]/5'
            : 'border-gray-300 hover:border-[#028d8f] hover:bg-gray-50'
        }`}
      >
        {previewImage ? (
          <div className="space-y-4">
            <div className="relative inline-block">
              <img
                src={previewImage}
                alt="Profile preview"
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg mx-auto"
                onError={(e) => {
                  // Fallback if the image URL fails to load over HTTP
                  (e.currentTarget as HTMLImageElement).src = '/default-avatar.png';
                }}
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveImage();
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-sm text-gray-500">
              Click to change or drag and drop a new image
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mx-auto w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center border-4 border-white shadow-lg">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900 mb-1">
                Upload Profile Picture
              </p>
              <p className="text-sm text-gray-500">
                Drag and drop an image here, or click to select
              </p>
              <p className="text-xs text-gray-400 mt-1">
                PNG, JPG up to 5MB
              </p>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>
    </div>
  );
}