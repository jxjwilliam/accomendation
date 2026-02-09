import type { Metadata } from "next";
import "./globals.css";
import { getDefaultTitle, getDefaultDescription } from "@/lib/seo";

export const metadata: Metadata = {
  title: getDefaultTitle("en"),
  description: getDefaultDescription("en"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
