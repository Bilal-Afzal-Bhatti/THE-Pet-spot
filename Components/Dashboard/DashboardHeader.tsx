interface DashboardHeaderProps {
  onCreateAd: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function DashboardHeader({ onCreateAd }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600">Manage your pet advertisements</p>
      </div>
      {/* <button
        onClick={onCreateAd}
        className="mt-4 sm:mt-0 inline-flex items-center px-6 py-3 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        style={{ background: 'var(--gradient-hero)' }}
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
        </svg>
        Create New Ad
      </button> */}
    </div>
  );
}