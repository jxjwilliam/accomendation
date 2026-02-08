import type { Metadata } from "next";
import { Header } from "@/components/header";
import type { Locale } from "@/lib/i18n";
import { locales } from "@/lib/i18n";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const titles: Record<string, string> = {
    en: "Family Hotel | Surrey Vancouver BC",
    fr: "Hôtel familial | Surrey Vancouver BC",
    "zh-Hans": "家庭旅馆 | 素里 温哥华 BC",
    "zh-Hant": "家庭旅館 | 素里 溫哥華 BC",
  };
  const descriptions: Record<string, string> = {
    en: "Family hotel in Surrey, Vancouver BC, Canada. Book or contact us.",
    fr: "Hôtel familial à Surrey, Vancouver BC, Canada. Réservez ou contactez-nous.",
    "zh-Hans": "加拿大 BC 省温哥华素里家庭旅馆。预订或联系我们。",
    "zh-Hant": "加拿大 BC 省溫哥華素里家庭旅館。預訂或聯絡我們。",
  };
  return {
    title: titles[locale] ?? titles.en,
    description: descriptions[locale] ?? descriptions.en,
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
  return (
    <>
      <Header currentLocale={locale} />
      <main className="min-h-screen">{children}</main>
    </>
  );
}
