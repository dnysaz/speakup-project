import Link from "next/link";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";

export const revalidate = 0;

const CARD_COLORS = [
  "from-blue-500 to-blue-700",
  "from-purple-500 to-purple-700",
  "from-green-500 to-green-700",
  "from-orange-500 to-orange-700",
  "from-pink-500 to-pink-700",
  "from-teal-500 to-teal-700",
];

export default async function Home() {
  const { data: classes } = await supabase.from("classes").select("id, name").order("name");

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white overflow-hidden">
        <div className="absolute -top-10 -right-10 w-56 h-56 bg-white/10 rounded-full" />
        <div className="absolute -bottom-12 -left-8 w-44 h-44 bg-white/10 rounded-full" />
        <div className="absolute top-6 right-40 w-20 h-20 bg-white/5 rounded-full" />
        <div className="relative max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-2">Welcome to SpeakUp Project</h1>
          <p className="text-blue-200 text-base">Select your class to submit your video assignment.</p>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {!classes || classes.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400">
            No classes available yet. Please contact your lecturer.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {classes.map((cls, i) => (
              <Link
                key={cls.id}
                href={`/kelas/${cls.id}`}
                className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className={`h-20 bg-gradient-to-r ${CARD_COLORS[i % CARD_COLORS.length]} flex items-center px-5`}>
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg">
                    {cls.name.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="p-4">
                  <p className="font-semibold text-gray-800">{cls.name}</p>
                  <p className="text-sm text-gray-400 mt-0.5">Click to enter →</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link href="/guru/login" className="text-sm text-gray-400 hover:text-blue-600 transition-colors">
            Sign in as Lecturer →
          </Link>
        </div>
      </main>
    </div>
  );
}
