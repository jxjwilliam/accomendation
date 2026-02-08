"use client";

import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { localeLabels, type Locale } from "@/lib/i18n";
import { locales } from "@/lib/i18n";
import { ChevronDown } from "lucide-react";

interface HeaderProps {
  currentLocale: Locale;
}

/**
 * Site header with visible language selector (FR-008).
 * Allows switching between English, French, Chinese Simplified, Chinese Traditional.
 */
export function Header({ currentLocale }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-14 items-center justify-between px-4 sm:px-6">
        <Link href={`/${currentLocale}`} className="flex items-center gap-2 font-semibold">
          <img src="/logo.svg" alt="" className="h-8 w-auto" width={120} height={40} />
          <span className="sr-only">Family Hotel</span>
        </Link>
        <nav className="flex items-center gap-4" aria-label="Main">
          <Link href={`/${currentLocale}/property`} className="text-sm underline-offset-4 hover:underline">
            Property
          </Link>
          <Link href={`/${currentLocale}/policies`} className="text-sm underline-offset-4 hover:underline">
            Policies
          </Link>
          <span aria-label="Language selection">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" aria-haspopup="listbox">
                {localeLabels[currentLocale]}
                <ChevronDown className="ml-1 size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" role="listbox">
              {locales.map((locale) => (
                <DropdownMenuItem key={locale} asChild role="option">
                  <Link href={`/${locale}`} className="cursor-pointer">
                    {localeLabels[locale]}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          </span>
        </nav>
      </div>
    </header>
  );
}
