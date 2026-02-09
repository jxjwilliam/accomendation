"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { themeIds, themeLabels, type ThemeId } from "@/lib/themes";
import { Palette } from "lucide-react";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9"
          aria-label="Choose theme"
          aria-haspopup="listbox"
        >
          <Palette className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" role="listbox" aria-label="Theme options">
        {themeIds.map((id) => (
          <DropdownMenuItem
            key={id}
            onClick={() => setTheme(id as ThemeId)}
            role="option"
            aria-selected={theme === id}
          >
            {themeLabels[id as ThemeId]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
