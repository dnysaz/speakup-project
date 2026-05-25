"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function GuruNavbar() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/guru/logout", { method: "POST" });
    router.push("/guru/login");
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <Link href="/guru/dashboard" className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">📖</div>
        <span className="text-xl font-medium text-gray-800">SpeakUp Project</span>
        <span className="text-xs text-gray-500 ml-1">by Diantari Kusuma</span>
      </Link>
      <button onClick={logout} className="text-sm text-gray-500 hover:text-red-500 transition-colors">
        Sign Out
      </button>
    </header>
  );
}
