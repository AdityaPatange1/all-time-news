"use client";

import { FormEvent, useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Eye, EyeOff, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const REMEMBER_EMAIL_KEY = "atn_remember_email";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resolvedTheme, setTheme } = useTheme();
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [rememberEmail, setRememberEmail] = useState(true);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const stored = localStorage.getItem(REMEMBER_EMAIL_KEY);
      if (stored) setEmail(stored);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          rememberMe,
        }),
      });

      const data = (await response.json()) as {
        ok?: boolean;
        error?: string;
      };

      if (!response.ok || !data.ok) {
        setStatus("error");
        setMessage(data.error ?? "Unable to sign in.");
        return;
      }

      if (rememberEmail) {
        localStorage.setItem(REMEMBER_EMAIL_KEY, email.trim());
      } else {
        localStorage.removeItem(REMEMBER_EMAIL_KEY);
      }

      const next = searchParams.get("next");
      router.push(next && next.startsWith("/") ? next : "/console/feed");
      router.refresh();
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  const isDark = isClient && resolvedTheme === "dark";

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-sky-50 via-white to-slate-100 text-slate-900 transition-colors dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100">
      <div className="pointer-events-none absolute -left-24 top-10 h-64 w-64 rounded-full bg-sky-300/40 blur-3xl dark:bg-sky-600/20" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-indigo-300/30 blur-3xl dark:bg-indigo-600/15" />

      <header className="relative z-10 mx-auto flex max-w-5xl items-center justify-between px-6 pt-8 sm:px-10">
        <Link href="/" className="group inline-flex items-center gap-3">
          <span className="relative h-10 w-10 overflow-hidden rounded-2xl border border-sky-200/80 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <Image
              src="/globe.svg"
              alt=""
              width={40}
              height={40}
              className="h-full w-full object-cover opacity-90"
            />
          </span>
          <span>
            <span className="block text-sm font-semibold tracking-tight">
              All Time News
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Sign in to your desk
            </span>
          </span>
        </Link>
        <button
          type="button"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="inline-flex items-center gap-2 rounded-full border border-sky-300 bg-white/80 px-4 py-2 text-sm font-medium text-sky-900 shadow-sm backdrop-blur transition hover:bg-sky-50 dark:border-sky-800 dark:bg-slate-900/80 dark:text-sky-100 dark:hover:bg-slate-900"
          aria-label="Toggle color mode"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          {isDark ? "Light" : "Dark"}
        </button>
      </header>

      <main className="relative z-10 mx-auto grid min-h-[calc(100vh-5rem)] max-w-5xl items-center gap-12 px-6 py-12 sm:px-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="inline-flex rounded-full bg-sky-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-sky-800 dark:bg-sky-900/60 dark:text-sky-200">
            Secure access
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
            Welcome back to the intelligence desk.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-300">
            Review the live feed, publish verified briefs, and keep your
            favourites within reach. Sessions stay active for up to 48 hours
            when you choose remember me.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <li className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Encrypted credentials with salted hashing in MongoDB.
            </li>
            <li className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-sky-500" />
              Signed HTTP-only cookies for resilient auth.
            </li>
            <li className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-500" />
              Short-lived tokens when you skip remember me.
            </li>
          </ul>
        </div>

        <div className="rounded-3xl border border-sky-200/80 bg-white/90 p-8 shadow-xl shadow-sky-200/30 backdrop-blur dark:border-slate-700 dark:bg-slate-900/75 dark:shadow-sky-950/30">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">Sign in</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Use your syndicate credentials.
              </p>
            </div>
          </div>

          <form className="mt-8 space-y-5" onSubmit={onSubmit} noValidate>
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-sky-200 bg-white px-4 py-3 text-sm outline-none ring-sky-400/40 transition focus:border-sky-400 focus:ring-4 dark:border-slate-700 dark:bg-slate-950 dark:focus:border-sky-500"
                placeholder="you@organization.com"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-sky-200 bg-white px-4 py-3 pr-12 text-sm outline-none ring-sky-400/40 transition focus:border-sky-400 focus:ring-4 dark:border-slate-700 dark:bg-slate-950 dark:focus:border-sky-500"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl p-2 text-slate-500 transition hover:bg-sky-50 hover:text-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-2 w-full justify-center items-center">
                <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-sky-300 text-sky-600 focus:ring-sky-500 dark:border-slate-600 dark:bg-slate-900"
                  />
                  Remember me (48h session).
                </label>
                <label
                  className="inline-flex cursor-pointer items-center gap-2 text-sm text-slate-600 dark:text-slate-300"
                  style={{ marginLeft: "-8px" }}
                >
                  <input
                    type="checkbox"
                    checked={rememberEmail}
                    onChange={(e) => setRememberEmail(e.target.checked)}
                    className="h-4 w-4 rounded border-sky-300 text-sky-600 focus:ring-sky-500 dark:border-slate-600 dark:bg-slate-900"
                  />
                  Remember email on device.
                </label>
              </div>
            </div>

            {message ? (
              <p
                className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-100"
                role="alert"
              >
                {message}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-600/25 transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-sky-500 dark:hover:bg-sky-400"
            >
              {status === "loading" ? "Signing in…" : "Sign in"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
            New to the syndicate?{" "}
            <Link
              href="/signup"
              className="font-semibold text-sky-700 underline-offset-4 hover:underline dark:text-sky-300"
            >
              Create an account
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
