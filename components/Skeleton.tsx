export function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`} />;
}

export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 overflow-hidden ${className}`}>
      <SkeletonBlock className="h-20 rounded-none" />
      <div className="p-4 space-y-2">
        <SkeletonBlock className="h-4 w-3/4" />
        <SkeletonBlock className="h-3 w-1/2" />
      </div>
    </div>
  );
}

export function SkeletonLine({ className = "" }: { className?: string }) {
  return <SkeletonBlock className={`h-4 ${className}`} />;
}

export function SkeletonNavbar() {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
      <SkeletonBlock className="w-8 h-8 rounded-full" />
      <SkeletonBlock className="h-5 w-40" />
      <SkeletonBlock className="h-3 w-24" />
    </div>
  );
}

export function SkeletonBanner() {
  return (
    <div className="bg-gradient-to-r from-blue-500/50 to-blue-700/50 h-32">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <SkeletonBlock className="h-3 w-20 mb-4" />
        <div className="flex items-center gap-3">
          <SkeletonBlock className="w-12 h-12 rounded-full" />
          <div className="space-y-2">
            <SkeletonBlock className="h-5 w-32" />
            <SkeletonBlock className="h-3 w-24" />
          </div>
        </div>
      </div>
    </div>
  );
}
