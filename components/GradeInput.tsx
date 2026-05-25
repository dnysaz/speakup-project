"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function GradeInput({
  submissionId,
  gradeId: initialGradeId,
  initialGrade,
}: {
  submissionId: string;
  gradeId?: string;
  initialGrade: number | null;
}) {
  const [grade, setGrade] = useState(initialGrade?.toString() ?? "");
  const [gradeId, setGradeId] = useState(initialGradeId);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function save() {
    const val = parseFloat(grade);
    if (grade === "" || isNaN(val)) return;
    setSaving(true);
    setError("");

    // Try simple insert first, then update if conflict
    if (gradeId) {
      const { error: err } = await supabase
        .from("grades")
        .update({ grade: val, graded_at: new Date().toISOString() })
        .eq("id", gradeId);
      setSaving(false);
      if (err) { setError("Update error: " + err.message); return; }
    } else {
      const { data, error: err } = await supabase
        .from("grades")
        .insert({ submission_id: submissionId, grade: val })
        .select("id")
        .single();
      setSaving(false);
      if (err) {
        // If duplicate, try update by submission_id
        if (err.code === "23505") {
          const { data: existing } = await supabase
            .from("grades")
            .select("id")
            .eq("submission_id", submissionId)
            .single();
          if (existing) {
            setGradeId(existing.id);
            await supabase.from("grades").update({ grade: val }).eq("id", existing.id);
          }
        } else {
          setError("Insert error: " + err.message + " (code: " + err.code + ")");
          return;
        }
      } else if (data?.id) {
        setGradeId(data.id);
      }
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-500">Grade</label>
      <div className="flex gap-1">
        <input
          type="number"
          min={0}
          max={100}
          step={0.5}
          value={grade}
          onChange={(e) => { setGrade(e.target.value); setSaved(false); }}
          onKeyDown={(e) => e.key === "Enter" && save()}
          placeholder="0–100"
          className="w-20 border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={save}
          disabled={saving || grade === ""}
          className="bg-blue-600 text-white px-2 py-1 rounded-lg text-xs hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "..." : "✓"}
        </button>
      </div>
      {saved && <span className="text-xs text-green-600">✓ Saved</span>}
      {error && <span className="text-xs text-red-500 break-all">{error}</span>}
    </div>
  );
}
