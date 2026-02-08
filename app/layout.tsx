import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Family Hotel | Surrey Vancouver BC",
  description: "Family hotel in Surrey, Vancouver BC, Canada",
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
