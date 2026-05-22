"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import { supabase } from "@/lib/supabase";

export default function ImportStudentsForm({ classId }: { classId: string }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setStatus("");

    const buffer = await file.arrayBuffer();
    const wb = XLSX.read(buffer);
    const ws = wb.Sheets[wb.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json<{ NIM: string; Nama: string }>(ws, { defval: "" });

    const students = rows
      .filter((r) => r.NIM && r.Nama)
      .map((r) => ({ nim: String(r.NIM).trim(), name: String(r.Nama).trim(), class_id: classId }));

    if (students.length === 0) {
      setStatus("Invalid file. Make sure columns NIM and Nama exist.");
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from("students")
      .upsert(students, { onConflict: "nim,class_id" });

    setLoading(false);
    if (error) {
      setStatus("Error: " + error.message);
    } else {
      setStatus(`✓ ${students.length} students imported successfully.`);
      router.refresh();
    }
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <p className="text-sm text-gray-600 mb-3">
        Import students via Excel. Required columns: <code className="bg-gray-100 px-1 rounded">NIM</code> and <code className="bg-gray-100 px-1 rounded">Nama</code>
      </p>
      <div className="flex items-center gap-3">
        <input
          ref={fileRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFile}
          disabled={loading}
          className="text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {loading && <span className="text-sm text-gray-400">Importing...</span>}
      </div>
      {status && (
        <p className={`mt-2 text-sm ${status.startsWith("✓") ? "text-green-600" : "text-red-500"}`}>
          {status}
        </p>
      )}
    </div>
  );
}
