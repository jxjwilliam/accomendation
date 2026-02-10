import type { Metadata } from "next";
import "./globals.css";
import { getDefaultTitle, getDefaultDescription } from "@/lib/seo";
import { defaultLocale } from "@/lib/i18n";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: getDefaultTitle(defaultLocale),
  description: getDefaultDescription(defaultLocale),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={defaultLocale} suppressHydrationWarning>
      <body className="antialiased min-h-screen" suppressHydrationWarning>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
