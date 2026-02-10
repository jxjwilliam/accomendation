"use client";

import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { localeLabels, localeIcons, type Locale } from "@/lib/i18n";
import { locales } from "@/lib/i18n";
import { Globe, Home, Building2, Mail, Phone } from "lucide-react";
import { CONTACT } from "@/lib/contact";

interface HeaderProps {
  currentLocale: Locale;
  /** Localized brand name for logo (e.g. "Manna Family Hotel", "吗哪家庭旅馆"). */
  brandName: string;
  navLabels: { home: string; property: string; contact: string };
  /** Optional: which section id is in view for highlight (e.g. from scroll-spy). */
  activeSection?: string | null;
}

const NAV_ITEMS: {
  id: string;
  getHref: (locale: string) => string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "home", getHref: (locale) => `/${locale}#home`, icon: Home },
  { id: "property-details", getHref: (locale) => `/${locale}#property-details`, icon: Building2 },
  { id: "contact", getHref: (locale) => `/${locale}#contact`, icon: Mail },
];

export function Header({ currentLocale, brandName, navLabels, activeSection }: HeaderProps) {
  const labels = [navLabels.home, navLabels.property, navLabels.contact];
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md dark:bg-background/80">
      <div className="container flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link
          href={`/${currentLocale}`}
          className="flex shrink-0 items-center gap-2 font-semibold text-foreground hover:text-primary"
        >
          <img
            src="/2.png"
            alt=""
            className="h-10 w-auto max-h-12 object-contain"
            width={120}
            height={48}
          />
          <span className="hidden text-base sm:inline">{brandName}</span>
        </Link>
        <nav
          className="flex flex-1 items-center justify-end gap-1 sm:gap-2"
          aria-label="Main"
        >
          <a
            href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-1.5 rounded-md px-2 py-2 text-sm text-muted-foreground hover:text-primary focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring md:gap-2 md:justify-start"
            aria-label={`Phone: ${CONTACT.phone}`}
          >
            <Phone className="size-4 shrink-0" aria-hidden />
            <span className="hidden lg:inline">{CONTACT.phone}</span>
          </a>
          <a
            href={`mailto:${CONTACT.email}`}
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-1.5 rounded-md px-2 py-2 text-sm text-muted-foreground hover:text-primary focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring md:gap-2 md:justify-start"
            aria-label={`Email: ${CONTACT.email}`}
          >
            <Mail className="size-4 shrink-0" aria-hidden />
            <span className="hidden lg:inline">{CONTACT.email}</span>
          </a>
          {NAV_ITEMS.map((item, i) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href={item.getHref(currentLocale)}
                className={`min-h-[44px] min-w-[44px] rounded-md px-3 py-2 text-sm font-medium underline-offset-4 hover:text-primary hover:underline focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring inline-flex items-center gap-2 ${
                  activeSection === item.id ? "text-primary font-semibold" : "text-foreground"
                }`}
              >
                <Icon className="size-4 shrink-0" aria-hidden />
                {labels[i]}
              </Link>
            );
          })}
          <ThemeSwitcher />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-11 min-h-[44px] w-11 min-w-[44px] shrink-0"
                aria-label="Select language"
                aria-haspopup="listbox"
              >
                <Globe className="size-4" aria-hidden />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" role="listbox" aria-label="Language options">
              {locales.map((locale) => (
                <DropdownMenuItem key={locale} asChild role="option">
                  <Link
                    href={`/${locale}`}
                    className="flex cursor-pointer items-center gap-2"
                    aria-selected={currentLocale === locale}
                  >
                    <span
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-muted text-xs font-semibold"
                      aria-hidden
                    >
                      {localeIcons[locale]}
                    </span>
                    {localeLabels[locale]}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  );
}
