interface DashboardHeaderProps {
  onCreateAd: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function DashboardHeader({ onCreateAd }: DashboardHeaderProps) {
  return (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
  <div>
    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">
      Dashboard
    </h1>
    <p className="text-gray-600">Manage your pet advertisements</p>
  </div>
  
  <div>
    {/* Optional: Add action buttons or controls here */}
  </div>
</div>
  );
}