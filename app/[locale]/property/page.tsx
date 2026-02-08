import type { Locale } from "@/lib/i18n";
import { locales } from "@/lib/i18n";
import { getProperty, getBookingChannels } from "@/lib/content";
import { PropertyDetail } from "@/components/property-detail";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

interface PropertyPageProps {
  params: Promise<{ locale: string }>;
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { locale } = (await params) as { locale: Locale };
  const [property, channels] = await Promise.all([
    getProperty(locale),
    getBookingChannels(locale),
  ]);
  return (
    <div className="container px-4 py-6 sm:py-8 md:px-6">
      <PropertyDetail property={property} bookingChannels={channels} />
      {property.policies && (
        <section className="mt-8 border-t pt-8" aria-label="Policies">
          <h2 className="text-lg font-semibold">Policies</h2>
          {property.policies.externalUrl ? (
            <a
              href={property.policies.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-primary underline"
            >
              View policies
            </a>
          ) : (
            <div className="mt-2 space-y-2 text-sm">
              {property.policies.checkInOut && (
                <p><strong>Check-in / Check-out:</strong> {property.policies.checkInOut}</p>
              )}
              {property.policies.cancellation && (
                <p><strong>Cancellation:</strong> {property.policies.cancellation}</p>
              )}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
