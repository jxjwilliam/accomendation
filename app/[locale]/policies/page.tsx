import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { locales } from "@/lib/i18n";
import { getProperty } from "@/lib/content";
import { getDefaultTitle, getDefaultDescription, getBaseUrl } from "@/lib/seo";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

interface PoliciesPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PoliciesPageProps): Promise<Metadata> {
  const { locale } = await params;
  const loc = locale as Locale;
  const baseUrl = getBaseUrl();
  const canonical = `${baseUrl}/${locale}/policies`;
  return {
    title: getDefaultTitle(loc, "policies"),
    description: getDefaultDescription(loc, "policies"),
    alternates: { canonical },
    openGraph: { url: canonical },
  };
}

export default async function PoliciesPage({ params }: PoliciesPageProps) {
  const { locale } = (await params) as { locale: Locale };
  const property = await getProperty(locale);
  const policies = property.policies;
  return (
    <div className="container w-full max-w-5xl px-4 py-6 sm:py-8 md:px-6">
      <h1 className="text-2xl font-bold leading-tight sm:text-3xl">Policies</h1>
      {policies?.externalUrl ? (
        <a
          href={policies.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-primary underline"
        >
          View full policies
        </a>
      ) : policies ? (
        <div className="mt-4 space-y-4 text-base leading-relaxed">
          {policies.checkInOut && (
            <section>
              <h2 className="font-semibold">Check-in & Check-out</h2>
              <p className="mt-1">{policies.checkInOut}</p>
            </section>
          )}
          {policies.cancellation && (
            <section>
              <h2 className="font-semibold">Cancellation</h2>
              <p className="mt-1">{policies.cancellation}</p>
            </section>
          )}
        </div>
      ) : (
        <p className="mt-4 text-muted-foreground">No policies listed.</p>
      )}
    </div>
  );
}
