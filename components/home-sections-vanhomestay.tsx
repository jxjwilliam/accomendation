"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import {
  Bed,
  UtensilsCrossed,
  MapPin,
  Sparkles,
  Wifi,
  Car,
  Flame,
  Wind,
  Tv,
  Leaf,
  Waves,
  Phone,
  Mail,
  Home,
  HelpCircle,
  FileText,
} from "lucide-react";
import type { BookingOption } from "@/lib/channels";
import type { Property } from "@/lib/types";
import type { BookingChannel } from "@/lib/types";
import type { UiStrings } from "@/lib/types";
import { BookingLinks } from "@/components/booking-links";
import { BookingOptions } from "@/components/booking-options";
import { GoogleMap } from "@/components/google-map";
import { BookingCalendarCard } from "@/components/booking-calendar-card";
import { ScrollSpyUpdater } from "@/components/scroll-spy-updater";
import { GetInTouchForm } from "@/components/get-in-touch-form";
import { CONTACT } from "@/lib/contact";

/** Property detail room cards: title + image number (e.g. 5 → /images/image_005.jpg). Vanhomestay-style. */
const PROPERTY_DETAIL_ROOMS: { title: string; imageNum: number }[] = [
  { title: "Master Bedroom", imageNum: 5 },
  { title: "Guest Bedroom 1", imageNum: 7 },
  { title: "Guest Bedroom 2", imageNum: 9 },
  { title: "Living Room", imageNum: 4 },
  { title: "Kitchen", imageNum: 2 },
  { title: "Washroom", imageNum: 12 },
  { title: "Wash Machine", imageNum: 11 },
  { title: "Outdoor", imageNum: 46 },
  { title: "Outside", imageNum: 13 },
  { title: "Picture 1", imageNum: 38 },
  { title: "Picture 2", imageNum: 40 },
  { title: "Picture 3", imageNum: 14 },
];

function getPropertyDetailImagePath(imageNum: number): string {
  return `/images/image_${String(imageNum).padStart(3, "0")}.jpg`;
}

/** Section icons: 1.png = Book Your Stay (bed), 2.png = Get in Touch, 3.png = House Rules. */
const SECTION_ICON_BOOK = "/1.png";
const SECTION_ICON_GET_IN_TOUCH = "/2.png";
const SECTION_ICON_HOUSE_RULES = "/3.png";

gsap.registerPlugin(ScrollTrigger);

const WHY_CHOOSE_ICONS = [Bed, UtensilsCrossed, MapPin, Sparkles] as const;
const AMENITY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "Wi-Fi": Wifi,
  wifi: Wifi,
  parking: Car,
  Parking: Car,
  "Central Heating": Flame,
  heating: Flame,
  "Air Conditioning": Wind,
  "Full Kitchen": UtensilsCrossed,
  Kitchen: UtensilsCrossed,
  "Washer & Dryer": Waves,
  "Smart TV": Tv,
  "Private Garden": Leaf,
  "Family-friendly": Sparkles,
};

function getAmenityIcon(name: string) {
  const key = Object.keys(AMENITY_ICONS).find((k) => name.toLowerCase().includes(k.toLowerCase()));
  return key ? AMENITY_ICONS[key] : Sparkles;
}

interface FaqContent {
  title: string;
  items: { q: string; a: string }[];
}

interface HomeSectionsVanhomestayProps {
  locale: string;
  property: Property;
  channels: BookingChannel[];
  uiStrings: UiStrings;
  mapAddress: string;
  locationText: string;
  faqContent?: FaqContent;
  bookingOptions?: BookingOption[];
}

/**
 * Home page sections styled to match vanhomestay reference.
 * Uses GSAP ScrollTrigger so each section animates in on scroll.
 */
export function HomeSectionsVanhomestay({
  locale,
  property,
  channels,
  uiStrings,
  mapAddress,
  locationText,
  faqContent,
  bookingOptions = [],
}: HomeSectionsVanhomestayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bookIconRef = useRef<HTMLDivElement>(null);
  const getInTouchIconRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const iconFloatRefs = [bookIconRef, getInTouchIconRef];
  useEffect(() => {
    if (reduceMotion) return;
    const tweens = iconFloatRefs
      .map((r) => r.current)
      .filter(Boolean)
      .map((el) =>
        gsap.to(el, {
          y: -6,
          duration: 1.8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        })
      );
    return () => tweens.forEach((t) => t.kill());
  }, [reduceMotion]);

  useEffect(() => {
    if (reduceMotion || !containerRef.current) return;

    // Standard sections: fade-up on scroll
    const sections = containerRef.current.querySelectorAll<HTMLElement>(
      "[data-scroll-section]:not([data-converge-section])"
    );
    sections.forEach((section) => {
      gsap.fromTo(
        section,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            end: "top 55%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    // Convergence sections: header fades up; cards move toward center as you scroll (scroll-scrubbed)
    const convergeSections = containerRef.current.querySelectorAll<HTMLElement>(
      "[data-converge-section]"
    );
    convergeSections.forEach((section) => {
      const content = section.querySelector<HTMLElement>("[class*='max-w-6xl']");
      const header = content?.firstElementChild as HTMLElement | null;
      if (header) {
        gsap.fromTo(
          header,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
              end: "top 70%",
              scrub: 1,
            },
          }
        );
      }
      const cards = section.querySelectorAll<HTMLElement>("[data-converge-card]");
      const cols = section.hasAttribute("data-converge-cols")
        ? parseInt(section.getAttribute("data-converge-cols") ?? "4", 10)
        : 4;
      cards.forEach((card, i) => {
        const col = i % cols;
        const xOffset = (col - (cols - 1) / 2) * 48; // spread: -72,-24,24,72 for cols 0..3
        gsap.fromTo(
          card,
          { opacity: 0, x: xOffset },
          {
            opacity: 1,
            x: 0,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
              end: "top 25%",
              scrub: 1,
            },
          }
        );
      });
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, [reduceMotion]);

  const whyItems = property.whyChooseUs?.length
    ? property.whyChooseUs.slice(0, 4)
    : [
        property.description,
        property.location.addressLine ?? locationText,
        property.amenities[0] ?? "",
        property.amenities[1] ?? "",
      ].filter(Boolean);

  return (
    <div ref={containerRef} className="w-full">
      <ScrollSpyUpdater />
      {/* Why Choose Us - 4 cards with icons (scroll-scrubbed convergence) */}
      {whyItems.length > 0 && (
        <section
          data-scroll-section
          data-converge-section
          className="w-full section-padding bg-white"
          aria-label="Why choose us"
        >
          <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
            <div className="mb-12 text-center">
              <div className="flex flex-wrap items-center justify-center gap-3">
                <div className="flex size-28 shrink-0 items-center justify-center text-primary">
                  <Sparkles className="size-14" />
                </div>
                <h2 className="section-title text-primary">{uiStrings.sections.whyChooseUs}</h2>
                <div className="section-title-underline mt-2 w-full basis-full" aria-hidden />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {whyItems.slice(0, 4).map((item, i) => {
                const Icon = WHY_CHOOSE_ICONS[i % WHY_CHOOSE_ICONS.length];
                return (
                  <div
                    key={item}
                    data-converge-card
                    className="card-hover rounded-xl border border-border bg-linear-to-br from-white to-orange-50/70 p-8 text-center"
                  >
                    <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <p className="text-base font-medium leading-relaxed text-foreground">{item}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Amenities - grid with icons (scroll-scrubbed convergence) */}
      <section
        data-scroll-section
        data-converge-section
        className="w-full section-padding bg-linear-to-br from-orange-50/50 to-white"
        aria-label="Amenities"
      >
        <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
          <div className="mb-12 text-center">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <div className="flex size-28 shrink-0 items-center justify-center text-primary">
                <Home className="size-14" />
              </div>
              <h2 className="section-title text-primary">{uiStrings.sections.amenities}</h2>
              <div className="section-title-underline mt-2 w-full basis-full" aria-hidden />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {property.amenities.map((name, i) => {
              const Icon = getAmenityIcon(name);
              return (
                <div
                  key={name}
                  data-converge-card
                  className="card-hover flex flex-col items-center justify-center rounded-xl border border-border bg-white p-6 transition-all hover:border-primary"
                >
                  <Icon className="mb-3 h-10 w-10 text-primary" />
                  <p className="text-center text-sm font-medium text-foreground">{name}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Property details + House rules */}
      <section
        id="property-details"
        data-scroll-section
        className="w-full section-padding bg-white scroll-mt-20"
        aria-label={uiStrings.propertyDetailsTitle}
      >
        <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
          <div className="mb-12 text-center">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <div className="flex size-28 shrink-0 items-center justify-center text-primary">
                <FileText className="size-14" />
              </div>
              <h2 className="section-title text-primary">{uiStrings.propertyDetailsTitle}</h2>
              <div className="section-title-underline mt-2 w-full basis-full" aria-hidden />
            </div>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              {property.description}
            </p>
          </div>

          <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {(property.propertyDetailRooms ?? PROPERTY_DETAIL_ROOMS).map((room) => {
              const src = getPropertyDetailImagePath(room.imageNum);
              return (
                <div
                  key={room.imageNum}
                  className="card-hover overflow-hidden rounded-xl border border-border bg-white shadow-lg transition-transform duration-300 hover:shadow-xl"
                >
                  <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
                    <Image
                      src={src}
                      alt={room.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground">{room.title}</h3>
                  </div>
                </div>
              );
            })}
          </div>

          {/* House Rules panel - structured rules + FAQ (vanhomestay reference) */}
          {(property.houseRulesItems?.length || property.houseRules || property.policies || faqContent?.items?.length) && (
            <div className="rounded-2xl border border-border bg-linear-to-br from-orange-50/70 to-white p-8">
              <div className="mb-6 text-center">
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <div className="relative size-28 shrink-0 overflow-hidden rounded-xl p-0 m-0">
                    <Image
                      src={SECTION_ICON_HOUSE_RULES}
                      alt=""
                      fill
                      className="object-cover object-center"
                      sizes="112px"
                    />
                  </div>
                  <h3 className="section-title text-primary">{uiStrings.sections.houseRules}</h3>
                  <div className="section-title-underline mt-2 w-full basis-full" aria-hidden />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {property.houseRulesItems?.length
                  ? property.houseRulesItems.map((item) => (
                      <div key={item.title} className="flex gap-3">
                        <div className="mt-1 h-6 w-6 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                          <div className="h-2 w-2 rounded-full bg-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">{item.title}</h4>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                    ))
                  : (
                    <>
                      {property.policies?.checkInOut && (
                        <div className="flex gap-3">
                          <div className="mt-1 h-6 w-6 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                            <div className="h-2 w-2 rounded-full bg-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground">{uiStrings.modals.checkInOut}</h4>
                            <p className="text-sm text-muted-foreground">
                              {property.policies.checkInOut}
                            </p>
                          </div>
                        </div>
                      )}
                      {property.policies?.cancellation && (
                        <div className="flex gap-3">
                          <div className="mt-1 h-6 w-6 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                            <div className="h-2 w-2 rounded-full bg-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground">{uiStrings.modals.cancellation}</h4>
                            <p className="text-sm text-muted-foreground">
                              {property.policies.cancellation}
                            </p>
                          </div>
                        </div>
                      )}
                      {property.houseRules &&
                        (Array.isArray(property.houseRules) ? (
                          property.houseRules.map((rule) => (
                            <div key={rule} className="flex gap-3">
                              <div className="mt-1 h-6 w-6 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                                <div className="h-2 w-2 rounded-full bg-primary" />
                              </div>
                              <p className="text-sm text-muted-foreground">{rule}</p>
                            </div>
                          ))
                        ) : (
                          <div className="flex gap-3 md:col-span-2">
                            <div className="mt-1 h-6 w-6 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                              <div className="h-2 w-2 rounded-full bg-primary" />
                            </div>
                            <p className="text-sm text-muted-foreground">{property.houseRules}</p>
                          </div>
                        ))}
                    </>
                  )}
                {property.policies?.externalUrl && (
                  <div className="md:col-span-2">
                    <a
                      href={property.policies.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary font-medium underline underline-offset-4 hover:no-underline"
                    >
                      {uiStrings.sections.viewFullPolicies}
                    </a>
                  </div>
                )}
              </div>

              {faqContent?.items?.length ? (
                <div className="mt-8 pt-8 border-t border-border">
                  <div className="mb-6 text-center">
                    <div className="flex flex-wrap items-center justify-center gap-3">
                      <div className="flex size-28 shrink-0 items-center justify-center text-primary">
                        <HelpCircle className="size-14" />
                      </div>
                      <h4 className="section-title text-primary">{faqContent.title}</h4>
                      <div className="section-title-underline mt-2 w-full basis-full" aria-hidden />
                    </div>
                  </div>
                  <dl className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-x-8 md:gap-y-4">
                    {faqContent.items.map((item, i) => (
                      <div key={i} className="space-y-1">
                        <dt className="font-medium text-foreground">{item.q}</dt>
                        <dd className="text-sm text-muted-foreground">{item.a}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </section>

      {/* Book Your Stay - CTA to Airbnb (icon inline with title, GSAP float) */}
      <section
        id="book-your-stay"
        data-scroll-section
        className={`w-full section-padding bg-white scroll-mt-20 ${locale === "en" ? "book-your-stay-section" : ""}`}
        aria-label="Book your stay"
      >
        <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
          <div className="mb-12 text-center">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <div
                ref={bookIconRef}
                className="relative size-28 shrink-0 overflow-hidden rounded-xl p-0 m-0"
              >
                <Image
                  src={SECTION_ICON_BOOK}
                  alt=""
                  fill
                  className="object-cover object-center"
                  sizes="112px"
                />
              </div>
              <h2 className="section-title text-primary">{uiStrings.sections.bookYourStay}</h2>
              <div className="section-title-underline mt-2 w-full basis-full" aria-hidden />
            </div>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              {uiStrings.sections.bookYourStaySubtitle}
            </p>
          </div>
          <div className="mx-auto max-w-4xl">
            <BookingOptions options={bookingOptions} uiStrings={uiStrings} />
          </div>
        </div>
      </section>

      {/* Get in Touch - map (larger) + contact info & form (convergence, icon inline) */}
      <section
        id="get-in-touch"
        data-scroll-section
        data-converge-section
        data-converge-cols="2"
        className="w-full section-padding bg-white scroll-mt-20"
        aria-label={uiStrings.sections.getInTouch}
      >
        <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
          <div className="mb-10 text-center">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <div
                ref={getInTouchIconRef}
                className="relative size-28 shrink-0 overflow-hidden rounded-xl p-0 m-0"
              >
                <Image
                  src={SECTION_ICON_GET_IN_TOUCH}
                  alt=""
                  fill
                  className="object-cover object-center"
                  sizes="112px"
                />
              </div>
              <h2 className="section-title text-primary">{uiStrings.sections.getInTouch}</h2>
              <div className="section-title-underline mt-2 w-full basis-full" aria-hidden />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Left: Map (larger) */}
            <div data-converge-card className="order-2 lg:order-1">
              <GoogleMap
                address={mapAddress}
                className="h-[380px] min-h-[300px] w-full sm:h-[440px] lg:h-[520px] rounded-xl overflow-hidden border border-border shadow-lg"
                title="Manna Family Hotel location map"
              />
            </div>

            {/* Right: Contact info + form (same side) */}
            <div data-converge-card className="order-1 flex flex-col gap-6 lg:order-2">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <MapPin className="h-5 w-5 shrink-0 text-primary" aria-hidden />
                  <div>
                    <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                      {uiStrings.sections.address}
                    </h3>
                    <p className="text-foreground">
                      {property.location.addressLine ?? locationText}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Phone className="h-5 w-5 shrink-0 text-primary" aria-hidden />
                  <div>
                    <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                      {uiStrings.sections.phone}
                    </h3>
                    <a
                      href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
                      className="inline-flex min-h-11 items-center text-foreground underline-offset-4 hover:text-primary hover:underline"
                    >
                      {CONTACT.phone}
                    </a>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Mail className="h-5 w-5 shrink-0 text-primary" aria-hidden />
                  <div>
                    <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                      {uiStrings.sections.email}
                    </h3>
                    <a
                      href={`mailto:${CONTACT.email}`}
                      className="inline-flex min-h-11 items-center text-foreground underline-offset-4 hover:text-primary hover:underline"
                    >
                      {CONTACT.email}
                    </a>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-border bg-linear-to-br from-orange-50/30 to-white p-6 md:p-8">
                <h3 className="mb-4 text-lg font-semibold text-foreground">{uiStrings.sections.sendMessage}</h3>
                <GetInTouchForm uiStrings={uiStrings} />
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
