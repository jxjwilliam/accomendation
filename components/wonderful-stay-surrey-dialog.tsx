"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookingLinks } from "@/components/booking-links";
import { BookingCalendarCard } from "@/components/booking-calendar-card";
import type { Property } from "@/lib/types";
import type { BookingChannel } from "@/lib/types";
import type { UiStrings } from "@/lib/types";

interface WonderfulStaySurreyDialogProps {
  property: Property;
  channels: BookingChannel[];
  triggerLabel: string;
  uiStrings: UiStrings;
}

/**
 * Dialog that shows the "Manna Family Hotel Surrey" content:
 * property name, tagline, type, address, booking links, and calendar card.
 * Trigger is rendered by the parent; open state is controlled via render props or internal state.
 */
export function WonderfulStaySurreyDialog({
  property,
  channels,
  triggerLabel,
  uiStrings,
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
          <div className="flex items-start justify-between gap-4">
            <DialogHeader>
              <DialogTitle className="text-2xl">{property.name}</DialogTitle>
            </DialogHeader>
            <DialogClose asChild>
              <button
                type="button"
                className="flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </DialogClose>
          </div>
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
              {uiStrings.modals.propertyTagline}
            </p>
            <p className="text-lg leading-relaxed text-muted-foreground">
              {property.typeOfAccommodation}
            </p>
            <p className="font-medium leading-normal">
              {property.location.addressLine ??
                `${property.location.city}, ${property.location.region}, ${property.location.country}`}
            </p>

            <section aria-label={uiStrings.modals.bookingAndContact}>
              <BookingLinks channels={channels} />
            </section>
            <div>
              <BookingCalendarCard uiStrings={uiStrings} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
