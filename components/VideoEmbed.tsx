"use client";

function getEmbedUrl(link: string): string | null {
  try {
    const url = new URL(link);

    // YouTube
    if (url.hostname.includes("youtube.com") || url.hostname.includes("youtu.be")) {
      let videoId = url.searchParams.get("v");
      if (!videoId && url.hostname === "youtu.be") {
        videoId = url.pathname.slice(1);
      }
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }

    // TikTok - no embed, show link
    if (url.hostname.includes("tiktok.com")) return null;

    // Google Drive
    if (url.hostname === "drive.google.com") {
      const match = url.pathname.match(/\/d\/([^/]+)/);
      if (match) return `https://drive.google.com/file/d/${match[1]}/preview`;
    }
  } catch {}
  return null;
}

export default function VideoEmbed({ link }: { link: string }) {
  const embedUrl = getEmbedUrl(link);

  if (embedUrl) {
    return (
      <iframe
        src={embedUrl}
        className="w-full rounded-lg"
        style={{ height: "200px" }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 text-blue-600 hover:underline text-sm break-all"
    >
      🔗 {link}
    </a>
  );
}
