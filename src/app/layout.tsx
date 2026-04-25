import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TrendMind — AI-Powered Marketing Workspace",
  description: "TrendMind is an AI-powered marketing intelligence platform that orchestrates campaign strategy, brand analysis, and content creation through collaborative AI agents.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full overflow-hidden">{children}</body>
    </html>
  );
}
