import { SkeletonNavbar, SkeletonBlock } from "@/components/Skeleton";

export default function RekapLoading() {
  return (
    <div className="min-h-screen bg-white">
      <SkeletonNavbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-4">
          <SkeletonBlock className="h-3 w-20" />
          <SkeletonBlock className="h-3 w-2" />
          <SkeletonBlock className="h-3 w-24" />
          <SkeletonBlock className="h-3 w-2" />
          <SkeletonBlock className="h-3 w-28" />
        </div>

        <div className="flex items-center justify-between mb-6">
          <SkeletonBlock className="h-7 w-64" />
          <div className="flex gap-2">
            <SkeletonBlock className="h-9 w-36 rounded-lg" />
            <SkeletonBlock className="h-9 w-40 rounded-lg" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {Array.from({ length: 6 }).map((_, i) => (
                  <th key={i} className="px-3 py-2">
                    <SkeletonBlock className={`h-4 ${i === 0 ? "w-6" : i < 3 ? "w-16" : "w-14"}`} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 8 }).map((_, row) => (
                <tr key={row}>
                  {Array.from({ length: 6 }).map((_, col) => (
                    <td key={col} className="px-3 py-2">
                      <SkeletonBlock className={`h-4 ${col === 0 ? "w-6" : col < 3 ? "w-20" : "w-10"}`} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
