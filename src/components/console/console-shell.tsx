"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bookmark,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Newspaper,
  PenSquare,
  Search,
  Sun,
  X,
} from "lucide-react";
import { useState, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";

const nav = [
  { href: "/console", label: "Dashboard", icon: LayoutDashboard },
  { href: "/console/feed", label: "Feed", icon: Newspaper },
  { href: "/console/write", label: "Write", icon: PenSquare },
  { href: "/console/search", label: "Search", icon: Search },
  { href: "/console/favourites", label: "Favourites", icon: Bookmark },
];

export function ConsoleShell({
  children,
  userName,
}: {
  children: React.ReactNode;
  userName: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  const isDark = isClient && resolvedTheme === "dark";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100">
      <div className="mx-auto flex max-w-[1600px]">
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-72 transform border-r border-sky-200/70 bg-white/95 shadow-xl backdrop-blur transition-transform dark:border-slate-800 dark:bg-slate-950/95 lg:static lg:translate-x-0 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-16 items-center justify-between border-b border-sky-100 px-5 dark:border-slate-800">
            <Link href="/console/feed" className="font-semibold tracking-tight">
              All Time News
            </Link>
            <button
              type="button"
              className="rounded-xl p-2 text-slate-500 lg:hidden"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="px-4 py-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700 dark:text-sky-300">
              Console
            </p>
            <p className="mt-2 text-sm font-medium text-slate-900 dark:text-slate-100">
              {userName}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Editorial workspace
            </p>
          </div>
          <nav className="space-y-1 px-3 pb-8">
            {nav.map((item) => {
              const Icon = item.icon;
              const active =
                item.href === "/console"
                  ? pathname === "/console"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition ${
                    active
                      ? "bg-sky-100 text-sky-900 shadow-sm dark:bg-sky-900/40 dark:text-sky-50"
                      : "text-slate-600 hover:bg-sky-50 dark:text-slate-300 dark:hover:bg-slate-900"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="absolute bottom-0 left-0 right-0 space-y-2 border-t border-sky-100 p-4 dark:border-slate-800">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-2xl px-3 py-2 text-sm text-slate-600 transition hover:bg-sky-50 dark:text-slate-300 dark:hover:bg-slate-900"
            >
              <Home className="h-4 w-4" />
              Marketing site
            </Link>
            <button
              type="button"
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-left text-sm text-slate-600 transition hover:bg-sky-50 dark:text-slate-300 dark:hover:bg-slate-900"
            >
              {isDark ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
              {isDark ? "Light mode" : "Dark mode"}
            </button>
            <button
              type="button"
              onClick={() => void logout()}
              className="flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-left text-sm font-medium text-red-700 transition hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-950/40"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </aside>

        {open ? (
          <button
            type="button"
            className="fixed inset-0 z-30 bg-black/40 lg:hidden"
            aria-label="Close menu overlay"
            onClick={() => setOpen(false)}
          />
        ) : null}

        <div className="min-h-screen flex-1 lg:pl-0">
          <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-sky-200/70 bg-white/80 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80 sm:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="rounded-xl p-2 text-slate-600 lg:hidden dark:text-slate-300"
                onClick={() => setOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-sky-700 dark:text-sky-300">
                  Syndicate console
                </p>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                  {nav.find((n) =>
                    n.href === "/console"
                      ? pathname === "/console"
                      : pathname.startsWith(n.href),
                  )?.label ?? "Workspace"}
                </p>
              </div>
            </div>
          </header>
          <div className="px-4 py-8 sm:px-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
