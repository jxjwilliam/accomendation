"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BookingLinks } from "@/components/booking-links";
import { BookingCalendarCard } from "@/components/booking-calendar-card";
import type { Property } from "@/lib/types";
import type { BookingChannel } from "@/lib/types";

/** Decorative images for the popup (from public folder). */
const POPUP_IMAGES = ["/1.png", "/2.png", "/3.png"] as const;

interface WonderfulStaySurreyDialogProps {
  property: Property;
  channels: BookingChannel[];
  triggerLabel: string;
}

/**
 * Dialog that shows the "Wonderful Family Stay Surrey" content:
 * property name, tagline, type, address, booking links, and calendar card.
 * Trigger is rendered by the parent; open state is controlled via render props or internal state.
 */
export function WonderfulStaySurreyDialog({
  property,
  channels,
  triggerLabel,
}: WonderfulStaySurreyDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="lg"
        onClick={() => setOpen(true)}
        className="min-h-12 rounded-xl border-2 border-primary/50 bg-primary/5 px-8 py-6 text-base font-semibold text-primary hover:bg-primary/10 hover:border-primary"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        {triggerLabel}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{property.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
              Our property — your home away from home in Surrey, BC.
            </p>
            <p className="text-lg leading-relaxed text-muted-foreground">
              {property.typeOfAccommodation}
            </p>
            <p className="font-medium leading-normal">
              {property.location.addressLine ??
                `${property.location.city}, ${property.location.region}, ${property.location.country}`}
            </p>

            {/* Decorative strip using public 1.png, 2.png, 3.png */}
            <div className="flex gap-3 overflow-hidden rounded-xl border border-border bg-muted/30 p-2">
              {POPUP_IMAGES.map((src, i) => (
                <div
                  key={src}
                  className="relative h-24 min-w-[120px] flex-1 overflow-hidden rounded-lg bg-muted"
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="120px"
                  />
                </div>
              ))}
            </div>

            <section aria-label="Booking and contact">
              <BookingLinks channels={channels} />
            </section>
            <div>
              <BookingCalendarCard />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
