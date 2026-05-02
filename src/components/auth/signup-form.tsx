"use client";

import { FormEvent, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function SignupForm() {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = (await response.json()) as {
        ok?: boolean;
        error?: string;
      };

      if (!response.ok || !data.ok) {
        setStatus("error");
        setMessage(data.error ?? "Unable to create account.");
        return;
      }

      router.push("/console/feed");
      router.refresh();
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  const isDark = isClient && resolvedTheme === "dark";

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-sky-50 via-white to-slate-100 text-slate-900 transition-colors dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100">
      <div className="pointer-events-none absolute left-1/3 top-24 h-56 w-56 rounded-full bg-emerald-300/25 blur-3xl dark:bg-emerald-700/15" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-sky-300/35 blur-3xl dark:bg-sky-700/15" />

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
              Join the syndicate
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
          <p className="inline-flex rounded-full bg-emerald-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200">
            Onboarding
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
            Create your syndicate identity.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-300">
            Once registered, you&apos;ll be signed in automatically with a secure
            48-hour session so you can jump straight into the feed and publishing
            tools.
          </p>
          <div className="mt-10 rounded-3xl border border-dashed border-sky-300/80 bg-white/70 p-5 text-sm text-slate-600 shadow-inner dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300">
            <p className="font-semibold text-slate-900 dark:text-slate-100">
              What you unlock
            </p>
            <ul className="mt-3 space-y-2">
              <li>Live editorial-style feed with favourites.</li>
              <li>Composer for concise geopolitical briefs.</li>
              <li>Search tuned for headline and body context.</li>
            </ul>
          </div>
        </div>

        <div className="rounded-3xl border border-sky-200/80 bg-white/90 p-8 shadow-xl shadow-sky-200/30 backdrop-blur dark:border-slate-700 dark:bg-slate-900/75 dark:shadow-sky-950/30">
          <div>
            <h2 className="text-xl font-semibold">Create account</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Minimum 8 characters for your password.
            </p>
          </div>

          <form className="mt-8 space-y-5" onSubmit={onSubmit} noValidate>
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Full name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                minLength={2}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-2xl border border-sky-200 bg-white px-4 py-3 text-sm outline-none ring-sky-400/40 transition focus:border-sky-400 focus:ring-4 dark:border-slate-700 dark:bg-slate-950 dark:focus:border-sky-500"
                placeholder="Jordan Rivera"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Work email
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
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-sky-200 bg-white px-4 py-3 pr-12 text-sm outline-none ring-sky-400/40 transition focus:border-sky-400 focus:ring-4 dark:border-slate-700 dark:bg-slate-950 dark:focus:border-sky-500"
                  placeholder="At least 8 characters"
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
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-emerald-500 dark:hover:bg-emerald-400"
            >
              {status === "loading" ? "Creating account…" : "Create account"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
            Already have access?{" "}
            <Link
              href="/login"
              className="font-semibold text-sky-700 underline-offset-4 hover:underline dark:text-sky-300"
            >
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
