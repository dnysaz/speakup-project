import { supabase } from "@/lib/supabase";
import GuruNavbar from "@/components/GuruNavbar";
import PrintButton from "@/components/PrintButton";
import Link from "next/link";

export const revalidate = 0;

export default async function RekapNilai({ params }: { params: Promise<{ id: string }> }) {
  const { id: classId } = await params;

  const [{ data: cls }, { data: students }, { data: assignments }] = await Promise.all([
    supabase.from("classes").select("name").eq("id", classId).single(),
    supabase.from("students").select("id, nim, name").eq("class_id", classId).order("name"),
    supabase.from("assignments").select("id, name").eq("class_id", classId).order("name"),
  ]);

  const { data: submissions } = await supabase
    .from("submissions")
    .select("id, student_id, assignment_id")
    .in("assignment_id", (assignments || []).map((a) => a.id));

  const submissionIds = (submissions || []).map((s) => s.id);
  const { data: gradesData } = submissionIds.length
    ? await supabase.from("grades").select("submission_id, grade").in("submission_id", submissionIds)
    : { data: [] };

  // Build grade lookup: student_id + assignment_id → grade
  const subMap = new Map((submissions || []).map((s) => [s.id, s]));
  const gradeMap = new Map<string, number | null>();
  for (const g of gradesData || []) {
    const sub = subMap.get(g.submission_id);
    if (sub) gradeMap.set(`${sub.student_id}__${sub.assignment_id}`, g.grade);
  }

  const assignmentList = assignments || [];
  const studentList = students || [];

  return (
    <div className="min-h-screen bg-white">
      <GuruNavbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-4 print:hidden">
          <Link href="/guru/dashboard" className="hover:text-blue-600">← Dashboard</Link>
          <span>/</span>
          <Link href={`/guru/kelas/${classId}`} className="hover:text-blue-600">{cls?.name}</Link>
          <span>/</span>
          <span className="text-gray-700">Grade Summary</span>
        </div>

        <div className="flex items-center justify-between mb-6 print:hidden">
          <h1 className="text-2xl font-medium text-gray-800">Grade Summary — {cls?.name}</h1>
          <div className="flex gap-2">
            <PrintButton />
            <a
              href={`/api/guru/kelas/${classId}/export`}
              className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700"
            >
              ↓ Download Excel
            </a>
          </div>
        </div>

        {/* Print header */}
        <div className="hidden print:block mb-6">
          <h1 className="text-xl font-bold">Grade Summary — {cls?.name}</h1>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="border border-blue-500 px-3 py-2 text-left w-8">No</th>
                <th className="border border-blue-500 px-3 py-2 text-left">Student ID</th>
                <th className="border border-blue-500 px-3 py-2 text-left">Name</th>
                {assignmentList.map((a) => (
                  <th key={a.id} className="border border-blue-500 px-3 py-2 text-center whitespace-nowrap">
                    {a.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {studentList.map((s, i) => (
                <tr key={s.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="border border-gray-200 px-3 py-2 text-gray-400">{i + 1}</td>
                  <td className="border border-gray-200 px-3 py-2 text-gray-600">{s.nim}</td>
                  <td className="border border-gray-200 px-3 py-2 font-medium">{s.name}</td>
                  {assignmentList.map((a) => {
                    const grade = gradeMap.get(`${s.id}__${a.id}`);
                    return (
                      <td key={a.id} className="border border-gray-200 px-3 py-2 text-center">
                        {grade != null ? (
                          <span className="font-medium text-gray-800">{grade}</span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-gray-400 mt-4 print:hidden">
          {studentList.length} students · {assignmentList.length} assignments
        </p>
      </main>
    </div>
  );
}
