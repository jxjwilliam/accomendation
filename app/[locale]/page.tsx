import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { getProperty, getBookingChannels, getUiStrings } from "@/lib/content";
import { getDefaultTitle, getDefaultDescription, getBaseUrl } from "@/lib/seo";
import { HERO_IMAGE_PATHS } from "@/lib/gallery-images";
import { Hero } from "@/components/hero";
import { HomeSectionsVanhomestay } from "@/components/home-sections-vanhomestay";

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
  const [property, channels, uiStrings] = await Promise.all([
    getProperty(locale),
    getBookingChannels(locale),
    getUiStrings(locale),
  ]);
  const locationText = `${property.location.city}, ${property.location.region}, ${property.location.country}`;
  const mapAddress = property.location.addressLine ?? locationText;
  const heroImages = HERO_IMAGE_PATHS;

  return (
    <>
      <Hero
        title={property.name}
        subtitle={property.heroSubtitle ?? property.typeOfAccommodation}
        images={heroImages}
        ctaLabel={uiStrings.hero.ctaLabel}
        locale={locale}
      />
      <div className="mx-auto w-full px-4 py-6 sm:px-6 sm:py-8">
        <HomeSectionsVanhomestay
          locale={locale}
          property={property}
          channels={channels}
          uiStrings={uiStrings}
          mapAddress={mapAddress}
          locationText={locationText}
        />
      </div>
    </>
  );
}
