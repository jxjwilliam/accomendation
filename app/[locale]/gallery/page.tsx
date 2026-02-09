import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { locales } from "@/lib/i18n";
import { getDefaultTitle, getBaseUrl } from "@/lib/seo";
import { getUiStrings } from "@/lib/content";
import { GalleryPageClient } from "@/components/gallery-page-client";

interface GalleryPageProps {
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: GalleryPageProps): Promise<Metadata> {
  const { locale } = await params;
  const loc = locale as Locale;
  const baseUrl = getBaseUrl();
  return {
    title: `Gallery | ${getDefaultTitle(loc)}`,
    alternates: { canonical: `${baseUrl}/${locale}/gallery` },
  };
}

export default async function GalleryPage({ params }: GalleryPageProps) {
  const { locale } = (await params) as { locale: Locale };
  const uiStrings = await getUiStrings(locale);
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <GalleryPageClient locale={locale} galleryStrings={uiStrings.gallery} />
    </div>
  );
}
