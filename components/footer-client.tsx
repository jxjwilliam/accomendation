"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Images,
  CalendarCheck,
  FileText,
  HelpCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { FooterContent } from "@/lib/types";

/** Icon for a footer nav link by href. */
function getLinkIcon(href: string) {
  if (href.includes("gallery")) return Images;
  if (href.includes("contact") || href === "#contact") return CalendarCheck;
  return CalendarCheck;
}

/** Icon for a footer modal link by modalId. */
function getModalLinkIcon(modalId: "policies" | "faq") {
  if (modalId === "policies") return FileText;
  return HelpCircle;
}

interface FooterClientProps {
  content: FooterContent;
}

/**
 * Footer with optional modal links (Policies, FAQ). Renders links and modal triggers.
 */
export function FooterClient({ content }: FooterClientProps) {
  const [policiesOpen, setPoliciesOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState(false);
  const { businessName, addressLine, links, modalLinks, policiesContent, faqContent } = content;

  return (
    <>
      <footer
        className="border-t bg-foreground py-12 text-white"
        role="contentinfo"
        aria-label="Site footer"
      >
        <div className="container mx-auto max-w-6xl px-4 md:px-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
            <div>
              <p className="font-semibold text-white">{businessName}</p>
              <p className="mt-1 text-sm text-white/80">{addressLine}</p>
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
                return (
                  <button
                    key={modalId}
                    type="button"
                    onClick={() => (modalId === "policies" ? setPoliciesOpen(true) : setFaqOpen(true))}
                    className="flex min-h-11 min-w-11 cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-left text-sm text-white/90 underline-offset-4 hover:text-primary hover:underline focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden />
                    {label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </footer>

      <Dialog open={policiesOpen} onOpenChange={setPoliciesOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Policies</DialogTitle>
          </DialogHeader>
          {policiesContent?.externalUrl ? (
            <a
              href={policiesContent.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              View full policies
            </a>
          ) : policiesContent ? (
            <div className="space-y-4 text-sm">
              {policiesContent.checkInOut && (
                <section>
                  <h3 className="font-semibold">Check-in & Check-out</h3>
                  <p className="mt-1 text-muted-foreground">{policiesContent.checkInOut}</p>
                </section>
              )}
              {policiesContent.cancellation && (
                <section>
                  <h3 className="font-semibold">Cancellation</h3>
                  <p className="mt-1 text-muted-foreground">{policiesContent.cancellation}</p>
                </section>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground">No policies listed.</p>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={faqOpen} onOpenChange={setFaqOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{faqContent?.title ?? "FAQ"}</DialogTitle>
          </DialogHeader>
          <dl className="mt-2 space-y-4">
            {faqContent?.items.map((item, i) => (
              <div key={i}>
                <dt className="font-semibold text-foreground">{item.q}</dt>
                <dd className="mt-1 text-sm text-muted-foreground">{item.a}</dd>
              </div>
            ))}
          </dl>
        </DialogContent>
      </Dialog>
    </>
  );
}
