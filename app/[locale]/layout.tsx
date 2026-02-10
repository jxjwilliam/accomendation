import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { JsonLdLodging } from "@/components/json-ld-lodging";
import { ScrollSpyProvider } from "@/lib/scroll-spy-context";
import { LayoutClient } from "@/components/layout-client";
import type { Locale } from "@/lib/i18n";
import { locales } from "@/lib/i18n";
import { getDefaultTitle, getDefaultDescription, getBaseUrl, getOgImageUrl } from "@/lib/seo";
import { getUiStrings } from "@/lib/content";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc = locale as Locale;
  const baseUrl = getBaseUrl();
  const title = getDefaultTitle(loc);
  const description = getDefaultDescription(loc);
  const ogImageUrl = getOgImageUrl();

  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[l] = `${baseUrl}/${l}`;
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: baseUrl,
      siteName: "Manna Family Hotel Surrey",
      locale: locale,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: "Manna Family Hotel Surrey" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
    alternates: {
      languages,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = (await params) as { locale: Locale };
  const uiStrings = await getUiStrings(locale);
  return (
    <div className="flex min-h-screen flex-col">
      <JsonLdLodging locale={locale} />
      <ScrollSpyProvider>
        <LayoutClient locale={locale} uiStrings={uiStrings}>
          {children}
        </LayoutClient>
        <Footer locale={locale} />
      </ScrollSpyProvider>
    </div>
  );
}
