import { SkeletonNavbar, SkeletonBlock, SkeletonBanner } from "@/components/Skeleton";

export default function KelasLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SkeletonNavbar />
      <SkeletonBanner />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
          <SkeletonBlock className="h-5 w-32 mb-4" />
          <SkeletonBlock className="h-10 w-full mb-3" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2 p-3">
                <SkeletonBlock className="h-4 w-32" />
                <SkeletonBlock className="h-3 w-16" />
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <SkeletonBlock className="h-5 w-36 mb-4" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonBlock key={i} className="h-20 rounded-lg" />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
