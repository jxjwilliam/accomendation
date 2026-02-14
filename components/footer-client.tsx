"use client";

import { useState } from "react";
import { FileText, ExternalLink, Phone, Mail } from "lucide-react";
import { CONTACT } from "@/lib/contact";
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
  const { businessName, addressLine, modalLinks, policiesContent } = content;

  return (
    <>
      <footer
        className="border-t bg-foreground py-12 text-white"
        role="contentinfo"
        aria-label="Site footer"
      >
        <div className="container mx-auto max-w-6xl px-4 md:px-6 space-y-8">
          {/* Row 1: Business info | QR code + Airbnb + Booking.com + VRBO */}
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="font-semibold text-white">{businessName}</p>
              <p className="mt-1 text-sm text-white/80">{addressLine}</p>
              <div className="mt-2 flex flex-col gap-1 text-sm text-white/80">
                <a
                  href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
                  className="inline-flex items-center gap-2 hover:text-white focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring rounded"
                  aria-label={`Phone: ${CONTACT.phone}`}
                >
                  <Phone className="h-4 w-4 shrink-0" aria-hidden />
                  {CONTACT.phone}
                </a>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="inline-flex items-center gap-2 hover:text-white focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring rounded"
                  aria-label={`Email: ${CONTACT.email}`}
                >
                  <Mail className="h-4 w-4 shrink-0" aria-hidden />
                  {CONTACT.email}
                </a>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <QrCodeBadge
                value={DEFAULT_SITE_URL}
                size={96}
                title="Scan to visit Manna Family Hotel"
                className="shrink-0 border-white/30 bg-white"
              />
              {(process.env.NEXT_PUBLIC_AIRBNB_BOOKING_URL ||
                process.env.NEXT_PUBLIC_BOOKING_COM_BOOKING_URL ||
                process.env.NEXT_PUBLIC_VRBO_BOOKING_URL) && (
                <div className="flex flex-wrap items-center gap-3 sm:gap-4">
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
            {modalLinks && modalLinks.length > 0 && (
              <nav aria-label="Footer navigation" className="flex flex-wrap items-center gap-4">
                {modalLinks.map(({ label, modalId }) => {
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
            )}
          </div>
          {/* Row 2: Copyright + bestitconsulting.ca */}
          <div className="flex flex-col gap-2 border-t border-white/20 pt-6 text-center sm:flex-row sm:items-center sm:justify-center sm:gap-4">
            <p className="text-sm text-white/70">
              © {new Date().getFullYear()} {businessName}
            </p>
            <a
              href="https://bestitconsulting.ca"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white/70 underline-offset-4 hover:text-white focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring"
            >
              bestitconsulting.ca
            </a>
          </div>
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
