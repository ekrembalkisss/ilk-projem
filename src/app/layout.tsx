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
      <body className="font-sans antialiased premium-bg grid-pattern noise-texture">
        {children}
      </body>
    </html>
  );
}
