"use client";

import { useState } from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { localeLabels, localeIcons, type Locale } from "@/lib/i18n";
import { locales } from "@/lib/i18n";
import { Globe, Menu, Phone, Mail, Home, Building2, CalendarCheck, Images } from "lucide-react";
import { CONTACT } from "@/lib/contact";

interface HeaderProps {
  currentLocale: Locale;
  brandName: string;
  navLabels: { home: string; property: string; booking: string; contact: string; gallery: string };
  activeSection?: string | null;
}

const NAV_ITEMS: {
  id: string;
  getHref: (locale: string) => string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "home", getHref: (locale) => `/${locale}#home`, icon: Home },
  { id: "property-details", getHref: (locale) => `/${locale}#property-details`, icon: Building2 },
  { id: "book-your-stay", getHref: (locale) => `/${locale}#book-your-stay`, icon: CalendarCheck },
  { id: "get-in-touch", getHref: (locale) => `/${locale}#get-in-touch`, icon: Mail },
  { id: "gallery", getHref: (locale) => `/${locale}/gallery`, icon: Images },
];

/**
 * Header component matching Van Homestay layout:
 * Logo (left) | Nav links center | Language + Theme (right)
 * Mobile: Hamburger opens Sheet with nav links.
 */
export function Header({ currentLocale, brandName, navLabels, activeSection }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const labels = [navLabels.home, navLabels.property, navLabels.booking, navLabels.contact, navLabels.gallery];

  const navLinks = (
    <>
      {NAV_ITEMS.map((item, i) => (
        <Link
          key={item.id}
          href={item.getHref(currentLocale)}
          onClick={() => setMobileOpen(false)}
          className={`shrink-0 text-sm font-medium transition-colors hover:text-primary ${
            activeSection === item.id ? "text-primary" : "text-foreground"
          }`}
        >
          {labels[i]}
        </Link>
      ))}
    </>
  );

  return (
    <nav
      className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md dark:bg-background/80"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex h-16 w-full max-w-full items-center justify-between px-4 sm:px-6">
        {/* Left: Logo - more ml to pull toward center */}
        <Link
          href={`/${currentLocale}`}
          className="ml-48 flex shrink-0 items-center gap-2 font-bold text-foreground hover:text-primary sm:ml-64"
        >
          <img
            src="/2.png"
            alt=""
            className="h-10 w-auto max-h-12 object-contain"
            width={120}
            height={48}
          />
          <span className="hidden text-xl sm:inline">{brandName}</span>
        </Link>

        {/* Center: Nav links - text only, gap-8 (Van Homestay style) */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks}
        </div>

        {/* Right: Phone + Email + Theme + Language + Hamburger - more mr to pull toward center */}
        <div className="mr-48 flex shrink-0 items-center gap-4 sm:mr-64">
          <a
            href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
            className="hidden items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors sm:flex"
            aria-label={`Phone: ${CONTACT.phone}`}
          >
            <Phone className="size-4 shrink-0" aria-hidden />
            <span className="hidden lg:inline">{CONTACT.phone}</span>
          </a>
          <a
            href={`mailto:${CONTACT.email}`}
            className="hidden items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors sm:flex"
            aria-label={`Email: ${CONTACT.email}`}
          >
            <Mail className="size-4 shrink-0" aria-hidden />
            <span className="hidden lg:inline">{CONTACT.email}</span>
          </a>
          <ThemeSwitcher />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0"
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
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-muted text-xs font-semibold">
                      {localeIcons[locale]}
                    </span>
                    {localeLabels[locale]}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden h-8 w-8 shrink-0"
                aria-label="Open menu"
              >
                <Menu className="size-6" aria-hidden />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[320px]">
              <SheetHeader className="px-6">
                <SheetTitle className="text-left">{brandName}</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 px-6 pb-6 pt-2">
                <div className="flex flex-col gap-3 border-b border-border pb-4">
                  <a
                    href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
                    className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary"
                    aria-label={`Phone: ${CONTACT.phone}`}
                  >
                    <Phone className="size-5 shrink-0" aria-hidden />
                    {CONTACT.phone}
                  </a>
                  <a
                    href={`mailto:${CONTACT.email}`}
                    className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary break-all"
                    aria-label={`Email: ${CONTACT.email}`}
                  >
                    <Mail className="size-5 shrink-0" aria-hidden />
                    {CONTACT.email}
                  </a>
                </div>
                <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
                  {NAV_ITEMS.map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.id}
                        href={item.getHref(currentLocale)}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-colors hover:bg-muted/50 hover:text-primary ${
                          activeSection === item.id ? "text-primary" : "text-foreground"
                        }`}
                      >
                        <Icon className="size-5 shrink-0" aria-hidden />
                        {labels[i]}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
