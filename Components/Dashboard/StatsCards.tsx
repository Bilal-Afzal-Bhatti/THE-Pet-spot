import { useMemo } from 'react';

interface Ad {
  _id: string;
  isApproved: 'pending' | 'approved' | 'rejected';
  createdAt?: string;
}

interface StatsCardsProps {
  totalAds: number;
  ads?: Ad[];
}

// Simple Chart Component using theme color
const SimpleChart = ({ percentage }: { percentage: number }) => (
  <div className="flex items-center mt-3">
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div 
        className="h-2 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${Math.min(percentage, 100)}%`, background: 'var(--gradient-hero)' }}
      ></div>
    </div>
    <span className="ml-3 text-xs font-medium" style={{ background: 'var(--gradient-hero)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } as React.CSSProperties}>{percentage.toFixed(0)}%</span>
  </div>
);

export default function StatsCards({ totalAds, ads = [] }: StatsCardsProps) {
  const stats = useMemo(() => {
    const pendingAds = ads.filter(ad => ad.isApproved === 'pending').length;
    const approvedAds = ads.filter(ad => ad.isApproved === 'approved').length;
    const rejectedAds = ads.filter(ad => ad.isApproved === 'rejected').length;
    
    // Calculate this month's ads
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const thisMonthAds = ads.filter(ad => {
      if (!ad.createdAt) return false;
      const adDate = new Date(ad.createdAt);
      return adDate.getMonth() === currentMonth && adDate.getFullYear() === currentYear;
    }).length;

    // Calculate percentages
    const pendingPercentage = totalAds > 0 ? (pendingAds / totalAds) * 100 : 0;
    const approvedPercentage = totalAds > 0 ? (approvedAds / totalAds) * 100 : 0;
    const rejectedPercentage = totalAds > 0 ? (rejectedAds / totalAds) * 100 : 0;
    const monthlyPercentage = totalAds > 0 ? (thisMonthAds / totalAds) * 100 : 0;

    return {
      pending: pendingAds,
      approved: approvedAds,
      rejected: rejectedAds,
      thisMonth: thisMonthAds,
      pendingPercentage,
      approvedPercentage,
      rejectedPercentage,
      monthlyPercentage
    };
  }, [ads, totalAds]);

  return (
    <div className="space-y-6">
      {/* First Row - Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Large card - Total Ads */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-4">
                <div className="p-4 rounded-full text-white shadow-lg" style={{ background: 'var(--gradient-hero)' }}>
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-lg font-semibold text-gray-600">Total Advertisements</p>
                  <p className="text-4xl font-bold" style={{ background: 'var(--gradient-hero)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } as React.CSSProperties}>{totalAds}</p>
                </div>
              </div>
              <p className="text-sm text-gray-500">📈 Your complete pet advertisement portfolio</p>
            </div>
          </div>
        </div>

        {/* Success Rate Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-200">
          <div className="text-center">
            <div className="p-3 rounded-full bg-gray-100 mx-auto w-fit mb-3" style={{ background: 'var(--gradient-hero)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } as React.CSSProperties}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-gray-600 mb-1">Ads Approval Rate</p>
            <p className="text-3xl font-bold mb-2" style={{ background: 'var(--gradient-hero)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } as React.CSSProperties}>
              {totalAds > 0 ? `${((stats.approved / totalAds) * 100).toFixed(1)}%` : "0%"}
            </p>
            <SimpleChart percentage={stats.approvedPercentage} />
          </div>
        </div>
      </div>

      {/* Second Row - Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Pending Ads */}
        <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-gray-100" style={{ background: 'var(--gradient-hero)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } as React.CSSProperties}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-xs font-semibold text-gray-500">Pending</p>
              <p className="text-xl font-bold" style={{ background: 'var(--gradient-hero)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } as React.CSSProperties}>{stats.pending}</p>
            </div>
          </div>
          <SimpleChart percentage={stats.pendingPercentage} />
        </div>

        {/* Active Ads */}
        <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-gray-100" style={{ background: 'var(--gradient-hero)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } as React.CSSProperties}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-xs font-semibold text-gray-500">Active</p>
              <p className="text-xl font-bold" style={{ background: 'var(--gradient-hero)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } as React.CSSProperties}>{stats.approved}</p>
            </div>
          </div>
          <SimpleChart percentage={stats.approvedPercentage} />
        </div>

        {/* Rejected Ads */}
        <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-gray-100" style={{ background: 'var(--gradient-hero)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } as React.CSSProperties}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-xs font-semibold text-gray-500">Rejected</p>
              <p className="text-xl font-bold" style={{ background: 'var(--gradient-hero)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } as React.CSSProperties}>{stats.rejected}</p>
            </div>
          </div>
          <SimpleChart percentage={stats.rejectedPercentage} />
        </div>

        {/* This Month */}
        <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-gray-100" style={{ background: 'var(--gradient-hero)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } as React.CSSProperties}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-xs font-semibold text-gray-500">This Month</p>
              <p className="text-xl font-bold" style={{ background: 'var(--gradient-hero)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } as React.CSSProperties}>{stats.thisMonth}</p>
            </div>
          </div>
          <SimpleChart percentage={stats.monthlyPercentage} />
        </div>
      </div>

    </div>
  );
}