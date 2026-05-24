"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function AssignmentCard({ id, name, classId }: { id: string; name: string; classId: string }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(name);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editName.trim()) return;
    setSaving(true);
    await supabase.from("assignments").update({ name: editName.trim() }).eq("id", id);
    setSaving(false);
    setEditing(false);
    router.refresh();
  }

  async function handleDelete() {
    setDeleting(true);
    await supabase.from("assignments").delete().eq("id", id);
    setDeleting(false);
    setConfirmDelete(false);
    router.refresh();
  }

  return (
    <>
      <div className="group bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow overflow-hidden relative">
        <Link href={`/guru/kelas/${classId}/tugas/${id}`} className="block p-4 flex flex-col gap-1">
          <div className="text-2xl">📁</div>
          <span className="text-sm font-medium text-gray-800">{name}</span>
          <span className="text-xs text-gray-400">View & grade →</span>
        </Link>

        <div className="absolute top-2 right-2 hidden group-hover:flex gap-1">
          <button
            onClick={(e) => { e.preventDefault(); setEditing(true); setEditName(name); }}
            className="w-7 h-7 bg-white border border-gray-200 hover:bg-blue-500 hover:text-white hover:border-blue-500 rounded-lg flex items-center justify-center text-gray-500 transition-colors shadow-sm"
            title="Edit"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
          <button
            onClick={(e) => { e.preventDefault(); setConfirmDelete(true); }}
            className="w-7 h-7 bg-white border border-gray-200 hover:bg-red-500 hover:text-white hover:border-red-500 rounded-lg flex items-center justify-center text-gray-500 transition-colors shadow-sm"
            title="Delete"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4">Edit Assignment Name</h2>
            <form onSubmit={handleEdit} className="flex flex-col gap-3">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                autoFocus
                className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex gap-2 justify-end">
                <button type="button" onClick={() => setEditing(false)} className="text-sm text-gray-500 hover:text-gray-700 px-3 py-2">
                  Cancel
                </button>
                <button type="submit" disabled={saving || !editName.trim()} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-2">Delete Assignment</h2>
            <p className="text-sm text-gray-600 mb-5">
              Are you sure you want to delete <strong>{name}</strong>? All submissions and grades for this assignment will also be deleted.
            </p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setConfirmDelete(false)} className="text-sm text-gray-500 hover:text-gray-700 px-3 py-2">
                Cancel
              </button>
              <button onClick={handleDelete} disabled={deleting} className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 disabled:opacity-50">
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
