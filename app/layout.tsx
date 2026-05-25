import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SpeakUp Project",
  description: "Student video assignment submission platform",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="h-full">
      <body className={`${geist.className} min-h-full bg-gray-50 text-gray-900`}>
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.addEventListener("gesturestart",function(e){e.preventDefault()});document.addEventListener("gesturechange",function(e){e.preventDefault()});`,
          }}
        />
      </body>
    </html>
  );
}
