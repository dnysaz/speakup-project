export default function Navbar({ title = "SpeakUp Project" }: { title?: string }) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">📖</div>
      <span className="text-xl font-medium text-gray-800">{title}</span>
      <span className="text-xs text-gray-500 ml-1">by Diantari Kusuma</span>
    </header>
  );
}
