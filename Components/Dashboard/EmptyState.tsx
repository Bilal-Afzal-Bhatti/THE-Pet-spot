interface EmptyStateProps {
  onCreateAd: () => void;
}

export default function EmptyState({ onCreateAd }: EmptyStateProps) {
  return (
    <div className="text-center py-16">
      <div className="mx-auto w-32 h-32 rounded-full flex items-center justify-center mb-8" style={{background: "var(--gradient-hero)"}}>
        <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
        </svg>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-4">No advertisements yet</h3>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Start by creating your first pet advertisement. Share your furry friends with the community!
      </p>
      {/* <button
        onClick={onCreateAd}
        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#028d8f] to-[#008080] hover:from-[#00595F] hover:to-[#004d4f] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        style={{background: "var(--gradient-hero)"}}
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
        </svg>
        Create Your First Ad
      </button> */}
    </div>
  );
}