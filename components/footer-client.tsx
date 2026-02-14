"use client";

import { useState } from "react";
import Link from "next/link";
import { Images, CalendarCheck, FileText, ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import type { FooterContent } from "@/lib/types";
import type { UiStrings } from "@/lib/types";
import { QrCodeBadge } from "@/components/qr-code-badge";

/** Icon for a footer nav link by href. */
function getLinkIcon(href: string) {
  if (href.includes("gallery")) return Images;
  if (href.includes("contact") || href === "#contact") return CalendarCheck;
  return CalendarCheck;
}

/** Icon for a footer modal link by modalId. */
function getModalLinkIcon(_modalId: "policies" | "faq") {
  return FileText;
}

interface FooterClientProps {
  content: FooterContent;
  siteUrl?: string;
  uiStrings: UiStrings;
}

/**
 * Footer with optional modal links (Policies, FAQ). Renders links and modal triggers.
 */
const DEFAULT_SITE_URL = "https://manna-family-hotel.vercel.app/";

export function FooterClient({ content, siteUrl = DEFAULT_SITE_URL, uiStrings }: FooterClientProps) {
  const [policiesOpen, setPoliciesOpen] = useState(false);
  const { businessName, addressLine, links, modalLinks, policiesContent } = content;

  return (
    <>
      <footer
        className="border-t bg-foreground py-12 text-white"
        role="contentinfo"
        aria-label="Site footer"
      >
        <div className="container mx-auto max-w-6xl px-4 md:px-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="font-semibold text-white">{businessName}</p>
                <p className="mt-1 text-sm text-white/80">{addressLine}</p>
              </div>
              <QrCodeBadge
                value={siteUrl || DEFAULT_SITE_URL}
                size={80}
                title="Scan to visit Manna Family Hotel"
                className="shrink-0 border-white/30 bg-white"
              />
            </div>
            <nav aria-label="Footer navigation" className="flex flex-wrap items-center gap-4 sm:gap-6">
              {links.map(({ label, href, external }) => {
                const Icon = getLinkIcon(href);
                return (
                  <Link
                    key={href + label}
                    href={href}
                    className="flex min-h-11 min-w-11 cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-white/90 underline-offset-4 hover:text-primary hover:underline focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring"
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden />
                    {label}
                  </Link>
                );
              })}
              {modalLinks?.map(({ label, modalId }) => {
                const Icon = getModalLinkIcon(modalId);
                return modalId === "policies" ? (
                  <button
                    key={modalId}
                    type="button"
                    onClick={() => setPoliciesOpen(true)}
                    className="flex min-h-11 min-w-11 cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-left text-sm text-white/90 underline-offset-4 hover:text-primary hover:underline focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden />
                    {label}
                  </button>
                ) : null;
              })}
            </nav>
          </div>
          {/* Booking platform links from .env */}
          {(process.env.NEXT_PUBLIC_AIRBNB_BOOKING_URL ||
            process.env.NEXT_PUBLIC_BOOKING_COM_BOOKING_URL ||
            process.env.NEXT_PUBLIC_VRBO_BOOKING_URL) && (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 border-t border-white/20 pt-6">
              {process.env.NEXT_PUBLIC_AIRBNB_BOOKING_URL && (
                <a
                  href={process.env.NEXT_PUBLIC_AIRBNB_BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-11 min-w-11 items-center gap-2 rounded-md px-3 py-2 text-sm text-white/90 underline-offset-4 hover:text-primary hover:underline focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={`${uiStrings.footer.airbnb} - ${uiStrings.sections.bookYourStay}`}
                >
                  <ExternalLink className="h-4 w-4 shrink-0" aria-hidden />
                  {uiStrings.footer.airbnb}
                </a>
              )}
              {process.env.NEXT_PUBLIC_BOOKING_COM_BOOKING_URL && (
                <a
                  href={process.env.NEXT_PUBLIC_BOOKING_COM_BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-11 min-w-11 items-center gap-2 rounded-md px-3 py-2 text-sm text-white/90 underline-offset-4 hover:text-primary hover:underline focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={`${uiStrings.footer.bookingCom} - ${uiStrings.sections.bookYourStay}`}
                >
                  <ExternalLink className="h-4 w-4 shrink-0" aria-hidden />
                  {uiStrings.footer.bookingCom}
                </a>
              )}
              {process.env.NEXT_PUBLIC_VRBO_BOOKING_URL && (
                <a
                  href={process.env.NEXT_PUBLIC_VRBO_BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-11 min-w-11 items-center gap-2 rounded-md px-3 py-2 text-sm text-white/90 underline-offset-4 hover:text-primary hover:underline focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={`${uiStrings.footer.vrbo} - ${uiStrings.sections.bookYourStay}`}
                >
                  <ExternalLink className="h-4 w-4 shrink-0" aria-hidden />
                  {uiStrings.footer.vrbo}
                </a>
              )}
            </div>
          )}
        </div>
      </footer>

      <Dialog open={policiesOpen} onOpenChange={setPoliciesOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <div className="flex items-start justify-between gap-4">
            <DialogHeader>
              <DialogTitle>{uiStrings.modals.policies}</DialogTitle>
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
          {policiesContent?.externalUrl ? (
            <a
              href={policiesContent.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              {uiStrings.sections.viewFullPolicies}
            </a>
          ) : policiesContent ? (
            <div className="space-y-4 text-sm">
              {policiesContent.checkInOut && (
                <section>
                  <h3 className="font-semibold">{uiStrings.modals.checkInOut}</h3>
                  <p className="mt-1 text-muted-foreground">{policiesContent.checkInOut}</p>
                </section>
              )}
              {policiesContent.cancellation && (
                <section>
                  <h3 className="font-semibold">{uiStrings.modals.cancellation}</h3>
                  <p className="mt-1 text-muted-foreground">{policiesContent.cancellation}</p>
                </section>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground">{uiStrings.modals.noPolicies}</p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
