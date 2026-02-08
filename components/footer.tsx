import Link from "next/link";
import { getFooterContent } from "@/lib/content";
import type { Locale } from "@/lib/i18n";

interface FooterProps {
  locale: Locale;
}

/**
 * Site footer with business name, address, and links (FR-004, FR-005).
 * Shown on every main page; content localized per locale.
 */
export async function Footer({ locale }: FooterProps) {
  const { businessName, addressLine, links } = await getFooterContent(locale);
  return (
    <footer
      className="border-t bg-muted/30"
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="container w-full max-w-5xl px-4 py-8 md:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
          <div>
            <p className="font-semibold text-foreground">{businessName}</p>
            <p className="mt-1 text-sm text-muted-foreground">{addressLine}</p>
          </div>
          <nav aria-label="Footer navigation" className="flex flex-wrap gap-4 sm:gap-6">
            {links.map(({ label, href, external }) => (
              <Link
                key={href + label}
                href={href}
                className="min-h-11 min-w-11 cursor-pointer rounded-md px-2 py-2 text-sm text-primary underline-offset-4 hover:underline focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring"
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
