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
} from "lucide-react";
import type { Property } from "@/lib/types";
import type { BookingChannel } from "@/lib/types";
import type { UiStrings } from "@/lib/types";
import { BookingLinks } from "@/components/booking-links";
import { GoogleMap } from "@/components/google-map";
import { BookingForm } from "@/components/booking-form";
import { BookingCalendarCard } from "@/components/booking-calendar-card";
import { ScrollSpyUpdater } from "@/components/scroll-spy-updater";

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

interface HomeSectionsVanhomestayProps {
  locale: string;
  property: Property;
  channels: BookingChannel[];
  uiStrings: UiStrings;
  mapAddress: string;
  locationText: string;
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
}: HomeSectionsVanhomestayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion || !containerRef.current) return;
    const sections = containerRef.current.querySelectorAll<HTMLElement>("[data-scroll-section]");
    sections.forEach((section, i) => {
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
    <div ref={containerRef} className="mx-auto w-full max-w-6xl">
      <ScrollSpyUpdater />
      {/* Welcome + Booking */}
      <section
        data-scroll-section
        className="section-padding bg-white"
        aria-label="Welcome"
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="rounded-xl border border-border bg-linear-to-br from-white to-orange-50/50 p-6 shadow-sm md:p-8">
            <h2 className="text-2xl font-bold leading-tight text-foreground sm:text-3xl">
              {property.name}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Our property — your home away from home in Surrey, BC.
            </p>
            <p className="mt-2 text-lg leading-relaxed text-muted-foreground">
              {property.typeOfAccommodation}
            </p>
            <p className="mt-1 font-medium leading-normal" id="location-block">
              {property.location.addressLine ?? locationText}
            </p>
            <section id="booking" className="mt-6" aria-label="Booking and contact">
              <BookingLinks channels={channels} />
            </section>
            <div className="mt-6">
              <BookingCalendarCard />
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us - 4 cards with icons */}
      {whyItems.length > 0 && (
        <section
          data-scroll-section
          className="section-padding bg-white"
          aria-label="Why choose us"
        >
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-12 text-center">
              <h2 className="section-title text-primary">Why Choose Us</h2>
              <div className="section-title-underline mt-2" aria-hidden />
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {whyItems.slice(0, 4).map((item, i) => {
                const Icon = WHY_CHOOSE_ICONS[i % WHY_CHOOSE_ICONS.length];
                return (
                  <div
                    key={item}
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

      {/* Amenities - grid with icons */}
      <section
        data-scroll-section
        className="section-padding bg-linear-to-br from-orange-50/50 to-white"
        aria-label="Amenities"
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-12 text-center">
            <h2 className="section-title text-primary">Amenities</h2>
            <div className="section-title-underline mt-2" aria-hidden />
          </div>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {property.amenities.map((name) => {
              const Icon = getAmenityIcon(name);
              return (
                <div
                  key={name}
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
        className="section-padding bg-white scroll-mt-20"
        aria-label="Property details"
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-12 text-center">
            <h2 className="section-title text-primary">Property Details</h2>
            <div className="section-title-underline mt-2" aria-hidden />
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              {property.description}
            </p>
          </div>

          <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {PROPERTY_DETAIL_ROOMS.map((room) => {
              const src = getPropertyDetailImagePath(room.imageNum);
              return (
                <div
                  key={room.title}
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

          {/* House Rules panel - reference style */}
          {(property.houseRules || property.policies) && (
            <div className="rounded-2xl border border-border bg-linear-to-br from-orange-50/70 to-white p-8">
              <h3 className="mb-6 text-2xl font-bold text-foreground">House Rules</h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {property.policies?.checkInOut && (
                  <div className="flex gap-3">
                    <div className="mt-1 h-6 w-6 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Check-in & Check-out</h4>
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
                      <h4 className="font-semibold text-foreground">Cancellation</h4>
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
                {property.policies?.externalUrl && (
                  <div className="md:col-span-2">
                    <a
                      href={property.policies.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary font-medium underline underline-offset-4 hover:no-underline"
                    >
                      View full policies
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Contact / Book */}
      <section
        id="contact"
        data-scroll-section
        className="section-padding bg-white scroll-mt-20"
        aria-label="Contact and booking"
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-12 text-center">
            <h2 className="section-title text-primary">Book Your Stay</h2>
            <div className="section-title-underline mt-2" aria-hidden />
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Enter your details and dates below, then click Complete Booking. We&apos;ll confirm your request shortly.
            </p>
          </div>
          <div className="mx-auto max-w-2xl rounded-xl border border-border bg-white p-6 shadow-sm md:p-8">
            <BookingForm />
            <div className="mt-8 border-t border-border pt-6">
              <p className="mb-2 text-sm font-medium text-foreground">Or book via</p>
              <BookingLinks channels={channels} />
            </div>
          </div>
        </div>
      </section>

      {/* Location */}
      <section
        data-scroll-section
        className="section-padding bg-white"
        aria-label="Location"
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-8 text-center">
            <h2 className="section-title text-primary">Location</h2>
            <div className="section-title-underline mt-2" aria-hidden />
          </div>
          <p className="text-center text-muted-foreground">
            {property.location.addressLine ?? locationText}
          </p>
          <GoogleMap
            address={mapAddress}
            className="mt-6 rounded-xl overflow-hidden border border-border shadow-lg"
            title="Wonderful Family Stay location map"
          />
        </div>
      </section>

      {/* Footer-style description block */}
      <section data-scroll-section className="section-padding bg-muted/30">
        <div className="container mx-auto max-w-[75ch] px-4 md:px-6">
          <p className="text-base leading-relaxed text-foreground">{property.description}</p>
        </div>
      </section>
    </div>
  );
}
