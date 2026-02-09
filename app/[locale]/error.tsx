"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * Error boundary for locale routes. Shows a friendly message and option to go back.
 */
export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Locale route error:", error);
  }, [error]);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 md:px-6">
      <div className="rounded-lg border bg-card p-6 text-center">
        <h1 className="text-xl font-semibold text-foreground">Something went wrong</h1>
        <p className="mt-2 text-muted-foreground">
          We couldn’t load this page. Please try again or go back to the home page.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button onClick={reset} variant="default">
            Try again
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Go to home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
