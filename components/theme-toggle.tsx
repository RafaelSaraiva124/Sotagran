"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export const THEME_STORAGE_KEY = "sotragran-theme";

type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
    document.documentElement.classList.toggle("light", theme === "light");
}

export default function ThemeToggle({
    className,
    showLabel = false,
}: {
    className?: string;
    showLabel?: boolean;
}) {
    const [theme, setTheme] = useState<Theme>("dark");

    useEffect(() => {
        const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
        setTheme(stored === "light" ? "light" : "dark");
    }, []);

    const toggle = () => {
        const next: Theme = theme === "dark" ? "light" : "dark";

        setTheme(next);
        applyTheme(next);
        window.localStorage.setItem(THEME_STORAGE_KEY, next);
    };

    return (
        <button
            type="button"
            onClick={toggle}
            aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
            className={cn(
                "inline-flex items-center gap-2 transition-colors hover:text-copper",
                showLabel ? "w-full" : "h-8 w-8 justify-center",
                className,
            )}
        >
            {theme === "dark" ? (
                <Sun className="size-4" />
            ) : (
                <Moon className="size-4" />
            )}

            {showLabel && (
                <span>
                    {theme === "dark" ? "Modo claro" : "Modo escuro"}
                </span>
            )}
        </button>
    );
}
