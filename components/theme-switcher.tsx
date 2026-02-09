"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { themeIds, themeLabels, themePrimaryColors, type ThemeId } from "@/lib/themes";
import { Sparkles } from "lucide-react";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 min-h-[44px] min-w-[44px]"
          aria-label="Choose theme"
          aria-haspopup="listbox"
        >
          <Sparkles className="size-4" aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" role="listbox" aria-label="Theme options">
        {themeIds.map((id) => {
          const primaryColor = themePrimaryColors[id as ThemeId];
          return (
            <DropdownMenuItem
              key={id}
              onClick={() => setTheme(id as ThemeId)}
              role="option"
              aria-selected={theme === id}
              className="flex items-center gap-3"
            >
              <span
                className="h-5 w-5 shrink-0 rounded-full border border-border"
                style={{ backgroundColor: primaryColor }}
                aria-hidden
              />
              <span style={{ color: primaryColor }} className="font-medium">
                {themeLabels[id as ThemeId]}
              </span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
