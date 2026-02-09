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
import { localeLabels, type Locale } from "@/lib/i18n";
import { locales } from "@/lib/i18n";
import { Languages } from "lucide-react";

interface HeaderProps {
  currentLocale: Locale;
}

/**
 * Site header: nav links, gallery, theme switcher, language selector (icon).
 * Language selector uses Languages icon like vanhomestay reference.
 */
export function Header({ currentLocale }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-14 items-center justify-between px-4 sm:px-6">
        <Link href={`/${currentLocale}`} className="flex items-center gap-2 font-semibold">
          <img src="/logo.svg" alt="" className="h-8 w-auto" width={120} height={40} />
          <span className="sr-only">Family Hotel</span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2" aria-label="Main">
          <Link
            href={`/${currentLocale}/property`}
            className="min-h-9 min-w-9 rounded-md px-3 py-2 text-sm font-medium underline-offset-4 hover:underline focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring"
          >
            Property
          </Link>
          <Link
            href={`/${currentLocale}/gallery`}
            className="min-h-9 min-w-9 rounded-md px-3 py-2 text-sm font-medium underline-offset-4 hover:underline focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring"
          >
            Gallery
          </Link>
          <Link
            href={`/${currentLocale}/policies`}
            className="min-h-9 min-w-9 rounded-md px-3 py-2 text-sm font-medium underline-offset-4 hover:underline focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring"
          >
            Policies
          </Link>
          <ThemeSwitcher />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 shrink-0"
                aria-label="Select language"
                aria-haspopup="listbox"
              >
                <Languages className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" role="listbox" aria-label="Language options">
              {locales.map((locale) => (
                <DropdownMenuItem key={locale} asChild role="option">
                  <Link
                    href={`/${locale}`}
                    className="cursor-pointer"
                    aria-selected={currentLocale === locale}
                  >
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
