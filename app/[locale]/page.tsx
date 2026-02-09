import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { getProperty, getBookingChannels } from "@/lib/content";
import { getDefaultTitle, getDefaultDescription, getBaseUrl } from "@/lib/seo";
import { HERO_IMAGE_PATHS } from "@/lib/gallery-images";
import { BookingLinks } from "@/components/booking-links";
import { GoogleMap } from "@/components/google-map";
import { Gallery } from "@/components/gallery";
import { BookingCalendarCard } from "@/components/booking-calendar-card";
import { Hero } from "@/components/hero";
import { ScrollAnimationWrapper } from "@/components/scroll-animation-wrapper";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const loc = locale as Locale;
  const baseUrl = getBaseUrl();
  const canonical = `${baseUrl}/${locale}`;
  return {
    title: getDefaultTitle(loc),
    description: getDefaultDescription(loc),
    alternates: { canonical },
    openGraph: { url: canonical },
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = (await params) as { locale: Locale };
  const [property, channels] = await Promise.all([
    getProperty(locale),
    getBookingChannels(locale),
  ]);
  const locationText = `${property.location.city}, ${property.location.region}, ${property.location.country}`;
  const mapAddress = property.location.addressLine ?? locationText;
  const heroImages = HERO_IMAGE_PATHS;

  return (
    <>
      <Hero
        title={property.name}
        subtitle={property.typeOfAccommodation}
        images={heroImages}
        ctaLabel="Book Now"
        locale={locale}
      />
      <ScrollAnimationWrapper animationType="fade-up" stagger={0.1} once className="container w-full max-w-5xl px-4 py-6 sm:py-8 md:px-6">
        <section
          className="rounded-lg border bg-muted/30 p-6"
          aria-label="Welcome"
          data-scroll-animate="fade-up"
        >
          <h2 className="text-2xl font-bold leading-tight sm:text-3xl">{property.name}</h2>
          <p className="mt-2 text-lg leading-relaxed text-muted-foreground">{property.typeOfAccommodation}</p>
          <p className="mt-1 font-medium leading-normal" id="location-block">
            {property.location.addressLine ?? locationText}
          </p>
          <section id="booking" className="mt-4" aria-label="Booking and contact">
            <BookingLinks channels={channels} />
          </section>
          <div className="mt-6">
            <BookingCalendarCard />
          </div>
        </section>
        <section
          className="mt-8"
          aria-label="Gallery"
          data-scroll-animate="fade-up"
        >
          <Gallery locale={locale} />
        </section>
        <section
          className="mt-8"
          aria-label="Location"
          data-scroll-animate="fade-up"
        >
          <h2 className="text-lg font-semibold leading-tight">Location</h2>
          <p className="mt-1">{property.location.addressLine ?? locationText}</p>
          <GoogleMap address={mapAddress} className="mt-4" title="Family Hotel location map" />
        </section>
        <div data-scroll-animate="fade-up">
          <p className="mt-6 text-base leading-relaxed">{property.description}</p>
          <ul className="mt-4 list-disc space-y-1 pl-6 text-base leading-relaxed">
            {property.amenities.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </div>
      </ScrollAnimationWrapper>
    </>
  );
}
