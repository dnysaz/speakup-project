import { SkeletonNavbar, SkeletonCard } from "@/components/Skeleton";

export default function HomeLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SkeletonNavbar />
      <div className="bg-gradient-to-r from-blue-500/50 to-blue-700/50 h-28" />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </main>
    </div>
  );
}
