import { SkeletonNavbar, SkeletonBlock } from "@/components/Skeleton";

export default function TugasLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SkeletonNavbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-4">
          <SkeletonBlock className="h-3 w-20" />
          <SkeletonBlock className="h-3 w-2" />
          <SkeletonBlock className="h-3 w-24" />
          <SkeletonBlock className="h-3 w-2" />
          <SkeletonBlock className="h-3 w-20" />
        </div>

        <SkeletonBlock className="h-7 w-48 mb-6" />

        <div className="flex flex-col gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col md:flex-row gap-4">
              <div className="md:w-48 flex-shrink-0 space-y-2">
                <SkeletonBlock className="h-4 w-32" />
                <SkeletonBlock className="h-3 w-20" />
              </div>
              <div className="flex-1">
                <SkeletonBlock className="h-32 w-full rounded-lg" />
              </div>
              <div className="md:w-36 flex-shrink-0 space-y-2">
                <SkeletonBlock className="h-3 w-10" />
                <SkeletonBlock className="h-8 w-24 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
