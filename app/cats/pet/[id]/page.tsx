"use client";
import React, { useEffect, useState } from "react";
import { FiMapPin, FiDollarSign, FiCalendar, FiUser, FiPhone } from "react-icons/fi";
import { FaDog, FaWeight, FaRulerVertical, FaHeartbeat, FaSyringe, FaCertificate } from "react-icons/fa";
import { useAdStore } from "@/Store/AdsStore";

export default function CatDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { getApprovedCatAdById } = useAdStore();
  const [pet, setPet] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const resolvedParams = React.use(params);

  useEffect(() => {
    const fetchPet = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getApprovedCatAdById(resolvedParams.id);
        if (data) {
          setPet(data);
        } else {
          setError("Pet not found");
        }
      } catch (err) {
        console.error("Failed to fetch pet:", err);
        setError("Failed to load pet details");
      } finally {
        setLoading(false);
      }
    };

    if (resolvedParams.id) {
      fetchPet();
    }
  }, [resolvedParams.id, getApprovedCatAdById]);

  if (loading) {
    return (
      <div className="min-h-screen font-raleway">
        <div className="h-25" style={{background: "var(--gradient-hero)"}}></div>
        <div className="p-6 px-44 -mt-16 relative z-10 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading cat details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !pet) {
    return (
      <div className="min-h-screen font-raleway">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 h-32"></div>
        <div className="p-6 px-44 -mt-16 relative z-10 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-6xl mb-4">🐱</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {error || "Cat not found"}
            </h2>
            <p className="text-gray-500">The cat you're looking for might have been removed or is no longer available.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-raleway">
      {/* Banner Background for Navbar Visibility */}
      <div className="h-25" style={{background: "var(--gradient-hero)"}}></div>
      
      <div className="p-6 px-44 relative z-10">
        {/* Breadcrumb */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-700 mb-3">
            <a href="/" className="hover:text-orange-600 cursor-pointer transition-colors">Home</a>
            <span>→</span>
            <a href="/cats/for-sale" className="hover:text-orange-600 cursor-pointer transition-colors">Cats</a>
            <span>→</span>
            <span className="text-gray-800 font-medium">{pet.name}</span>
          </div>
        </div>

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg">
              <img
                src={pet.images?.[currentImageIndex] || pet.img || '/default-pet.jpg'}
                alt={pet.name}
                className="w-full h-full object-cover"
              />
              {pet.images && pet.images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImageIndex(prev => prev === 0 ? pet.images.length - 1 : prev - 1)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                  >
                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex(prev => prev === pet.images.length - 1 ? 0 : prev + 1)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                  >
                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {pet.images.map((_: string, index: number) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                          index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
            {pet.images && pet.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {pet.images.map((img: string, index: number) => (
                  <div 
                    key={index} 
                    className={`aspect-square rounded-lg overflow-hidden cursor-pointer transition-all ${
                      index === currentImageIndex ? 'ring-2 ring-orange-500' : ''
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <img
                      src={img}
                      alt={`${pet.name} ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Description */}
            {pet.description && (
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Description</h3>
                <p className="text-gray-700 leading-relaxed">{pet.description}</p>
              </div>
            )}

            {/* Seller Info */}
            {pet.user && (
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Seller Information</h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <FiUser className="text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{pet.user.name}</p>
                    <p className="text-sm text-gray-500">{pet.user.email}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Pet Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">{pet.name}</h1>
              <div className="flex items-center gap-4 text-gray-600 mb-4">
                <span className="flex items-center gap-2">
                  <FaDog className="text-orange-600" />
                  {pet.breed}
                </span>
                <span className="flex items-center gap-2">
                  <FiMapPin className="text-orange-600" />
                  {pet.city}
                </span>
              </div>
              <div className="text-3xl font-bold text-orange-600 mb-6 text0">
                PKR {pet.price?.toLocaleString() || 'N/A'}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <a
                href={`tel:${pet.contactNumber}`}
                className="px-4 py-3 rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors text-sm font-medium text-center block text-white"
                style={{background: "var(--gradient-hero)"}}
              >
                <FiPhone className="inline mr-2" />
                Call
              </a>
              <a
                href={`https://wa.me/${pet.contactNumber}?text=${encodeURIComponent('Hi, I saw your ad, I am interested')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors text-sm font-medium text-center block text-white"
                style={{background: "var(--gradient-hero)"}}
              >
                Chat
              </a>
            </div>

            {/* Key Details */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Cat Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <FiUser className="text-orange-600" />
                  <div>
                    <p className="text-sm text-gray-500">Gender</p>
                    <p className="font-medium">{pet.gender}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FiCalendar className="text-orange-600" />
                  <div>
                    <p className="text-sm text-gray-500">Age</p>
                    <p className="font-medium">{pet.age} months</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FaWeight className="text-orange-600" />
                  <div>
                    <p className="text-sm text-gray-500">Weight</p>
                    <p className="font-medium">{pet.weight} kg</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FaRulerVertical className="text-orange-600" />
                  <div>
                    <p className="text-sm text-gray-500">Height</p>
                    <p className="font-medium">{pet.height} cm</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Health & Features */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Health & Features</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <FaSyringe className="text-orange-600" />
                    Vaccinated
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    pet.vaccinated ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {pet.vaccinated ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <FaCertificate className="text-orange-600" />
                    KCI Registered
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    pet.kcpRegistered ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {pet.kcpRegistered ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <FaHeartbeat className="text-orange-600" />
                    Life Expectancy
                  </span>
                  <span className="font-medium">{pet.maxLife} years</span>
                </div>
              </div>
            </div>

            {/* Suitable For */}
            {pet.suitableFor && pet.suitableFor.length > 0 && (
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Suitable For</h3>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(pet.suitableFor) ? pet.suitableFor.map((item: string, index: number) => (
                    <span key={index} className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                      {item.trim()}
                    </span>
                  )) : (
                    <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                      {pet.suitableFor}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}