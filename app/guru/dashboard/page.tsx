import Link from "next/link";
import { supabase } from "@/lib/supabase";
import GuruNavbar from "@/components/GuruNavbar";
import ClassCard from "@/components/ClassCard";

export const revalidate = 0;

export default async function GuruDashboard() {
  const { data: classes } = await supabase
    .from("classes")
    .select("id, name")
    .order("name");

  return (
    <div className="min-h-screen bg-gray-50">
      <GuruNavbar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-medium text-gray-800">Class Dashboard</h1>
          <Link
            href="/guru/kelas/baru"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
          >
            + Add Class
          </Link>
        </div>

        {!classes || classes.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-400">
            No classes yet. Click &quot;Add Class&quot; to get started.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {classes.map((cls) => (
              <ClassCard key={cls.id} id={cls.id} name={cls.name} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
