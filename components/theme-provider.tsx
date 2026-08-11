"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Moon, Sun } from "lucide-react";

const THEME_KEY = "budgetpal-theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(THEME_KEY) as "light" | "dark" | null;
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    const initialTheme = storedTheme ?? (prefersDark ? "dark" : "light");

    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    window.localStorage.setItem(THEME_KEY, nextTheme);
  };

  return (
    <>
      {children}
      {mounted && (
        <button
          type="button"
          onClick={toggleTheme}
          className="fixed bottom-6 right-6 z-50 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white text-slate-900 shadow-xl transition-all duration-300 hover:scale-110 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
          aria-label="Toggle Theme"
        >
          {theme === "dark" ? (
            <Sun className="h-6 w-6 text-amber-500 animate-spin-slow" />
          ) : (
            <Moon className="h-6 w-6 text-slate-700" />
          )}
        </button>
      )}
    </>
  );
}
