import Link from "next/link";
import { supabase } from "@/lib/supabase";
import GuruNavbar from "@/components/GuruNavbar";
import AddAssignmentForm from "@/components/AddAssignmentForm";
import ImportStudentsForm from "@/components/ImportStudentsForm";

export const revalidate = 0;

export default async function GuruKelasDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id: classId } = await params;

  const [{ data: cls }, { data: assignments }, { data: students }] = await Promise.all([
    supabase.from("classes").select("name").eq("id", classId).single(),
    supabase.from("assignments").select("id, name").eq("class_id", classId).order("name"),
    supabase.from("students").select("id").eq("class_id", classId),
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <GuruNavbar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
          <Link href="/guru/dashboard" className="hover:text-blue-600">← Dashboard</Link>
          <span>/</span>
          <span className="text-gray-700">{cls?.name}</span>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-medium text-gray-800">{cls?.name}</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">{students?.length || 0} students</span>
            <a
              href={`/guru/kelas/${classId}/rekap`}
              target="_blank"
              className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700"
            >
              📊 Grade Summary
            </a>
          </div>
        </div>

        {/* Import Students */}
        <section className="mb-8">
          <h2 className="text-base font-medium text-gray-700 mb-3">Students</h2>
          <ImportStudentsForm classId={classId} />
        </section>

        {/* Add Assignment */}
        <section className="mb-6">
          <h2 className="text-base font-medium text-gray-700 mb-3">Add Assignment</h2>
          <AddAssignmentForm classId={classId} />
        </section>

        {/* Assignments Grid */}
        <section className="mb-8">
          <h2 className="text-base font-medium text-gray-700 mb-3">Assignments</h2>
          {!assignments || assignments.length === 0 ? (
            <p className="text-sm text-gray-400">No assignments yet.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {assignments.map((a) => (
                <Link
                  key={a.id}
                  href={`/guru/kelas/${classId}/tugas/${a.id}`}
                  className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow flex flex-col gap-1"
                >
                  <div className="text-2xl">📁</div>
                  <span className="text-sm font-medium text-gray-800">{a.name}</span>
                  <span className="text-xs text-gray-400">View & grade →</span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
