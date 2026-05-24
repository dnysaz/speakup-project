import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import JSZip from "jszip";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data: classes } = await supabase.from("classes").select("id, name").order("name");

  if (!classes || classes.length === 0) {
    return NextResponse.json({ error: "No classes found" }, { status: 404 });
  }

  const zip = new JSZip();

  for (const cls of classes) {
    const [{ data: students }, { data: assignments }] = await Promise.all([
      supabase.from("students").select("id, nim, name").eq("class_id", cls.id).order("name"),
      supabase.from("assignments").select("id, name").eq("class_id", cls.id).order("name"),
    ]);

    if (!students || students.length === 0) continue;
    if (!assignments || assignments.length === 0) continue;

    const { data: submissions } = await supabase
      .from("submissions")
      .select("id, student_id, assignment_id")
      .in("assignment_id", assignments.map((a) => a.id));

    const submissionIds = (submissions || []).map((s) => s.id);
    const { data: gradesData } = submissionIds.length
      ? await supabase.from("grades").select("submission_id, grade").in("submission_id", submissionIds)
      : { data: [] };

    const subMap = new Map((submissions || []).map((s) => [s.id, s]));
    const gradeMap = new Map<string, number | null>();
    for (const g of gradesData || []) {
      const sub = subMap.get(g.submission_id);
      if (sub) gradeMap.set(`${sub.student_id}__${sub.assignment_id}`, g.grade);
    }

    const rows = students.map((s) => {
      const row: Record<string, string | number | null> = {
        "ID": s.nim,
        "Name": s.name,
      };
      for (const a of assignments) {
        row[a.name] = gradeMap.get(`${s.id}__${a.id}`) ?? "";
      }
      return row;
    });

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, cls.name);

    const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
    const folderName = cls.name.replace(/[\/\\?*\[\]]/g, "_");
    zip.file(`${folderName}/${folderName}.xlsx`, buf);
  }

  const zipBuf = await zip.generateAsync({ type: "nodebuffer" });

  return new NextResponse(new Uint8Array(zipBuf), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": 'attachment; filename="export-all-classes.zip"',
    },
  });
}
