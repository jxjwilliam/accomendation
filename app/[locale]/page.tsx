import type { Locale } from "@/lib/i18n";
import { getProperty, getBookingChannels } from "@/lib/content";
import { BookingLinks } from "@/components/booking-links";
import { GoogleMap } from "@/components/google-map";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = (await params) as { locale: Locale };
  const [property, channels] = await Promise.all([
    getProperty(locale),
    getBookingChannels(locale),
  ]);
  const locationText = `${property.location.city}, ${property.location.region}, ${property.location.country}`;
  const mapAddress = property.location.addressLine ?? locationText;
  return (
    <div className="container px-4 py-6 sm:py-8 md:px-6">
      <section className="rounded-lg border bg-muted/30 p-6" aria-label="Welcome">
        <h1 className="text-2xl font-bold sm:text-3xl">{property.name}</h1>
        <p className="mt-2 text-lg text-muted-foreground">{property.typeOfAccommodation}</p>
        <p className="mt-1 font-medium" id="location-block">
          {property.location.addressLine ?? locationText}
        </p>
        <section className="mt-4" aria-label="Booking and contact">
          <BookingLinks channels={channels} />
        </section>
      </section>
      <section className="mt-6" aria-label="Location">
        <h2 className="text-lg font-semibold">Location</h2>
        <p className="mt-1">{property.location.addressLine ?? locationText}</p>
        <GoogleMap address={mapAddress} className="mt-4" title="Family Hotel location map" />
      </section>
      <p className="mt-6 text-base">{property.description}</p>
      <ul className="mt-4 list-disc pl-6">
        {property.amenities.map((a) => (
          <li key={a}>{a}</li>
        ))}
      </ul>
    </div>
  );
}
