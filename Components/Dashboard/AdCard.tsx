import { useState } from 'react';
import { useAdStore } from '@/Store/AdsStore';

interface Ad {
  _id: string;
  title: string;
  description: string;
  price: string;
  category: string;
  location: string;
  breed: string;
  age: string;
  gender: string;
  weight: string;
  height: string;
  maxLife: string;
  contactNumber: string;
  vaccinated: boolean;
  kcpRegistered: boolean;
  suitableFor: string;
  images: string[];
  isApproved: 'pending' | 'approved' | 'rejected';
}

interface AdCardProps {
  ad: Ad;
  index: number;
  onDelete: (adId: string) => void;
  onEdit: (ad: Ad, event: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function AdCard({ ad, index, onDelete, onEdit }: AdCardProps) {
  const { deleteAd, isDeleting } = useAdStore();
  const [isDeletingThis, setIsDeletingThis] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this advertisement?')) {
      setIsDeletingThis(true);
      const success = await deleteAd(ad._id);
      if (success) {
        onDelete(ad._id);
      }
      setIsDeletingThis(false);
    }
  };

  const handleEdit = (event: React.MouseEvent<HTMLButtonElement>) => {
    onEdit(ad, event);
  };

  return (
    <div
      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 overflow-hidden transform hover:scale-[1.02] transition-all duration-300 cursor-pointer"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Image Section */}
      <div className="relative overflow-hidden">
        {ad.images && ad.images.length > 0 ? (
          <div className="relative h-64 overflow-hidden">
            <img
              src={ad.images[0]}
              alt={ad.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Category Badge */}
            <div className="absolute top-4 left-4">
              <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                {ad.category ? ad.category.charAt(0).toUpperCase() + ad.category.slice(1) : 'Pet'}
              </span>
            </div>

            {/* Status Badges */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              {/* Approval Status Badge */}
              <div className={`text-white text-xs font-semibold px-2 py-1 rounded-full shadow-lg ${
                ad.isApproved === 'approved' 
                  ? 'bg-green-500' 
                  : ad.isApproved === 'rejected' 
                    ? 'bg-red-500' 
                    : 'bg-yellow-500'
              }`}>
                {ad.isApproved === 'approved' 
                  ? '✓ Approved' 
                  : ad.isApproved === 'rejected' 
                    ? '✗ Rejected' 
                    : '⏳ Pending'}
              </div>
              
              {ad.vaccinated && (
                <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-lg">
                  Vaccinated
                </span>
              )}
              {ad.kcpRegistered && (
                <span className="bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-lg">
                  KCP Registered
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="h-64 bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center relative">
            <div className="text-center">
              <svg className="w-20 h-20 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-500 text-sm font-medium">No Image</p>
            </div>
            
            {/* Category Badge for no image */}
            <div className="absolute top-4 left-4">
              <span className="bg-gray-800 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                {ad.category ? ad.category.charAt(0).toUpperCase() + ad.category.slice(1) : 'Pet'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Title and Price */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-2 flex-1 mr-3 group-hover:text-[#028d8f] transition-colors duration-200">
            {ad.title || 'Untitled Pet'}
          </h3>
          <div className="flex items-center text-[#028d8f] font-bold text-xl whitespace-nowrap">
            <span className="text-lg">₨</span>
            <span>{Number(ad.price).toLocaleString()}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">
          {ad.description || 'No description available'}
        </p>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center text-gray-500 text-sm">
            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {ad.location || 'Location not specified'}
          </div>
          
          <div className="flex items-center text-gray-500 text-sm">
            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10m0 0l-2-2m2 2l2-2m6-6v6m0 0l2-2m-2 2l-2-2" />
            </svg>
            {ad.breed || 'Breed not specified'}
          </div>
        </div>

        {/* Additional Info */}
        {(ad.age || ad.gender) && (
          <div className="flex items-center justify-between text-xs text-gray-500 mb-4 pb-4 border-b border-gray-100">
            {ad.age && <span>Age: {ad.age} months</span>}
            {ad.gender && <span className="capitalize">{ad.gender}</span>}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={handleEdit}
            className="flex-1 bg-linear-to-r from-[#028d8f] to-[#008080] hover:from-[#00595F] hover:to-[#004d4f] text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center shadow-lg hover:shadow-xl"
            disabled={isDeletingThis}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
          
          <button
            onClick={handleDelete}
            disabled={isDeletingThis}
            className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center shadow-lg hover:shadow-xl"
          >
            {isDeletingThis ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Deleting...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}