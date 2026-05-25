"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import QRCode from "qrcode";

export default function ShareClassModal({ classId, className, onClose }: { classId: string; className: string; onClose: () => void }) {
  const link = useMemo(() => `${window.location.origin}/kelas/${classId}`, [classId]);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    QRCode.toDataURL(link, { width: 240, margin: 1.5, color: { dark: "#1e40af" } }).then(setQrDataUrl);
  }, [link]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = document.getElementById("class-link-input") as HTMLInputElement;
      if (input) { input.select(); document.execCommand("copy"); }
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm text-center">
        <h2 className="text-lg font-semibold text-gray-800 mb-1">Share Class</h2>
        <p className="text-sm text-gray-500 mb-5">{className}</p>

        {qrDataUrl && (
          <div className="flex justify-center mb-5">
            <Image src={qrDataUrl} alt="QR Code" width={240} height={240} unoptimized className="rounded-xl border border-gray-200" />
          </div>
        )}

        <div className="flex gap-2 mb-4">
          <input
            id="class-link-input"
            type="text"
            value={link}
            readOnly
            onClick={(e) => (e.target as HTMLInputElement).select()}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-600 bg-gray-50 focus:outline-none"
          />
          <button
            onClick={copyLink}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 whitespace-nowrap"
          >
            {copied ? "✓ Copied" : "Copy"}
          </button>
        </div>

        <button
          onClick={onClose}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Close
        </button>
      </div>
    </div>
  );
}
