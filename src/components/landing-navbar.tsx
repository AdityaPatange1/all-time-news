"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";
import { BrandMark } from "@/components/brand-mark";
import { GetStartedButton } from "@/components/get-started-button";

const NAV_LINKS = [
  { href: "#motivation", label: "Mission" },
  { href: "#features", label: "Platform" },
  { href: "#testimonials", label: "Voices" },
  { href: "#clients", label: "Partners" },
  { href: "#contact", label: "Contact" },
] as const;

export function LandingNavbar() {
  const { resolvedTheme, setTheme } = useTheme();
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const isDark = isClient && resolvedTheme === "dark";
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMobile();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [mobileOpen, closeMobile]);

  return (
    <header className="sticky top-0 z-50 border-b border-sky-200/70 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-10">
        <div className="flex h-14 items-center justify-between gap-2 sm:h-16 md:gap-4">
          <Link
            href="/"
            className="group flex min-w-0 shrink items-center gap-2 sm:gap-3"
            onClick={closeMobile}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-sky-200/90 bg-gradient-to-br from-sky-50 to-white text-sky-600 shadow-sm transition group-hover:border-sky-300 group-hover:shadow-md dark:border-slate-700 dark:from-slate-900 dark:to-slate-950 dark:text-sky-400 dark:group-hover:border-slate-600">
              <BrandMark className="h-[22px] w-[22px] sm:h-6 sm:w-6" />
            </span>
            <div className="min-w-0 leading-tight">
              <p className="truncate text-[15px] font-semibold tracking-tight text-slate-900 dark:text-white sm:text-lg">
                All Time News
              </p>
              <p className="truncate text-[10px] text-slate-500 dark:text-slate-400 sm:text-xs">
                Global News Syndicate
              </p>
            </div>
          </Link>

          <nav
            className="hidden items-center md:flex md:gap-0.5 lg:gap-1"
            aria-label="Primary"
          >
            {NAV_LINKS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-lg px-2 py-2 text-sm font-medium text-slate-600 transition hover:bg-sky-50 hover:text-sky-900 lg:px-2.5 xl:px-3 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <div className="hidden sm:block">
              <GetStartedButton className="mt-0 px-4 py-2.5 text-xs font-semibold shadow-md sm:text-sm" />
            </div>

            <button
              type="button"
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-sky-200 bg-sky-50 text-sky-900 transition hover:bg-sky-100 dark:border-sky-800 dark:bg-slate-900 dark:text-sky-100 dark:hover:bg-slate-800"
              aria-label="Toggle color mode"
              disabled={!isClient}
            >
              {isClient ? (
                isDark ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )
              ) : (
                <Moon className="h-4 w-4 opacity-50" />
              )}
            </button>

            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-sky-200 bg-white text-slate-800 transition hover:bg-sky-50 md:hidden dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
              aria-expanded={mobileOpen}
              aria-controls="landing-mobile-nav"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen((o) => !o)}
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen ? (
        <>
          <button
            type="button"
            className="fixed inset-x-0 bottom-0 top-14 z-40 bg-slate-950/35 backdrop-blur-[1px] sm:top-16 md:hidden"
            aria-hidden
            tabIndex={-1}
            onClick={closeMobile}
          />
          <div
            id="landing-mobile-nav"
            className="relative z-50 border-t border-sky-100 bg-white px-4 py-4 shadow-[0_12px_40px_-12px_rgba(15,23,42,0.15)] dark:border-slate-800 dark:bg-slate-950 md:hidden"
          >
            <nav className="flex flex-col gap-0.5" aria-label="Mobile primary">
              {NAV_LINKS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded-xl px-3 py-3 text-base font-medium text-slate-800 transition hover:bg-sky-50 active:bg-sky-100 dark:text-slate-100 dark:hover:bg-slate-900 dark:active:bg-slate-800"
                  onClick={closeMobile}
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <div className="mt-4 border-t border-sky-100 pt-4 dark:border-slate-800 sm:hidden">
              <GetStartedButton className="mt-0 flex w-full justify-center py-3 text-sm" />
            </div>
          </div>
        </>
      ) : null}
    </header>
  );
}
