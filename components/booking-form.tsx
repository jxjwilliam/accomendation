"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getUnavailableDates } from "@/lib/unavailable-dates";
import type { DateRange } from "react-day-picker";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const GUEST_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8] as const;

/**
 * Vanhomestay-style booking form: Guest Information, Booking Dates, Number of Guests, Complete Booking.
 * Submit shows success state; optional mailto fallback for sending request.
 */
export function BookingForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [guests, setGuests] = useState<number>(1);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [unavailableSet, setUnavailableSet] = useState<Set<number>>(new Set());

  useEffect(() => {
    getUnavailableDates().then(setUnavailableSet);
  }, []);

  const isDateDisabled = (date: Date) => {
    const t = new Date(date);
    t.setHours(0, 0, 0, 0);
    return unavailableSet.has(t.getTime());
  };

  const checkInStr = dateRange?.from
    ? dateRange.from.toLocaleDateString("en-CA", { year: "numeric", month: "2-digit", day: "2-digit" })
    : "";
  const checkOutStr = dateRange?.to
    ? dateRange.to.toLocaleDateString("en-CA", { year: "numeric", month: "2-digit", day: "2-digit" })
    : "";

  const getMailtoLink = () => {
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : "",
      `Check-in: ${checkInStr || "Not selected"}`,
      `Check-out: ${checkOutStr || "Not selected"}`,
      `Guests: ${guests}`,
      message ? `Message: ${message}` : "",
    ]
      .filter(Boolean)
      .join("\n");
    return `mailto:?subject=Booking request - ${encodeURIComponent(name || "Guest")}&body=${encodeURIComponent(body)}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-xl border border-border bg-linear-to-br from-white to-orange-50/50 p-8 text-center shadow-sm">
        <h3 className="text-xl font-semibold text-foreground">Request received</h3>
        <p className="mt-2 text-muted-foreground">
          Thank you. We&apos;ll respond to your booking request shortly.
        </p>
        <Button
          variant="outline"
          className="mt-4"
          asChild
        >
          <a href={getMailtoLink()}>Send details by email</a>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Guest Information */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-foreground">Guest Information</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="booking-name" className="mb-1 block text-sm font-medium text-foreground">
              Name <span className="text-destructive">*</span>
            </label>
            <input
              id="booking-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Your name"
            />
          </div>
          <div>
            <label htmlFor="booking-email" className="mb-1 block text-sm font-medium text-foreground">
              Email <span className="text-destructive">*</span>
            </label>
            <input
              id="booking-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="your@email.com"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="booking-phone" className="mb-1 block text-sm font-medium text-foreground">
              Phone
            </label>
            <input
              id="booking-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="+1 (604) 306-5018"
            />
          </div>
        </div>
      </div>

      {/* Booking Dates */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-foreground">Booking Dates</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Check-in Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateRange?.from && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 size-4" />
                  {dateRange?.from ? dateRange.from.toLocaleDateString() : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  disabled={isDateDisabled}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Check-out Date</label>
            <div className="flex min-h-10 w-full items-center rounded-md border border-input bg-background px-3 py-2 text-sm">
              {dateRange?.to ? dateRange.to.toLocaleDateString() : dateRange?.from ? "Select end date" : "—"}
            </div>
          </div>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Select your dates in the calendar. Reserved dates are disabled.
        </p>
      </div>

      {/* Number of Guests */}
      <div>
        <label htmlFor="booking-guests" className="mb-1 block text-sm font-medium text-foreground">
          Number of Guests
        </label>
        <select
          id="booking-guests"
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {GUEST_OPTIONS.map((n) => (
            <option key={n} value={n}>
              {n} Guest{n !== 1 ? "s" : ""}
            </option>
          ))}
        </select>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="booking-message" className="mb-1 block text-sm font-medium text-foreground">
          Message (optional)
        </label>
        <textarea
          id="booking-message"
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Special requests or questions..."
        />
      </div>

      <Button type="submit" size="lg" className="w-full sm:w-auto">
        Complete Booking
      </Button>
    </form>
  );
}
