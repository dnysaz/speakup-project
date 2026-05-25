"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import GuruNavbar from "@/components/GuruNavbar";
import { supabase } from "@/lib/supabase";

export default function KelasBaru() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    const { error } = await supabase.from("classes").insert({ name: name.trim() });
    setSaving(false);
    if (error) {
      setError(error.message);
    } else {
      router.push("/guru/dashboard");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <GuruNavbar />
      <main className="max-w-md mx-auto px-4 py-10">
        <h1 className="text-xl font-medium mb-6">Add New Class</h1>
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Class Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Class A"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">
              {saving ? "Saving..." : "Save"}
            </button>
            <button type="button" onClick={() => router.back()} disabled={saving} className="text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50">
              Cancel
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
