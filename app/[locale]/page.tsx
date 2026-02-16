import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { getProperty, getBookingChannels, getUiStrings, getFaqContent } from "@/lib/content";
import { getBookingOptions } from "@/lib/channels";
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
  const [property, channels, uiStrings, faqContent] = await Promise.all([
    getProperty(locale),
    getBookingChannels(locale),
    getUiStrings(locale),
    Promise.resolve(getFaqContent(locale)),
  ]);
  const bookingOptions = await getBookingOptions(uiStrings);
  const locationText = `${property.location.city}, ${property.location.region}, ${property.location.country}`;
  const mapAddress = property.location.addressLine ?? locationText;
  const heroImages = HERO_IMAGE_PATHS;

  return (
    <>
      <Hero
        title={property.name}
        subtitle={property.heroSubtitle ?? property.typeOfAccommodation}
        roomOptions={uiStrings.hero.roomOptions}
        roomOptionsStructured={
          uiStrings.hero.roomOptionsLead || uiStrings.hero.roomConfigs?.length
            ? {
                lead: uiStrings.hero.roomOptionsLead,
                headline: uiStrings.hero.roomOptionsHeadline,
                configs: uiStrings.hero.roomConfigs,
                suffix: uiStrings.hero.roomOptionsSuffix,
              }
            : undefined
        }
        images={heroImages}
        ctaLabel={uiStrings.hero.ctaLabel}
        locale={locale}
      />
      <div className="w-full">
        <HomeSectionsVanhomestay
          locale={locale}
          property={property}
          channels={channels}
          uiStrings={uiStrings}
          mapAddress={mapAddress}
          locationText={locationText}
          faqContent={faqContent}
          bookingOptions={bookingOptions}
        />
      </div>
    </>
  );
}
