"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";

type Student = { id: string; nim: string; name: string };
type Assignment = { id: string; name: string };
type Submission = { assignment_id: string };

export default function KelasPage() {
  const { id: classId } = useParams<{ id: string }>();
  const router = useRouter();

  const [className, setClassName] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [nimInput, setNimInput] = useState("");
  const [nimError, setNimError] = useState("");
  const [verified, setVerified] = useState(false);

  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [link, setLink] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function load() {
      const [{ data: cls }, { data: studs }, { data: assigns }] = await Promise.all([
        supabase.from("classes").select("name").eq("id", classId).single(),
        supabase.from("students").select("id, nim, name").eq("class_id", classId).order("name"),
        supabase.from("assignments").select("id, name").eq("class_id", classId).order("name"),
      ]);
      if (cls) setClassName(cls.name);
      if (studs) setStudents(studs);
      if (assigns) setAssignments(assigns);
    }
    load();
  }, [classId]);

  useEffect(() => {
    if (!selectedStudent) return;
    supabase
      .from("submissions")
      .select("assignment_id")
      .eq("student_id", selectedStudent.id)
      .then(({ data }) => setSubmissions(data || []));
  }, [selectedStudent]);

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.nim.toLowerCase().includes(search.toLowerCase())
  );

  function verifyNim() {
    if (nimInput.trim() === selectedStudent?.nim) {
      setVerified(true);
      setNimError("");
    } else {
      setNimError("Student ID does not match. Please try again.");
    }
  }

  function isSubmitted(assignmentId: string) {
    return submissions.some((s) => s.assignment_id === assignmentId);
  }

  async function handleSubmit() {
    if (!selectedStudent || !selectedAssignment || !link.trim()) return;
    setSubmitting(true);
    setErrorMsg("");
    const { error } = await supabase.from("submissions").insert({
      student_id: selectedStudent.id,
      assignment_id: selectedAssignment.id,
      link: link.trim(),
    });
    setSubmitting(false);
    if (error) {
      setErrorMsg("Failed to save. " + error.message);
    } else {
      setSuccessMsg(`Link for ${selectedAssignment.name} has been submitted!`);
      setLink("");
      setSelectedAssignment(null);
      const { data } = await supabase
        .from("submissions")
        .select("assignment_id")
        .eq("student_id", selectedStudent.id);
      setSubmissions(data || []);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar title={className || "SpeakUp Project"} />

      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white overflow-hidden">
        {/* decorative circles */}
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full" />
        <div className="absolute -bottom-10 -left-6 w-32 h-32 bg-white/10 rounded-full" />
        <div className="absolute top-4 right-32 w-16 h-16 bg-white/5 rounded-full" />

        <div className="relative max-w-2xl mx-auto px-4 py-8">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-1 text-blue-200 hover:text-white text-sm mb-4 transition-colors"
          >
            ← Back to Classes
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
              {className.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-blue-200 text-xs uppercase tracking-wider">Class</p>
              <h1 className="text-2xl font-semibold">{className}</h1>
            </div>
          </div>
          <p className="text-blue-200 text-sm mt-3">
            Submit your video assignment link below.
          </p>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-4 py-8">

        {/* Step 1: Find your name */}
        {!verified && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
            <h2 className="text-lg font-medium mb-4">Find your name</h2>
            <input
              type="text"
              placeholder="Type your name or student ID..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setSelectedStudent(null); setNimInput(""); setNimError(""); }}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
            />
            {search && (
              <ul className="divide-y divide-gray-100 max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
                {filtered.length === 0 && (
                  <li className="px-4 py-3 text-sm text-gray-400">Not found</li>
                )}
                {filtered.map((s) => (
                  <li
                    key={s.id}
                    onClick={() => { setSelectedStudent(s); setSearch(s.name); setNimInput(""); setNimError(""); }}
                    className={`px-4 py-3 text-sm cursor-pointer hover:bg-blue-50 ${selectedStudent?.id === s.id ? "bg-blue-50" : ""}`}
                  >
                    <span className="font-medium">{s.name}</span>
                    <span className="text-gray-400 ml-2">({s.nim})</span>
                  </li>
                ))}
              </ul>
            )}

            {selectedStudent && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">
                  Confirm your Student ID for <strong>{selectedStudent.name}</strong>:
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter your Student ID"
                    value={nimInput}
                    onChange={(e) => setNimInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && verifyNim()}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={verifyNim}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
                  >
                    Confirm
                  </button>
                </div>
                {nimError && <p className="text-red-500 text-sm mt-1">{nimError}</p>}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Select assignment & submit */}
        {verified && selectedStudent && (
          <>
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-4 flex items-center justify-between">
              <span className="text-sm text-blue-800">
                Signed in as <strong>{selectedStudent.name}</strong> ({selectedStudent.nim})
              </span>
              <button
                onClick={() => { setVerified(false); setSelectedStudent(null); setSearch(""); setSelectedAssignment(null); setSuccessMsg(""); }}
                className="text-xs text-blue-600 hover:underline"
              >
                Change
              </button>
            </div>

            {successMsg && (
              <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-4 text-sm text-green-800">
                ✓ {successMsg}
              </div>
            )}

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-medium mb-4">Select Assignment</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                {assignments.map((a) => {
                  const done = isSubmitted(a.id);
                  return (
                    <button
                      key={a.id}
                      disabled={done}
                      onClick={() => { setSelectedAssignment(a); setLink(""); setErrorMsg(""); setSuccessMsg(""); }}
                      className={`rounded-lg border px-4 py-3 text-sm font-medium transition-all text-left
                        ${done ? "bg-green-50 border-green-200 text-green-700 cursor-not-allowed" :
                          selectedAssignment?.id === a.id ? "bg-blue-600 border-blue-600 text-white" :
                          "bg-white border-gray-200 hover:border-blue-400 text-gray-700"}`}
                    >
                      {a.name}
                      {done && <span className="block text-xs mt-1 font-normal">✓ Submitted</span>}
                    </button>
                  );
                })}
              </div>

              {selectedAssignment && !isSubmitted(selectedAssignment.id) && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    Paste your video link for <strong>{selectedAssignment.name}</strong>:
                  </p>
                  <input
                    type="url"
                    placeholder="https://youtube.com/... or https://drive.google.com/..."
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                  />
                  {errorMsg && <p className="text-red-500 text-sm mb-2">{errorMsg}</p>}
                  <button
                    onClick={handleSubmit}
                    disabled={submitting || !link.trim()}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
                  >
                    {submitting ? "Submitting..." : "Submit"}
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
