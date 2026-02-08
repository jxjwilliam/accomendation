import type { Locale } from "@/lib/i18n";
import { locales } from "@/lib/i18n";
import { getProperty } from "@/lib/content";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

interface PoliciesPageProps {
  params: Promise<{ locale: string }>;
}

export default async function PoliciesPage({ params }: PoliciesPageProps) {
  const { locale } = (await params) as { locale: Locale };
  const property = await getProperty(locale);
  const policies = property.policies;
  return (
    <div className="container px-4 py-6 sm:py-8 md:px-6">
      <h1 className="text-2xl font-bold">Policies</h1>
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
        <div className="mt-4 space-y-4 text-base">
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
