export default function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#028d8f] border-t-transparent mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">Loading your dashboard...</p>
      </div>
    </div>
  );
}