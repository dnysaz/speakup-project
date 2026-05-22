import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { supabase } from "@/lib/supabase";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: classId } = await params;

  const [{ data: cls }, { data: students }, { data: assignments }] = await Promise.all([
    supabase.from("classes").select("name").eq("id", classId).single(),
    supabase.from("students").select("id, nim, name").eq("class_id", classId).order("name"),
    supabase.from("assignments").select("id, name").eq("class_id", classId).order("name"),
  ]);

  const { data: submissions } = await supabase
    .from("submissions")
    .select("id, student_id, assignment_id, grades(grade)")
    .in("assignment_id", (assignments || []).map((a) => a.id));

  // Build lookup: student_id + assignment_id → grade
  const gradeMap = new Map<string, number | null>();
  for (const sub of submissions || []) {
    const key = `${sub.student_id}__${sub.assignment_id}`;
    gradeMap.set(key, sub.grades?.[0]?.grade ?? null);
  }

  const assignmentList = assignments || [];
  const studentList = students || [];

  // Build rows
  const rows = studentList.map((s) => {
    const row: Record<string, string | number | null> = {
      NIM: s.nim,
      Nama: s.name,
    };
    for (const a of assignmentList) {
      const grade = gradeMap.get(`${s.id}__${a.id}`);
      row[a.name] = grade ?? "";
    }
    return row;
  });

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, cls?.name || "Nilai");

  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

  return new NextResponse(buf, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="nilai-${cls?.name || classId}.xlsx"`,
    },
  });
}
