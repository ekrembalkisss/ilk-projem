import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ScriptVerify Pro | YouTube Script Checker",
  description: "Premium AI-powered YouTube script verification tool. Check your scripts against verified sources like a real human fact-checker.",
  keywords: ["YouTube", "script checker", "fact checking", "content verification", "video production"],
  authors: [{ name: "ScriptVerify Pro" }],
  openGraph: {
    title: "ScriptVerify Pro | YouTube Script Checker",
    description: "Premium AI-powered YouTube script verification tool",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased">
        {/* Animated Beam Background */}
        <div className="beam-container">
          <div className="beam beam-1"></div>
          <div className="beam beam-2"></div>
          <div className="beam beam-3"></div>
          <div className="beam beam-4"></div>
          <div className="beam beam-5"></div>
        </div>
        <div className="vignette"></div>

        {/* Main Content */}
        <main className="relative z-10">
          {children}
        </main>
      </body>
    </html>
  );
}
