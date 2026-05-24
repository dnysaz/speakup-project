import { SkeletonNavbar, SkeletonBlock } from "@/components/Skeleton";

export default function GuruKelasLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SkeletonNavbar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-4">
          <SkeletonBlock className="h-3 w-20" />
          <SkeletonBlock className="h-3 w-2" />
          <SkeletonBlock className="h-3 w-24" />
        </div>

        <div className="flex items-center justify-between mb-6">
          <SkeletonBlock className="h-7 w-40" />
          <div className="flex gap-3">
            <SkeletonBlock className="h-4 w-20" />
            <SkeletonBlock className="h-9 w-36 rounded-lg" />
          </div>
        </div>

        <div className="mb-8">
          <SkeletonBlock className="h-5 w-20 mb-3" />
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <SkeletonBlock className="h-3 w-72 mb-3" />
            <SkeletonBlock className="h-9 w-40 rounded-lg" />
          </div>
        </div>

        <div className="mb-6">
          <SkeletonBlock className="h-5 w-28 mb-3" />
          <SkeletonBlock className="h-9 w-64 rounded-lg" />
        </div>

        <div>
          <SkeletonBlock className="h-5 w-24 mb-3" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 space-y-2">
                <SkeletonBlock className="h-7 w-7" />
                <SkeletonBlock className="h-4 w-20" />
                <SkeletonBlock className="h-3 w-24" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
