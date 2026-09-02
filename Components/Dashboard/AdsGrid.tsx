import { useState } from 'react';
import { Base_URL } from '@/Store/AdsStore';

interface Ad {
  _id: string;
  name?: string;
  title?: string;
  description: string;
  price: string;
  category: string;
  city?: string;
  location?: string;
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

interface AdsGridProps {
  ads: Ad[];
  onDeleteAd: (adId: string) => void;
  onEditAd: (ad: Ad, event: React.MouseEvent<HTMLButtonElement>) => void;
}

// Picks the first real, loadable image (Vercel Blob or any other full URL).
// Old local "/uploads/..." paths from pre-Blob test data never resolve on
// the deployed site, so they're skipped here instead of showing a broken image.
const getFirstValidImage = (images?: string[]): string => {
  const valid = (images || []).find(
    (img) => img?.startsWith('http://') || img?.startsWith('https://') || img?.startsWith('blob:')
  );
  return valid || 'https://via.placeholder.com/150?text=No+Image';
};

export default function AdsGrid({ ads, onDeleteAd, onEditAd }: AdsGridProps) {
  const [expandedDescription, setExpandedDescription] = useState<string | null>(null);

  const getStatusBadge = (status: string) => {
    const badgeClasses = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeClasses[status as keyof typeof badgeClasses] || 'bg-gray-100 text-gray-800'}`}>
        {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Pending'}
      </span>
    );
  };

  const truncateDescription = (description: string = '', maxLength: number = 50) => {
    if (description.length <= maxLength) return description;
    return description.slice(0, maxLength) + '...';
  };

  const toggleDescription = (adId: string) => {
    setExpandedDescription(expandedDescription === adId ? null : adId);
  };

  const handleDeleteClick = (adId: string, adTitle: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the ad "${adTitle}"?\n\nThis action cannot be undone.`
    );

    if (confirmed) {
      onDeleteAd(adId);
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Advertisements</h2>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Pet Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Price (PKR)
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Health
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {ads.map((ad) => {
                const titleText = ad.name || ad.title || 'Untitled Pet';
                const locationText = ad.city || ad.location || 'Location not specified';

                return (
                  <tr key={ad._id} className="hover:bg-gray-50/80 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <div className="shrink-0">
                          <img
                            src={getFirstValidImage(ad.images)}
                            alt={titleText}
                            className="h-14 w-14 rounded-xl object-cover border border-gray-200 shadow-sm"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://via.placeholder.com/150?text=No+Image";
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {titleText}
                          </p>
                          <p className="text-sm text-gray-600">
                            {ad.breed || 'Breed N/A'} • {ad.gender || 'N/A'} • {ad.age ? `${ad.age} months` : 'Age N/A'}
                          </p>
                          <div className="mt-1">
                            <p className="text-xs text-gray-500">
                              {expandedDescription === ad._id
                                ? ad.description
                                : truncateDescription(ad.description || '')
                              }
                              {ad.description && ad.description.length > 50 && (
                                <button
                                  onClick={() => toggleDescription(ad._id)}
                                  className="ml-2 font-semibold text-[#028d8f] hover:underline"
                                >
                                  {expandedDescription === ad._id ? 'Less' : 'More'}
                                </button>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">
                        ₨ {Number(ad.price || 0).toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500 capitalize">
                        {ad.category || 'Pet'}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">
                        {locationText}
                      </div>
                      <div className="text-xs text-gray-500">
                        {ad.contactNumber || 'No contact provided'}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(ad.isApproved)}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        {ad.vaccinated && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 w-fit">
                            ✓ Vaccinated
                          </span>
                        )}
                        {ad.kcpRegistered && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 w-fit">
                            ✓ KCP Registered
                          </span>
                        )}
                        {!ad.vaccinated && !ad.kcpRegistered && (
                          <span className="text-xs text-gray-400">None</span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-3">
                        <button
                          onClick={(e) => onEditAd(ad, e)}
                          className="font-semibold text-sm text-[#028d8f] hover:text-[#00595F] transition-colors duration-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(ad._id, titleText)}
                          className="text-red-600 hover:text-red-800 font-semibold text-sm transition-colors duration-200"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {ads.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No advertisements found.</p>
          </div>
        )}
      </div>
    </div>
  );
}