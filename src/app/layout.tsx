import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TrendMind — استوديو الحملات الذكية",
  description:
    "TrendMind يحول الإيجاز إلى زوايا مدروسة، محاكاة جمهور، أصول إبداعية، وحزمة إطلاق جاهزة.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="h-full">
      <body className="h-full overflow-hidden">{children}</body>
    </html>
  );
}
