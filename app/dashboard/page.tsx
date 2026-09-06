"use client";
import { useState, useEffect } from 'react';
import { authStore } from "@/Store/authStore";
import { useAdStore } from "@/Store/AdsStore";
import { useRouter } from 'next/navigation';
import { toast } from '@/utils/toast';

import DashboardHeader from '@/Components/Dashboard/DashboardHeader';
import StatsCards from '@/Components/Dashboard/StatsCards';
import AdsGrid from '@/Components/Dashboard/AdsGrid';
import CreateAdModal from '@/Components/Dashboard/CreateAdModal';
import EditAdModal from '@/Components/Dashboard/EditAdModal';
import CreateAdForm from '@/Components/Dashboard/CreateAdForm';
import EmptyState from '@/Components/Dashboard/EmptyState';
import ProfileInfoForm from '@/Components/Profile/ProfileInfoForm';
import ChangePasswordForm from '@/Components/Profile/ChangePasswordForm';

interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthStore {
  authUser: AuthUser | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
  signup: (data: any) => Promise<void>;
  login: (formData: any) => Promise<boolean>;
  logout: () => Promise<boolean>;
  checkAuth: () => Promise<void>;
}

export interface Ad {
  _id: string;
  title?: string;
  description?: string;
  price?: string;
  category?: string;
  location?: string;
  breed?: string;
  age?: string;
  gender?: string;
  weight?: string;
  height?: string;
  maxLife?: string;
  contactNumber?: string;
  vaccinated?: boolean;
  kcpRegistered?: boolean;
  suitableFor?: string;
  images?: string[];
  isApproved: 'pending' | 'approved' | 'rejected';
}

interface AdFormData {
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
  images: File[];
}

export default function Dashboard() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const store = authStore() as AuthStore;
  const { authUser, isCheckingAuth, checkAuth } = store;
  const { postAd, updateAd, deleteAd, getUserAds, isPosting, isUpdating, isDeleting } = useAdStore();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAd, setEditingAd] = useState<Ad | null>(null);
  const [modalOrigin, setModalOrigin] = useState<{ x: number; y: number } | null>(null);
  const [editModalOrigin, setEditModalOrigin] = useState<{ x: number; y: number } | null>(null);
  const [activeMenu, setActiveMenu] = useState<'overview' | 'ads' | 'create-ad' | 'profile' | 'change-password'>('overview');

  // Mobile drawer state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    const verifyAuth = async () => {
      await checkAuth();
    };
    verifyAuth();
  }, [checkAuth]);

  // Fetch user's ads after auth check
  useEffect(() => {
    if (isCheckingAuth) return; // Still checking auth

    if (!authUser) {
      router.push('/login');
      return;
    }

    fetchUserAds();
  }, [authUser, isCheckingAuth, router]);

  const fetchUserAds = async () => {
    setLoading(true);
    try {
      const fetchedAds = await getUserAds();
      setAds(fetchedAds);
    } catch (error) {
      // Error handling is already done in getUserAds
    } finally {
      setLoading(false);
    }
  };

  const handleAdSubmit = async (formData: FormData): Promise<boolean> => {
    const success = await postAd(formData);
    if (success) {
      setShowModal(false);
      fetchUserAds(); // Refresh the ads list
    }
    return success;
  };

  const handleAdUpdate = async (adId: string, formData: FormData) => {
    const success = await updateAd(adId, formData);
    if (success) {
      setShowEditModal(false);
      setEditingAd(null);
      fetchUserAds(); // Refresh the ads list
    }
  };

  const handleDeleteAd = async (adId: string) => {
    const success = await deleteAd(adId);
    if (success) {
      setAds(prevAds => prevAds.filter(ad => ad._id !== adId));
      fetchUserAds();
    }
  };

  const handleCreateAd = (event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setModalOrigin({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    });
    setShowModal(true);
  };

  const handleEditAd = (ad: Ad, event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setEditModalOrigin({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    });
    setEditingAd(ad);
    setShowEditModal(true);
  };

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">

      {/* Floating Mobile Menu Toggle (FAB) - only visible on mobile/tablet, hidden on lg+ */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          aria-label="Open Menu"
          className="lg:hidden fixed bottom-6 right-6 z-50 w-13 h-13 rounded-full shadow-lg flex items-center justify-center text-white active:scale-95 transition-transform duration-150"
          style={{ background: "var(--gradient-hero)" }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}

      {/* Hero Section */}
      <section
        className="relative h-16 sm:h-20 lg:h-22.5 w-full flex items-center justify-center shrink-0"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div className="text-center text-white">
          {/* <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Dashboard</h1> */}
          {/* <p className="text-base sm:text-lg opacity-90">Manage your pet advertisements</p> */}
        </div>
      </section>

      {/* Main Layout Container */}
      <div className="flex flex-1 relative overflow-hidden">

        {/* Mobile Backdrop Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 animate-in fade-in"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar / Drawer */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-72 sm:w-64 max-w-[85vw] bg-white shrink-0 border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="p-4 sm:p-6 h-full flex flex-col overflow-y-auto">
            {/* Mobile-only Close Button */}
            <div className="flex justify-end lg:hidden mb-2">
              <button
                onClick={() => setIsSidebarOpen(false)}
                aria-label="Close Menu"
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-4 sm:mb-6">
              <button
                onClick={() => {
                  router.push("/");
                  setIsSidebarOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 group w-full"
                title="Back to Home"
              >
                <svg
                  className="w-4 h-4 text-gray-600 transition-colors duration-200 group-hover:text-indigo-600 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                <span className="text-sm font-medium text-gray-600 transition-colors duration-200 group-hover:text-indigo-600 truncate">
                  Back to home
                </span>
              </button>
            </div>

            <nav className="space-y-1.5 sm:space-y-2">
              <button
                onClick={() => {
                  setActiveMenu('overview');
                  setIsSidebarOpen(false);
                }}
                className={`w-full text-left px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl font-medium text-sm sm:text-base transition-all duration-200 ${
                  activeMenu === 'overview'
                    ? 'text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                style={activeMenu === 'overview' ? { background: 'var(--gradient-hero)' } : {}}
              >
                📊 Overview
              </button>
              <button
                onClick={() => {
                  setActiveMenu('create-ad');
                  setIsSidebarOpen(false);
                }}
                className={`w-full text-left px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl font-medium text-sm sm:text-base transition-all duration-200 ${
                  activeMenu === 'create-ad'
                    ? 'text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                style={activeMenu === 'create-ad' ? { background: 'var(--gradient-hero)' } : {}}
              >
                ➕ Create Ad
              </button>
              <button
                onClick={() => {
                  setActiveMenu('ads');
                  setIsSidebarOpen(false);
                }}
                className={`w-full text-left px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl font-medium text-sm sm:text-base transition-all duration-200 ${
                  activeMenu === 'ads'
                    ? 'text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                style={activeMenu === 'ads' ? { background: 'var(--gradient-hero)' } : {}}
              >
                🐾 My Ads
              </button>
              <button
                onClick={() => {
                  setActiveMenu('profile');
                  setIsSidebarOpen(false);
                }}
                className={`w-full text-left px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl font-medium text-sm sm:text-base transition-all duration-200 ${
                  activeMenu === 'profile'
                    ? 'text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                style={activeMenu === 'profile' ? { background: 'var(--gradient-hero)' } : {}}
              >
                👤 Profile
              </button>
              <button
                onClick={() => {
                  setActiveMenu('change-password');
                  setIsSidebarOpen(false);
                }}
                className={`w-full text-left px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl font-medium text-sm sm:text-base transition-all duration-200 ${
                  activeMenu === 'change-password'
                    ? 'text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                style={activeMenu === 'change-password' ? { background: 'var(--gradient-hero)' } : {}}
              >
                🔒 Change Password
              </button>
            </nav>
          </div>
        </aside>

        {/* Scrollable Main Content */}
        <main className="flex-1 bg-linear-to-br from-teal-50 to-cyan-50 overflow-y-auto min-w-0">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
            {(activeMenu === 'overview' || activeMenu === 'ads') && (
              <div className="mb-4 sm:mb-6">
                <DashboardHeader onCreateAd={handleCreateAd} />
              </div>
            )}

            {activeMenu === 'overview' && (
              <div className="space-y-4 sm:space-y-6">
                <StatsCards totalAds={ads.length} ads={ads} />
              </div>
            )}

            {activeMenu === 'ads' && (
              <div className="space-y-4 sm:space-y-6">
                {ads.length > 0 ? (
                  <AdsGrid
                    ads={ads.map(ad => ({
                      ...ad,
                      description: ad.description || '',
                      price: ad.price || '',
                      title: ad.title || '',
                      category: ad.category || '',
                      location: ad.location || '',
                      breed: ad.breed || '',
                      age: ad.age || '',
                      gender: ad.gender || '',
                      weight: ad.weight || '',
                      height: ad.height || '',
                      maxLife: ad.maxLife || '',
                      contactNumber: ad.contactNumber || '',
                      suitableFor: ad.suitableFor || '',
                      vaccinated: ad.vaccinated ?? false,
                      kcpRegistered: ad.kcpRegistered ?? false,
                      images: ad.images || [],
                      isApproved: ad.isApproved || 'pending'
                    }))}
                    onDeleteAd={handleDeleteAd}
                    onEditAd={handleEditAd}
                  />
                ) : (
                  <EmptyState onCreateAd={() => setShowModal(true)} />
                )}
              </div>
            )}

            {activeMenu === 'create-ad' && (
              <div className="space-y-4 sm:space-y-6">
                <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 border border-gray-100">
                  <CreateAdForm onSubmit={handleAdSubmit} isSubmitting={isPosting} />
                </div>
              </div>
            )}

            {activeMenu === 'profile' && (
              <div className="space-y-4 sm:space-y-6">
                <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 border border-gray-100">
                  <ProfileInfoForm />
                </div>
              </div>
            )}

            {activeMenu === 'change-password' && (
              <div className="space-y-4 sm:space-y-6">
                <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 border border-gray-100">
                  <ChangePasswordForm />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <CreateAdModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setModalOrigin(null);
        }}
        onSubmit={handleAdSubmit}
        isSubmitting={isPosting}
        originPosition={modalOrigin}
      />

      <EditAdModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingAd(null);
          setEditModalOrigin(null);
        }}
        onSubmit={handleAdUpdate}
        isSubmitting={isUpdating}
        ad={editingAd}
        originPosition={editModalOrigin}
      />
    </div>
  );
}