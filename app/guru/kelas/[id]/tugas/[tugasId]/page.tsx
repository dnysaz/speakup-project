import Link from "next/link";
import { supabase } from "@/lib/supabase";
import GuruNavbar from "@/components/GuruNavbar";
import GradeInput from "@/components/GradeInput";
import VideoEmbed from "@/components/VideoEmbed";

export const revalidate = 0;

export default async function TugasDetail({
  params,
}: {
  params: Promise<{ id: string; tugasId: string }>;
}) {
  const { id: classId, tugasId } = await params;

  const [{ data: cls }, { data: assignment }, { data: students }] = await Promise.all([
    supabase.from("classes").select("name").eq("id", classId).single(),
    supabase.from("assignments").select("name").eq("id", tugasId).single(),
    supabase.from("students").select("id, nim, name").eq("class_id", classId).order("name"),
  ]);

  // Get submissions
  const { data: submissions } = await supabase
    .from("submissions")
    .select("id, student_id, link")
    .eq("assignment_id", tugasId);

  // Get grades separately (avoid nested join issues)
  const submissionIds = (submissions || []).map((s) => s.id);
  const { data: gradesData } = submissionIds.length
    ? await supabase.from("grades").select("id, submission_id, grade").in("submission_id", submissionIds)
    : { data: [] };

  const gradeBySubmission = new Map((gradesData || []).map((g) => [g.submission_id, g]));

  const submissionMap = new Map(
    (submissions || []).map((s) => [
      s.student_id,
      { ...s, gradeRow: gradeBySubmission.get(s.id) ?? null },
    ])
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <GuruNavbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
          <Link href="/guru/dashboard" className="hover:text-blue-600">← Dashboard</Link>
          <span>/</span>
          <Link href={`/guru/kelas/${classId}`} className="hover:text-blue-600">{cls?.name}</Link>
          <span>/</span>
          <span className="text-gray-700">{assignment?.name}</span>
        </div>

        <h1 className="text-2xl font-medium text-gray-800 mb-6">{assignment?.name}</h1>

        {!students || students.length === 0 ? (
          <p className="text-gray-400">No students in this class yet.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {students.map((student) => {
              const sub = submissionMap.get(student.id);
              const gradeRow = sub?.gradeRow;
              return (
                <div
                  key={student.id}
                  className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col md:flex-row gap-4"
                >
                  {/* Student info */}
                  <div className="md:w-48 flex-shrink-0">
                    <p className="font-medium text-gray-800 text-sm">{student.name}</p>
                    <p className="text-xs text-gray-400">{student.nim}</p>
                    {!sub && (
                      <span className="inline-block mt-2 text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                        Not submitted
                      </span>
                    )}
                  </div>

                  {/* Video */}
                  <div className="flex-1">
                    {sub ? (
                      <VideoEmbed link={sub.link} />
                    ) : (
                      <div className="h-32 bg-gray-50 rounded-lg border border-dashed border-gray-200 flex items-center justify-center text-sm text-gray-300">
                        No video
                      </div>
                    )}
                  </div>

                  {/* Grade */}
                  <div className="md:w-36 flex-shrink-0 flex flex-col gap-2">
                    {sub ? (
                      <GradeInput
                        submissionId={sub.id}
                        gradeId={gradeRow?.id}
                        initialGrade={gradeRow?.grade ?? null}
                      />
                    ) : (
                      <div className="text-sm text-gray-300">—</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
