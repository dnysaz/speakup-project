"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AddAssignmentForm({ classId }: { classId: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    await supabase.from("assignments").insert({ name: name.trim(), class_id: classId });
    setSaving(false);
    setName("");
    router.refresh();
  }

  return (
    <form onSubmit={handleAdd} className="flex gap-2 items-center">
      <input
        type="text"
        placeholder="New assignment name, e.g. Week 1"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 max-w-xs"
      />
      <button
        type="submit"
        disabled={saving || !name.trim()}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
      >
        {saving ? "..." : "+ Add Assignment"}
      </button>
    </form>
  );
}
