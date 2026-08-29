import { useState } from 'react';

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

interface AdsGridProps {
  ads: Ad[];
  onDeleteAd: (adId: string) => void;
  onEditAd: (ad: Ad, event: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function AdsGrid({ ads, onDeleteAd, onEditAd }: AdsGridProps) {
  const [expandedDescription, setExpandedDescription] = useState<string | null>(null);

  const getStatusBadge = (status: string) => {
    const badgeClasses = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeClasses[status as keyof typeof badgeClasses]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const truncateDescription = (description: string, maxLength: number = 50) => {
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
      
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
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
            <tbody className="divide-y divide-gray-200">
              {ads.map((ad, index) => (
                <tr key={ad._id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      {ad.images.length > 0 && (
                        <div className="flex-shrink-0">
                          <img
                            src={ad.images[0]}
                            alt={ad.title}
                            className="h-12 w-12 rounded-lg object-cover border border-gray-200"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {ad.title}
                        </p>
                        <p className="text-sm text-gray-600">
                          {ad.breed} • {ad.gender} • {ad.age} months
                        </p>
                        <div className="mt-1">
                          <p className="text-xs text-gray-500">
                            {expandedDescription === ad._id 
                              ? ad.description 
                              : truncateDescription(ad.description)
                            }
                            {ad.description.length > 50 && (
                              <button
                                onClick={() => toggleDescription(ad._id)}
                                className="ml-2 font-medium"
                                style={{ background: 'var(--gradient-hero)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                                onMouseEnter={(e) => e.currentTarget.style.color = '#e55e00'}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = 'var(--gradient-hero)';
                                  (e.currentTarget.style as any).webkitBackgroundClip = 'text';
                                  (e.currentTarget.style as any).webkitTextFillColor = 'transparent';
                                }}
                              >
                                {expandedDescription === ad._id ? 'Less' : 'More'}
                              </button>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-gray-900">
                      {parseInt(ad.price).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {ad.category}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {ad.location}
                    </div>
                    <div className="text-xs text-gray-500">
                      {ad.contactNumber}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    {getStatusBadge(ad.isApproved)}
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex flex-col space-y-1">
                      {ad.vaccinated && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                          ✓ Vaccinated
                        </span>
                      )}
                      {ad.kcpRegistered && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                          ✓ KCP Registered
                        </span>
                      )}
                      {!ad.vaccinated && !ad.kcpRegistered && (
                        <span className="text-xs text-gray-400">No certifications</span>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center space-x-3">
                      <button
                        onClick={(e) => onEditAd(ad, e)}
                        className="font-medium text-sm transition-colors duration-200"
                        style={{ background: 'var(--gradient-hero)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#e55e00'}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'var(--gradient-hero)';
                          (e.currentTarget.style as any).webkitBackgroundClip = 'text';
                          (e.currentTarget.style as any).webkitTextFillColor = 'transparent';
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(ad._id, ad.title)}
                        className="text-red-600 hover:text-red-800 font-medium text-sm transition-colors duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
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