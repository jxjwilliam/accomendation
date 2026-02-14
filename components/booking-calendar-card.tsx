"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getUnavailableDates } from "@/lib/unavailable-dates";
import type { DateRange } from "react-day-picker";
import type { UiStrings } from "@/lib/types";

interface BookingCalendarCardProps {
  uiStrings: UiStrings;
}

/**
 * Booking Calendar Card: glassmorphism, date-range picker, "Reserved" tooltip on unavailable dates.
 * Framer Motion entrance (y 20px, 0.4s); CAD; mobile-optimized. Vancouver/Surrey BC context.
 */
export function BookingCalendarCard({ uiStrings }: BookingCalendarCardProps) {
  const [range, setRange] = useState<DateRange | undefined>(undefined);
  const [unavailableSet, setUnavailableSet] = useState<Set<number>>(new Set());
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    getUnavailableDates().then(setUnavailableSet);
  }, []);

  const isDateDisabled = useMemo(() => {
    return (date: Date) => {
      const t = new Date(date);
      t.setHours(0, 0, 0, 0);
      return unavailableSet.has(t.getTime());
    };
  }, [unavailableSet]);

  const DayButtonWithReservedTooltip = useMemo(() => {
    return function CustomDayButton(props: React.ComponentProps<typeof CalendarDayButton>) {
      const isReserved = props.modifiers?.disabled === true;
      const button = <CalendarDayButton {...props} />;
      if (isReserved) {
        return (
          <Tooltip>
            <TooltipTrigger asChild>{button}</TooltipTrigger>
            <TooltipContent>{uiStrings.booking.reserved}</TooltipContent>
          </Tooltip>
        );
      }
      return button;
    };
  }, []);

  return (
    <TooltipProvider delayDuration={200}>
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, y: 20 }}
        animate={reducedMotion ? false : { opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-xl border border-white/60 bg-white/80 p-4 shadow-lg backdrop-blur-md sm:p-6"
      >
        <h2 className="text-lg font-semibold leading-tight text-foreground">
          {uiStrings.booking.checkAvailability}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {uiStrings.booking.selectDates}
        </p>
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start">
          <Calendar
            mode="range"
            selected={range}
            onSelect={setRange}
            disabled={isDateDisabled}
            components={{ DayButton: DayButtonWithReservedTooltip }}
            className="rounded-lg border-0 bg-transparent p-0"
          />
          <div className="flex flex-col gap-2 sm:mt-0">
            <Button
              className="min-h-11 cursor-pointer"
              onClick={() => setRange(undefined)}
            >
              {uiStrings.booking.clearDates}
            </Button>
            <p className="text-xs text-muted-foreground">
              {uiStrings.booking.bookViaOtas}
            </p>
          </div>
        </div>
      </motion.div>
    </TooltipProvider>
  );
}
